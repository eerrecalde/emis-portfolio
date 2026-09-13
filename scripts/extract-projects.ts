import Ajv from 'ajv/dist/2020.js';
import addFormats from 'ajv-formats';
import { mkdir, readFile, rename, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

type Curation = {
  documentation: 'pending' | 'ready';
  screenshots: 'pending' | 'ready';
  branch?: string;
};

type ConfigProject = {
  slug: string;
  repositoryUrl: string;
  featured: boolean;
  curation?: Curation;
};

type ProjectsConfig = { projects: ConfigProject[] };

type GithubRepository = {
  name: string;
  full_name: string;
  html_url: string;
  description: string | null;
  homepage: string | null;
  stargazers_count: number;
  forks_count: number;
  open_issues_count: number;
  default_branch: string;
  created_at: string;
  updated_at: string;
};

type GithubRelease = {
  name: string | null;
  tag_name: string;
  html_url: string;
  published_at: string | null;
};

export type ProjectProfile = {
  slug: string;
  featured: boolean;
  curation?: Curation;
  repository: {
    name: string;
    fullName: string;
    url: string;
    description: string | null;
    homepage: string | null;
    stars: number;
    forks: number;
    openIssues: number;
    defaultBranch: string;
    createdAt: string;
    updatedAt: string;
  };
  languages: Array<{ name: string; bytes: number }>;
  readme: string;
  images: string[];
  latestRelease: {
    name: string | null;
    tagName: string;
    url: string;
    publishedAt: string | null;
  } | null;
};

export type GeneratedProjects = { projects: ProjectProfile[] };

export type ExtractOptions = {
  configPath: string;
  schemaPath: string;
  outputPath: string;
  fetchImpl?: typeof fetch;
  token?: string;
};

const githubBaseUrl = 'https://api.github.com';

export function parseRepositoryUrl(repositoryUrl: string): {
  owner: string;
  repo: string;
} {
  const match = /^https:\/\/github\.com\/([^/]+)\/([^/]+)\/?$/.exec(
    repositoryUrl,
  );

  if (!match) {
    throw new Error(`Invalid GitHub repository URL: ${repositoryUrl}`);
  }

  return { owner: match[1], repo: match[2] };
}

export function decodeReadme(content: string, encoding: string): string {
  if (encoding !== 'base64') {
    throw new Error(`Unsupported README encoding: ${encoding}`);
  }

  return Buffer.from(content.replace(/\n/g, ''), 'base64').toString('utf8');
}

export function extractReadmeImages(
  readme: string,
  owner: string,
  repo: string,
  branch: string,
): string[] {
  const imageUrls = readme.matchAll(
    /!\[[^\]]*\]\((?:<)?([^\s)>]+)(?:>)?(?:\s+[^)]*)?\)/g,
  );
  const baseUrl = `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/`;
  const images = new Set<string>();

  for (const match of imageUrls) {
    const imageUrl = match[1];
    if (imageUrl.startsWith('#')) {
      continue;
    }

    const resolvedImageUrl = new URL(
      imageUrl.startsWith('//') ? `https:${imageUrl}` : imageUrl,
      baseUrl,
    );

    if (resolvedImageUrl.protocol === 'https:') {
      images.add(resolvedImageUrl.toString());
    }
  }

  return [...images];
}

function githubHeaders(token?: string): HeadersInit {
  return {
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function githubJson<T>(
  fetchImpl: typeof fetch,
  path: string,
  token?: string,
): Promise<{ status: number; data: T | null }> {
  const response = await fetchImpl(`${githubBaseUrl}${path}`, {
    headers: githubHeaders(token),
  });

  if (response.status === 404) {
    return { status: response.status, data: null };
  }

  if (!response.ok) {
    throw new Error(
      `GitHub API request failed (${response.status}) for ${path}`,
    );
  }

  return { status: response.status, data: (await response.json()) as T };
}

export function normalizeProject(
  project: ConfigProject,
  repository: GithubRepository,
  languages: Record<string, number>,
  readme: string,
  release: GithubRelease | null,
): ProjectProfile {
  return {
    slug: project.slug,
    featured: project.featured,
    ...(project.curation ? { curation: project.curation } : {}),
    repository: {
      name: repository.name,
      fullName: repository.full_name,
      url: repository.html_url,
      description: repository.description,
      homepage: repository.homepage,
      stars: repository.stargazers_count,
      forks: repository.forks_count,
      openIssues: repository.open_issues_count,
      defaultBranch: repository.default_branch,
      createdAt: repository.created_at,
      updatedAt: repository.updated_at,
    },
    languages: Object.entries(languages)
      .map(([name, bytes]) => ({ name, bytes }))
      .sort((a, b) => b.bytes - a.bytes || a.name.localeCompare(b.name)),
    readme,
    images: extractReadmeImages(
      readme,
      repository.full_name.split('/')[0],
      repository.name,
      repository.default_branch,
    ),
    latestRelease: release
      ? {
          name: release.name,
          tagName: release.tag_name,
          url: release.html_url,
          publishedAt: release.published_at,
        }
      : null,
  };
}

async function loadAndValidateConfig(
  configPath: string,
  schemaPath: string,
): Promise<ProjectsConfig> {
  const [configSource, schemaSource] = await Promise.all([
    readFile(configPath, 'utf8'),
    readFile(schemaPath, 'utf8'),
  ]);
  const config = JSON.parse(configSource) as unknown;
  const schema = JSON.parse(schemaSource) as object;
  const ajv = new Ajv({ allErrors: true });
  addFormats(ajv);
  const validate = ajv.compile(schema);
  const configForValidation =
    config && typeof config === 'object'
      ? Object.fromEntries(
          Object.entries(config).filter(([key]) => key !== '$schema'),
        )
      : config;

  if (!validate(configForValidation)) {
    throw new Error(
      `Invalid projects.config.json: ${ajv.errorsText(validate.errors)}`,
    );
  }

  return config as ProjectsConfig;
}

async function extractProfile(
  project: ConfigProject,
  fetchImpl: typeof fetch,
  token?: string,
): Promise<ProjectProfile> {
  const { owner, repo } = parseRepositoryUrl(project.repositoryUrl);
  const basePath = `/repos/${owner}/${repo}`;
  const [repositoryResult, languagesResult, readmeResult, releaseResult] =
    await Promise.all([
      githubJson<GithubRepository>(fetchImpl, basePath, token),
      githubJson<Record<string, number>>(
        fetchImpl,
        `${basePath}/languages`,
        token,
      ),
      githubJson<{ content: string; encoding: string }>(
        fetchImpl,
        `${basePath}/readme`,
        token,
      ),
      githubJson<GithubRelease>(
        fetchImpl,
        `${basePath}/releases/latest`,
        token,
      ),
    ]);

  if (!repositoryResult.data || !languagesResult.data || !readmeResult.data) {
    throw new Error(
      `Required repository data was not found for ${project.repositoryUrl}`,
    );
  }

  return normalizeProject(
    project,
    repositoryResult.data,
    languagesResult.data,
    decodeReadme(readmeResult.data.content, readmeResult.data.encoding),
    releaseResult.data,
  );
}

export async function runExtraction(
  options: ExtractOptions,
): Promise<GeneratedProjects> {
  const config = await loadAndValidateConfig(
    options.configPath,
    options.schemaPath,
  );
  const fetchImpl = options.fetchImpl ?? fetch;
  const projects = await Promise.all(
    config.projects.map((project) =>
      extractProfile(project, fetchImpl, options.token),
    ),
  );
  const output = `${JSON.stringify({ projects }, null, 2)}\n`;

  await mkdir(dirname(options.outputPath), { recursive: true });
  const temporaryOutput = `${options.outputPath}.tmp`;
  await writeFile(temporaryOutput, output, 'utf8');
  await rename(temporaryOutput, options.outputPath);

  return { projects };
}

async function main(): Promise<void> {
  const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
  const result = await runExtraction({
    configPath: resolve(projectRoot, 'projects.config.json'),
    schemaPath: resolve(projectRoot, 'projects.config.schema.json'),
    outputPath: resolve(projectRoot, 'public/data/projects.json'),
    token: process.env.GITHUB_TOKEN,
  });

  console.info(`Generated ${result.projects.length} project profiles.`);
}

if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(process.argv[1]).href
) {
  main().catch((error: unknown) => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  });
}

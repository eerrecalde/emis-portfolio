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

type GithubReadme = {
  content: string;
  encoding: string;
  download_url: string | null;
};

export type ProjectScreenshot = {
  alt: string;
  url: string;
};

export type CuratedProjectSource = {
  slug: string;
  featured: boolean;
  repositoryUrl: string;
  readme: string;
  screenshots: ProjectScreenshot[];
};

export type GeneratedProjects = { projects: CuratedProjectSource[] };

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

export function extractReadmeScreenshots(
  readme: string,
  readmeUrl: string,
): ProjectScreenshot[] {
  const imageUrls = readme.matchAll(
    /!\[([^\]]*)\]\((?:<)?([^\s)>]+)(?:>)?(?:\s+[^)]*)?\)/g,
  );
  const screenshots = new Map<string, ProjectScreenshot>();

  for (const match of imageUrls) {
    const [, alt, imageUrl] = match;
    if (imageUrl.startsWith('#')) {
      continue;
    }

    const resolvedUrl = new URL(
      imageUrl.startsWith('//') ? `https:${imageUrl}` : imageUrl,
      readmeUrl,
    );

    if (resolvedUrl.protocol === 'https:') {
      screenshots.set(resolvedUrl.toString(), {
        alt,
        url: resolvedUrl.toString(),
      });
    }
  }

  return [...screenshots.values()];
}

function githubHeaders(token?: string): HeadersInit {
  return {
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
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

async function extractProjectSource(
  project: ConfigProject,
  fetchImpl: typeof fetch,
  token?: string,
): Promise<CuratedProjectSource> {
  const { owner, repo } = parseRepositoryUrl(project.repositoryUrl);
  const response = await fetchImpl(
    `${githubBaseUrl}/repos/${owner}/${repo}/readme`,
    { headers: githubHeaders(token) },
  );

  if (!response.ok) {
    throw new Error(
      `GitHub README request failed (${response.status}) for ${project.repositoryUrl}`,
    );
  }

  const readme = (await response.json()) as GithubReadme;
  if (!readme.download_url) {
    throw new Error(
      `README download URL was not found for ${project.repositoryUrl}`,
    );
  }

  const content = decodeReadme(readme.content, readme.encoding);
  return {
    slug: project.slug,
    featured: project.featured,
    repositoryUrl: project.repositoryUrl,
    readme: content,
    screenshots: extractReadmeScreenshots(content, readme.download_url),
  };
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
      extractProjectSource(project, fetchImpl, options.token),
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
    outputPath: resolve(projectRoot, 'data/curated-projects.json'),
    token: process.env.GITHUB_TOKEN,
  });

  console.info(`Generated ${result.projects.length} curated project sources.`);
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

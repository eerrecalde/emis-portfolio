import { mkdir, readFile, rename, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import type {
  PortfolioContent,
  PortfolioProject,
  ProfessionalExperience,
} from '../src/types/portfolio';

export type CuratedProjectSource = {
  slug: string;
  featured: boolean;
  repositoryUrl: string;
  readme: string;
  screenshots: PortfolioProject['screenshots'];
};

type CuratedProjects = { projects: CuratedProjectSource[] };
type ProfessionalExperienceSource = { experience: ProfessionalExperience[] };

export type IngestionOptions = {
  curatedProjectsPath: string;
  professionalExperiencePath: string;
  outputPath: string;
};

function cleanMarkdown(value: string): string {
  return value
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/`|\*\*|__/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function section(readme: string, heading: string): string {
  const lines = readme.replace(/\r\n/g, '\n').split('\n');
  const startIndex = lines.indexOf(`## ${heading}`);

  if (startIndex === -1) {
    return '';
  }

  const endIndex = lines.findIndex(
    (line, index) => index > startIndex && line.startsWith('## '),
  );

  return lines
    .slice(startIndex + 1, endIndex === -1 ? undefined : endIndex)
    .join('\n')
    .trim();
}

function list(sectionContent: string): string[] {
  return sectionContent
    .split('\n')
    .filter((line) => line.startsWith('- '))
    .map((line) => cleanMarkdown(line.slice(2)));
}

function firstParagraph(readme: string): string {
  const withoutTitle = readme.replace(/^# .+\r?\n*/, '').trim();
  return cleanMarkdown(withoutTitle.split(/\r?\n\s*\r?\n/)[0] ?? '');
}

function title(readme: string, slug: string): string {
  const match = /^# (.+)$/m.exec(readme);
  if (!match) {
    throw new Error(`Curated README for ${slug} must start with a title.`);
  }

  return cleanMarkdown(match[1]);
}

export function normalizeProject(
  source: CuratedProjectSource,
): PortfolioProject {
  return {
    slug: source.slug,
    title: title(source.readme, source.slug),
    summary: firstParagraph(source.readme),
    whyBuilt: cleanMarkdown(section(source.readme, 'Why I built it')),
    featured: source.featured,
    repositoryUrl: source.repositoryUrl,
    screenshots: source.screenshots,
    capabilities: list(section(source.readme, 'What it does')),
    technicalHighlights: list(section(source.readme, 'Technical highlights')),
    keyDecisions: list(section(source.readme, 'Key decisions and trade-offs')),
    techStack: list(section(source.readme, 'Tech stack')),
    status: cleanMarkdown(section(source.readme, 'Status')),
  };
}

export function buildPortfolioContent(
  curatedProjects: CuratedProjects,
  professionalExperience: ProfessionalExperienceSource,
): PortfolioContent {
  return {
    projects: curatedProjects.projects.map(normalizeProject),
    experience: professionalExperience.experience,
  };
}

export async function runIngestion(
  options: IngestionOptions,
): Promise<PortfolioContent> {
  const [curatedProjectsSource, professionalExperienceSource] =
    await Promise.all([
      readFile(options.curatedProjectsPath, 'utf8'),
      readFile(options.professionalExperiencePath, 'utf8'),
    ]);
  const content = buildPortfolioContent(
    JSON.parse(curatedProjectsSource) as CuratedProjects,
    JSON.parse(professionalExperienceSource) as ProfessionalExperienceSource,
  );
  const output = `${JSON.stringify(content, null, 2)}\n`;

  await mkdir(dirname(options.outputPath), { recursive: true });
  const temporaryOutput = `${options.outputPath}.tmp`;
  await writeFile(temporaryOutput, output, 'utf8');
  await rename(temporaryOutput, options.outputPath);

  return content;
}

async function main(): Promise<void> {
  const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
  const result = await runIngestion({
    curatedProjectsPath: resolve(projectRoot, 'data/curated-projects.json'),
    professionalExperiencePath: resolve(
      projectRoot,
      'data/professional-experience.json',
    ),
    outputPath: resolve(projectRoot, 'public/data/portfolio.json'),
  });

  console.info(
    `Generated portfolio content for ${result.projects.length} projects.`,
  );
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

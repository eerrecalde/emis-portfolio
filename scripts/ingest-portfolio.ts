import { mkdir, readFile, rename, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import type {
  PortfolioContent,
  PortfolioProject,
  PortfolioSkill,
  ProfessionalExperience,
} from '../src/types/portfolio';

export type CuratedProjectSource = {
  slug: string;
  featured: boolean;
  repositoryUrl: string;
  readme: string;
  screenshots: PortfolioProject['screenshots'];
  skillIds: string[];
};

type CuratedProjects = { projects: CuratedProjectSource[] };
export type ManualProjectSource = Omit<PortfolioProject, 'repositoryUrl'> & {
  repositoryUrl?: string;
};

type ManualProjects = { projects: ManualProjectSource[] };
type ProfessionalExperienceSource = { experience: ProfessionalExperience[] };
type SkillCatalogueSource = { skills: PortfolioSkill[] };

export type IngestionOptions = {
  curatedProjectsPath: string;
  manualProjectsPath: string;
  professionalExperiencePath: string;
  skillsPath: string;
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
    skillIds: source.skillIds,
    status: cleanMarkdown(section(source.readme, 'Status')),
  };
}

export function buildPortfolioContent(
  curatedProjects: CuratedProjects,
  manualProjects: ManualProjects,
  professionalExperience: ProfessionalExperienceSource,
  skillCatalogue: SkillCatalogueSource,
): PortfolioContent {
  const knownSkillIds = new Set(skillCatalogue.skills.map((skill) => skill.id));
  const projects = [
    ...curatedProjects.projects.map(normalizeProject),
    ...manualProjects.projects,
  ];
  const projectSlugs = new Set<string>();

  for (const project of projects) {
    if (projectSlugs.has(project.slug)) {
      throw new Error(`Duplicate project slug: ${project.slug}.`);
    }
    projectSlugs.add(project.slug);

    const unknownSkillIds = project.skillIds.filter(
      (skillId) => !knownSkillIds.has(skillId),
    );

    if (unknownSkillIds.length > 0) {
      throw new Error(
        `Project ${project.slug} references unknown skills: ${unknownSkillIds.join(', ')}.`,
      );
    }
  }

  return {
    projects,
    experience: professionalExperience.experience,
    skills: skillCatalogue.skills,
  };
}

export async function runIngestion(
  options: IngestionOptions,
): Promise<PortfolioContent> {
  const [
    curatedProjectsSource,
    manualProjectsSource,
    professionalExperienceSource,
    skillsSource,
  ] =
    await Promise.all([
      readFile(options.curatedProjectsPath, 'utf8'),
      readFile(options.manualProjectsPath, 'utf8'),
      readFile(options.professionalExperiencePath, 'utf8'),
      readFile(options.skillsPath, 'utf8'),
    ]);
  const content = buildPortfolioContent(
    JSON.parse(curatedProjectsSource) as CuratedProjects,
    JSON.parse(manualProjectsSource) as ManualProjects,
    JSON.parse(professionalExperienceSource) as ProfessionalExperienceSource,
    JSON.parse(skillsSource) as SkillCatalogueSource,
  );
  const output = `${JSON.stringify(content, null, 2)}\n`;
  const homeContent = {
    projects: content.projects.map(
      ({ slug, title, summary, featured, screenshots, skillIds, status }) => ({
        slug,
        title,
        summary,
        featured,
        screenshots,
        skillIds,
        status,
      }),
    ),
    skills: content.skills.map(({ id, displayName }) => ({ id, displayName })),
  };
  const projectDetails = { projects: content.projects };

  await mkdir(dirname(options.outputPath), { recursive: true });
  const outputs = [
    [options.outputPath, output],
    [
      resolve(dirname(options.outputPath), 'home.json'),
      `${JSON.stringify(homeContent, null, 2)}\n`,
    ],
    [
      resolve(dirname(options.outputPath), 'project-details.json'),
      `${JSON.stringify(projectDetails, null, 2)}\n`,
    ],
    [
      resolve(dirname(options.outputPath), 'experience.json'),
      `${JSON.stringify({ experience: content.experience }, null, 2)}\n`,
    ],
    [
      resolve(dirname(options.outputPath), 'skills.json'),
      `${JSON.stringify({ skills: content.skills }, null, 2)}\n`,
    ],
  ] as const;

  await Promise.all(
    outputs.map(async ([path, contents]) => {
      const temporaryOutput = `${path}.tmp`;

      await writeFile(temporaryOutput, contents, 'utf8');
      await rename(temporaryOutput, path);
    }),
  );

  return content;
}

async function main(): Promise<void> {
  const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
  const result = await runIngestion({
    curatedProjectsPath: resolve(projectRoot, 'data/curated-projects.json'),
    manualProjectsPath: resolve(projectRoot, 'data/manual-projects.json'),
    professionalExperiencePath: resolve(
      projectRoot,
      'data/professional-experience.json',
    ),
    skillsPath: resolve(projectRoot, 'data/skills.json'),
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

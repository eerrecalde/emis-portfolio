export type ProjectScreenshot = {
  alt: string;
  url: string;
};

export const skillAreas = [
  'frontend',
  'backend',
  'analytics',
  'testing',
  'devops',
  'ci-cd',
] as const;

export type SkillArea = (typeof skillAreas)[number];

export type PortfolioSkill = {
  id: string;
  displayName: string;
  yearsOfExperience: number;
  areas: SkillArea[];
  hideFromSkills?: boolean;
  aliases: string[];
};

export type PortfolioSkillPreview = Pick<PortfolioSkill, 'id' | 'displayName'>;

export type PortfolioProject = {
  slug: string;
  title: string;
  summary: string;
  whyBuilt: string;
  featured: boolean;
  repositoryUrl: string;
  screenshots: ProjectScreenshot[];
  capabilities: string[];
  technicalHighlights: string[];
  keyDecisions: string[];
  skillIds: string[];
  status: string;
};

export type PortfolioProjectPreview = Pick<
  PortfolioProject,
  | 'slug'
  | 'title'
  | 'summary'
  | 'featured'
  | 'screenshots'
  | 'skillIds'
  | 'status'
>;

export type ProfessionalExperience = {
  company: string;
  title: string;
  startDate: string;
  endDate: string;
  location: string;
  highlights: string[];
};

export type PortfolioContent = {
  projects: PortfolioProject[];
  experience: ProfessionalExperience[];
  skills: PortfolioSkill[];
};

export type HomePortfolioContent = {
  projects: PortfolioProjectPreview[];
  skills: PortfolioSkillPreview[];
};

export type ProjectDetailsContent = { projects: PortfolioProject[] };

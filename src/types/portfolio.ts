export type ProjectScreenshot = {
  alt: string;
  url: string;
};

export type PortfolioSkill = {
  id: string;
  displayName: string;
  yearsOfExperience: number;
  aliases: string[];
};

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

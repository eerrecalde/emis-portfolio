import type {
  HomePortfolioContent,
  LearningContent,
  PortfolioSkill,
  ProfessionalExperience,
  ProjectDetailsContent,
} from '../types/portfolio';

async function fetchContent<T>(path: string, label: string): Promise<T> {
  const response = await fetch(`${import.meta.env.BASE_URL}data/${path}`);

  if (!response.ok) {
    throw new Error(`${label} could not be loaded (${response.status}).`);
  }

  return (await response.json()) as T;
}

export function fetchHomePortfolio(): Promise<HomePortfolioContent> {
  return fetchContent('home.json', 'Home content');
}

export function fetchProjectDetails(): Promise<ProjectDetailsContent> {
  return fetchContent('project-details.json', 'Project details');
}

export function fetchExperience(): Promise<{
  experience: ProfessionalExperience[];
}> {
  return fetchContent('experience.json', 'Professional experience');
}

export function fetchSkills(): Promise<{ skills: PortfolioSkill[] }> {
  return fetchContent('skills.json', 'Skills');
}

export function fetchLearning(): Promise<LearningContent> {
  return fetchContent('learning.json', 'Learning content');
}

import type { GeneratedProjects } from '../types/projects';

export async function fetchProjects(): Promise<GeneratedProjects> {
  const response = await fetch('/data/projects.json');

  if (!response.ok) {
    throw new Error(`Project data could not be loaded (${response.status}).`);
  }

  return (await response.json()) as GeneratedProjects;
}

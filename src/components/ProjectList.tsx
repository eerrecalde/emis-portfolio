import type { PortfolioProject, PortfolioSkill } from '../types/portfolio';
import { ProjectCard } from './ProjectCard';

type ProjectListProps = {
  projects: PortfolioProject[];
  skillsById: ReadonlyMap<string, PortfolioSkill>;
  headingLevel?: 'h2' | 'h3';
};

export function ProjectList({
  projects,
  skillsById,
  headingLevel = 'h2',
}: ProjectListProps) {
  return (
    <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {projects.map((project) => (
        <ProjectCard
          headingLevel={headingLevel}
          key={project.slug}
          project={project}
          skillsById={skillsById}
        />
      ))}
    </ul>
  );
}

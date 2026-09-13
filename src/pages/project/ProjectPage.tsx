import { useParams } from 'react-router';
import type { PortfolioProject, PortfolioSkill } from '../../types/portfolio';
import { NotFoundPage } from '../not-found/NotFoundPage';
import { ProjectDetailPage } from './ProjectDetailPage';

type ProjectPageProps = {
  projects: PortfolioProject[];
  skillsById: ReadonlyMap<string, PortfolioSkill>;
};

export function ProjectPage({ projects, skillsById }: ProjectPageProps) {
  const { slug } = useParams();
  const project = projects.find((item) => item.slug === slug);

  return project ? (
    <ProjectDetailPage project={project} skillsById={skillsById} />
  ) : (
    <NotFoundPage />
  );
}

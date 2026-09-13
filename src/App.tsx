import { useQuery } from '@tanstack/react-query';
import { Link, Route, Routes, useParams } from 'react-router';
import { ExperiencePage } from './components/ExperiencePage';
import { HomePage } from './components/HomePage';
import { ProjectDetail } from './components/ProjectDetail';
import { SiteLayout } from './components/SiteLayout';
import { fetchPortfolio } from './data/portfolio';
import type {
  PortfolioProject,
  ProfessionalExperience,
} from './types/portfolio';

export default function App() {
  const projectsQuery = useQuery({
    queryKey: ['portfolio'],
    queryFn: fetchPortfolio,
  });

  return (
    <SiteLayout>
      {projectsQuery.isPending ? <p>Loading portfolio…</p> : null}
      {projectsQuery.isError ? (
        <p role="alert">{projectsQuery.error.message}</p>
      ) : null}
      {projectsQuery.data ? (
        <PortfolioRoutes
          experience={projectsQuery.data.experience}
          projects={projectsQuery.data.projects}
        />
      ) : null}
    </SiteLayout>
  );
}

type PortfolioRoutesProps = {
  projects: PortfolioProject[];
  experience: ProfessionalExperience[];
};

function PortfolioRoutes({ projects, experience }: PortfolioRoutesProps) {
  return (
    <Routes>
      <Route element={<HomePage projects={projects} />} path="/" />
      <Route
        element={<ExperiencePage experience={experience} />}
        path="/experience"
      />
      <Route
        element={<ProjectPage projects={projects} />}
        path="/projects/:slug"
      />
      <Route element={<NotFound />} path="*" />
    </Routes>
  );
}

function ProjectPage({ projects }: Pick<PortfolioRoutesProps, 'projects'>) {
  const { slug } = useParams();
  const project = projects.find((item) => item.slug === slug);

  return project ? <ProjectDetail project={project} /> : <NotFound />;
}

function NotFound() {
  return (
    <section className="max-w-xl" aria-labelledby="not-found-heading">
      <h1
        className="text-3xl font-semibold tracking-tight"
        id="not-found-heading"
      >
        Page not found
      </h1>
      <p className="mt-4 leading-7 text-slate-600">
        The page you are looking for does not exist or is no longer available.
      </p>
      <Link
        className="mt-6 inline-flex font-medium text-indigo-700 hover:text-indigo-900 focus-visible:rounded focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-indigo-700"
        to="/"
      >
        Return to selected work
      </Link>
    </section>
  );
}

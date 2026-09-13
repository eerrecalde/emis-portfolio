import { useQuery } from '@tanstack/react-query';
import { Link, Route, Routes, useParams } from 'react-router';
import { ProjectDetail } from './components/ProjectDetail';
import { ProjectList } from './components/ProjectList';
import { SiteLayout } from './components/SiteLayout';
import { fetchPortfolio } from './data/portfolio';
import type { PortfolioProject } from './types/portfolio';

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
        <PortfolioRoutes projects={projectsQuery.data.projects} />
      ) : null}
    </SiteLayout>
  );
}

type PortfolioRoutesProps = {
  projects: PortfolioProject[];
};

function PortfolioRoutes({ projects }: PortfolioRoutesProps) {
  return (
    <Routes>
      <Route element={<ProjectListing projects={projects} />} path="/" />
      <Route
        element={<ProjectPage projects={projects} />}
        path="/projects/:slug"
      />
      <Route element={<NotFound />} path="*" />
    </Routes>
  );
}

function ProjectListing({ projects }: PortfolioRoutesProps) {
  return (
    <>
      <header className="max-w-2xl">
        <p className="text-sm font-medium text-indigo-700">Portfolio</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-slate-950">
          Selected work
        </h1>
        <p className="mt-4 text-base leading-7 text-slate-600">
          A selection of product-focused projects, with the technical decisions
          behind each one.
        </p>
      </header>
      <section
        className="mt-12"
        id="projects"
        aria-labelledby="projects-heading"
      >
        <h2 className="sr-only" id="projects-heading">
          Projects
        </h2>
        {projects.length > 0 ? (
          <ProjectList projects={projects} />
        ) : (
          <p>No projects are available yet.</p>
        )}
      </section>
    </>
  );
}

function ProjectPage({ projects }: PortfolioRoutesProps) {
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

import { useQuery } from '@tanstack/react-query';
import { Link, Route, Routes, useParams } from 'react-router';
import { HomePage } from './components/HomePage';
import { ProjectDetail } from './components/ProjectDetail';
import { ProjectList } from './components/ProjectList';
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

type ProjectsProps = {
  projects: PortfolioProject[];
};

type PortfolioRoutesProps = ProjectsProps & {
  experience: ProfessionalExperience[];
};

function PortfolioRoutes({ projects, experience }: PortfolioRoutesProps) {
  return (
    <Routes>
      <Route
        element={<HomePage experience={experience} projects={projects} />}
        path="/"
      />
      <Route
        element={<ProjectListing projects={projects} />}
        path="/projects"
      />
      <Route
        element={<ProjectPage projects={projects} />}
        path="/projects/:slug"
      />
      <Route element={<NotFound />} path="*" />
    </Routes>
  );
}

function ProjectListing({ projects }: ProjectsProps) {
  return (
    <section aria-labelledby="projects-heading">
      <header className="max-w-2xl">
        <p className="text-sm font-medium text-indigo-700">Portfolio</p>
        <h1
          className="mt-3 text-4xl font-semibold tracking-tight text-slate-950"
          id="projects-heading"
        >
          Selected work
        </h1>
        <p className="mt-4 text-base leading-7 text-slate-600">
          A selection of product-focused projects, with the technical decisions
          behind each one.
        </p>
      </header>
      {projects.length > 0 ? (
        <div className="mt-12">
          <ProjectList projects={projects} />
        </div>
      ) : (
        <p className="mt-12">No projects are available yet.</p>
      )}
    </section>
  );
}

function ProjectPage({ projects }: ProjectsProps) {
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

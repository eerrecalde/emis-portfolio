import { useQuery } from '@tanstack/react-query';
import { ProjectList } from './components/ProjectList';
import { fetchProjects } from './data/projects';

export default function App() {
  const projectsQuery = useQuery({
    queryKey: ['projects'],
    queryFn: fetchProjects,
  });

  return (
    <main className="mx-auto min-h-screen max-w-6xl px-6 py-16 sm:px-10">
      <header className="max-w-2xl">
        <p className="text-sm font-medium text-indigo-700">
          Portfolio foundation
        </p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-slate-950">
          Selected projects
        </h1>
        <p className="mt-4 text-base leading-7 text-slate-600">
          This app loads curated repository data generated locally from the
          configured project list.
        </p>
      </header>

      <section aria-labelledby="projects-heading" className="mt-12">
        <h2 className="sr-only" id="projects-heading">
          Projects
        </h2>
        {projectsQuery.isPending ? <p>Loading projects…</p> : null}
        {projectsQuery.isError ? (
          <p role="alert">{projectsQuery.error.message}</p>
        ) : null}
        {projectsQuery.data ? (
          <ProjectList projects={projectsQuery.data.projects} />
        ) : null}
      </section>
    </main>
  );
}

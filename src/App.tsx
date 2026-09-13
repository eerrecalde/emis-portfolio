import { useQuery } from '@tanstack/react-query';
import { SiteLayout } from './components/SiteLayout';
import { fetchPortfolio } from './data/portfolio';
import { PortfolioRoutes } from './pages/PortfolioRoutes';

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
          skills={projectsQuery.data.skills}
        />
      ) : null}
    </SiteLayout>
  );
}

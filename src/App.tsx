import { useQuery } from '@tanstack/react-query';
import { SiteLayout } from './components/SiteLayout';
import { currentLearningItems } from './data/learning';
import { fetchLearning } from './data/portfolio';
import { PortfolioRoutes } from './pages/PortfolioRoutes';

export default function App() {
  const learningQuery = useQuery({
    queryKey: ['learning'],
    queryFn: fetchLearning,
    staleTime: Infinity,
  });

  return (
    <SiteLayout
      currentLearning={currentLearningItems(learningQuery.data?.items ?? [])}
    >
      <PortfolioRoutes />
    </SiteLayout>
  );
}

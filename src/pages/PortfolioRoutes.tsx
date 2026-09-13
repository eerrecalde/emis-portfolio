import { useQuery, useQueryClient } from '@tanstack/react-query';
import { lazy, Suspense, useEffect } from 'react';
import { Route, Routes } from 'react-router';
import {
  fetchExperience,
  fetchHomePortfolio,
  fetchProjectDetails,
  fetchSkills,
} from '../data/portfolio';

const HomePage = lazy(() =>
  import('./home/HomePage').then((module) => ({ default: module.HomePage })),
);
const ExperiencePage = lazy(() =>
  import('./experience/ExperiencePage').then((module) => ({
    default: module.ExperiencePage,
  })),
);
const SkillsPage = lazy(() =>
  import('./skills/SkillsPage').then((module) => ({
    default: module.SkillsPage,
  })),
);
const ProjectPage = lazy(() =>
  import('./project/ProjectPage').then((module) => ({
    default: module.ProjectPage,
  })),
);
const NotFoundPage = lazy(() =>
  import('./not-found/NotFoundPage').then((module) => ({
    default: module.NotFoundPage,
  })),
);
const STATIC_CONTENT_STALE_TIME = Infinity;

function PageLoading() {
  return <p>Loading page…</p>;
}

function HomeRoute() {
  const queryClient = useQueryClient();
  const homeQuery = useQuery({
    queryKey: ['home'],
    queryFn: fetchHomePortfolio,
    staleTime: STATIC_CONTENT_STALE_TIME,
  });

  useEffect(() => {
    if (!homeQuery.data) {
      return;
    }

    const warmNonHomeRoutes = () => {
      void queryClient.prefetchQuery({
        queryKey: ['project-details'],
        queryFn: fetchProjectDetails,
        staleTime: STATIC_CONTENT_STALE_TIME,
      });
      void queryClient.prefetchQuery({
        queryKey: ['experience'],
        queryFn: fetchExperience,
        staleTime: STATIC_CONTENT_STALE_TIME,
      });
      void queryClient.prefetchQuery({
        queryKey: ['skills'],
        queryFn: fetchSkills,
        staleTime: STATIC_CONTENT_STALE_TIME,
      });
      void import('./experience/ExperiencePage');
      void import('./skills/SkillsPage');
      void import('./project/ProjectPage');
    };
    const schedule =
      window.requestIdleCallback ??
      ((callback: IdleRequestCallback) => window.setTimeout(callback, 0));
    const cancel = window.cancelIdleCallback ?? window.clearTimeout;
    const task = schedule(warmNonHomeRoutes);

    return () => cancel(task);
  }, [homeQuery.data, queryClient]);

  if (homeQuery.isPending) {
    return <p>Loading portfolio…</p>;
  }

  if (homeQuery.isError) {
    return <p role="alert">{homeQuery.error.message}</p>;
  }

  const skillsById = new Map(
    homeQuery.data.skills.map((skill) => [skill.id, skill]),
  );

  return (
    <HomePage projects={homeQuery.data.projects} skillsById={skillsById} />
  );
}

function ExperienceRoute() {
  const query = useQuery({
    queryKey: ['experience'],
    queryFn: fetchExperience,
    staleTime: STATIC_CONTENT_STALE_TIME,
  });

  if (query.isPending) {
    return <PageLoading />;
  }

  if (query.isError) {
    return <p role="alert">{query.error.message}</p>;
  }

  return <ExperiencePage experience={query.data.experience} />;
}

function SkillsRoute() {
  const query = useQuery({
    queryKey: ['skills'],
    queryFn: fetchSkills,
    staleTime: STATIC_CONTENT_STALE_TIME,
  });

  if (query.isPending) {
    return <PageLoading />;
  }

  if (query.isError) {
    return <p role="alert">{query.error.message}</p>;
  }

  return <SkillsPage skills={query.data.skills} />;
}

function ProjectRoute() {
  const projectsQuery = useQuery({
    queryKey: ['project-details'],
    queryFn: fetchProjectDetails,
    staleTime: STATIC_CONTENT_STALE_TIME,
  });
  const skillsQuery = useQuery({
    queryKey: ['skills'],
    queryFn: fetchSkills,
    staleTime: STATIC_CONTENT_STALE_TIME,
  });

  if (projectsQuery.isPending || skillsQuery.isPending) {
    return <PageLoading />;
  }

  if (projectsQuery.isError || skillsQuery.isError) {
    return (
      <p role="alert">
        {projectsQuery.error?.message ?? skillsQuery.error?.message}
      </p>
    );
  }

  const skillsById = new Map(
    skillsQuery.data.skills.map((skill) => [skill.id, skill]),
  );

  return (
    <ProjectPage
      projects={projectsQuery.data.projects}
      skillsById={skillsById}
    />
  );
}

export function PortfolioRoutes() {
  return (
    <Suspense fallback={<PageLoading />}>
      <Routes>
        <Route element={<HomeRoute />} path="/" />
        <Route element={<ExperienceRoute />} path="/experience" />
        <Route element={<SkillsRoute />} path="/skills" />
        <Route element={<ProjectRoute />} path="/projects/:slug" />
        <Route element={<NotFoundPage />} path="*" />
      </Routes>
    </Suspense>
  );
}

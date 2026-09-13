import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { cleanup, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { MemoryRouter } from 'react-router';
import App from './App';

const portfolio = {
  projects: [
    {
      slug: 'demo',
      title: 'Demo project',
      summary: 'A project used to verify application routes.',
      whyBuilt: 'To verify project detail composition.',
      featured: true,
      repositoryUrl: 'https://github.com/owner/demo',
      screenshots: [],
      capabilities: ['Shows a project detail page.'],
      technicalHighlights: ['Uses accessible routing.'],
      keyDecisions: ['Keep the composition focused.'],
      skillIds: ['typescript'],
      status: 'Ready',
    },
  ],
  experience: [],
  skills: [
    {
      id: 'typescript',
      displayName: 'TypeScript',
      yearsOfExperience: 6,
      aliases: ['ts'],
    },
  ],
};

function renderApp(initialEntry = '/') {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(
    <MemoryRouter initialEntries={[initialEntry]}>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </MemoryRouter>,
  );
}

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

describe('App', () => {
  it('loads and displays generated projects', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(
        async () => new Response(JSON.stringify(portfolio), { status: 200 }),
      ),
    );

    renderApp();

    expect(
      await screen.findByRole('heading', { name: 'Selected projects' }),
    ).toBeInTheDocument();
    await waitFor(() =>
      expect(screen.queryByText('Loading portfolio…')).not.toBeInTheDocument(),
    );
    expect(
      screen.getByRole('link', { name: 'View project: Demo project' }),
    ).toHaveAttribute('href', '/projects/demo');
  });

  it('composes a project detail page from the matching route', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(
        async () => new Response(JSON.stringify(portfolio), { status: 200 }),
      ),
    );

    renderApp('/projects/demo');

    expect(
      await screen.findByRole('heading', { name: 'Demo project' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: 'Technical highlights' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: 'View repository' }),
    ).toHaveAttribute('href', 'https://github.com/owner/demo');
  });

  it('shows professional experience at its dedicated route', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(
        async () => new Response(JSON.stringify(portfolio), { status: 200 }),
      ),
    );

    renderApp('/experience');

    expect(
      await screen.findByRole('heading', { name: 'Professional experience' }),
    ).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Portfolio' })).toHaveAttribute(
      'href',
      '/',
    );
  });

  it('shows a useful not-found page for an unknown route', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(
        async () => new Response(JSON.stringify(portfolio), { status: 200 }),
      ),
    );

    renderApp('/projects/missing');

    expect(
      await screen.findByRole('heading', { name: 'Page not found' }),
    ).toBeInTheDocument();
  });

  it('shows a useful error when the data request fails', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => new Response('', { status: 500 })),
    );

    renderApp();

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Portfolio data could not be loaded (500).',
    );
  });
});

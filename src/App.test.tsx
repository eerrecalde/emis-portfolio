import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import App from './App';

function renderApp() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>,
  );
}

describe('App', () => {
  it('loads and displays generated projects', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(
        async () =>
          new Response(JSON.stringify({ projects: [] }), { status: 200 }),
      ),
    );

    renderApp();

    expect(await screen.findByRole('main')).toHaveTextContent(
      'Selected projects',
    );
    await waitFor(() =>
      expect(screen.queryByText('Loading projects…')).not.toBeInTheDocument(),
    );
  });

  it('shows a useful error when the data request fails', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => new Response('', { status: 500 })),
    );

    renderApp();

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Project data could not be loaded (500).',
    );
  });
});

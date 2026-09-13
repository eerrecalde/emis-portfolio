import { describe, expect, it, vi } from 'vitest';

const render = vi.fn();
const createRoot = vi.fn(() => ({ render }));

vi.mock('react-dom/client', () => ({ createRoot }));
vi.mock('./App', () => ({ default: () => null }));
vi.mock('react-router', () => ({ BrowserRouter: 'browser-router' }));

describe('application entry point', () => {
  it('mounts the React application into the root element', async () => {
    await import('./main');

    expect(createRoot).toHaveBeenCalledWith(document.getElementById('root'));
    expect(render).toHaveBeenCalledOnce();
    expect(render.mock.calls[0][0].props.children.type).toBe('browser-router');
  });
});

import type { ReactNode } from 'react';
import { NavLink } from 'react-router';

type SiteLayoutProps = { children: ReactNode };

export function SiteLayout({ children }: SiteLayoutProps) {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-950">
      <a
        className="sr-only focus:not-sr-only focus:absolute focus:left-6 focus:top-6 focus:z-10 focus:rounded-md focus:bg-white focus:px-4 focus:py-2 focus:font-medium focus:shadow"
        href="#main-content"
      >
        Skip to content
      </a>
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-6 py-5 sm:px-10">
          <NavLink
            className="text-base font-semibold tracking-tight focus-visible:rounded focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-indigo-700"
            to="/"
          >
            Emiliano Errecalde
          </NavLink>
          <nav aria-label="Primary navigation">
            <NavLink
              className={({ isActive }) =>
                `text-sm font-medium focus-visible:rounded focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-indigo-700 ${
                  isActive
                    ? 'text-indigo-700'
                    : 'text-slate-600 hover:text-slate-950'
                }`
              }
              to="/"
            >
              Selected work
            </NavLink>
          </nav>
        </div>
      </header>
      <main
        className="mx-auto max-w-6xl px-6 py-12 sm:px-10 sm:py-16"
        id="main-content"
      >
        {children}
      </main>
    </div>
  );
}

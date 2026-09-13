import type { ReactNode } from 'react';
import { NavLink } from 'react-router';

type SiteLayoutProps = { children: ReactNode };

export function SiteLayout({ children }: SiteLayoutProps) {
  return (
    <div className="min-h-screen text-slate-100">
      <a
        className="sr-only focus:not-sr-only focus:absolute focus:left-6 focus:top-6 focus:z-10 focus:rounded-md focus:bg-slate-50 focus:px-4 focus:py-2 focus:font-medium focus:text-slate-950 focus:shadow"
        href="#main-content"
      >
        Skip to content
      </a>
      <header className="border-b border-slate-800/80 bg-[#080d0f]/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-4 sm:px-10 sm:py-5">
          <NavLink
            className="text-sm font-semibold tracking-tight text-slate-100 focus-visible:rounded focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-300 sm:text-base"
            to="/"
          >
            Emi Errecalde<span className="text-cyan-300">.</span>
          </NavLink>
          <nav
            className="flex items-center gap-4 sm:gap-6"
            aria-label="Primary navigation"
          >
            <NavLink
              className={({ isActive }) =>
                `text-sm font-medium transition-colors focus-visible:rounded focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-300 ${
                  isActive
                    ? 'text-cyan-300'
                    : 'text-slate-400 hover:text-slate-100'
                }`
              }
              to="/"
            >
              Portfolio
            </NavLink>
            <NavLink
              className={({ isActive }) =>
                `text-sm font-medium transition-colors focus-visible:rounded focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-300 ${
                  isActive
                    ? 'text-cyan-300'
                    : 'text-slate-400 hover:text-slate-100'
                }`
              }
              to="/experience"
            >
              Experience
            </NavLink>
            <NavLink
              className={({ isActive }) =>
                `text-sm font-medium transition-colors focus-visible:rounded focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-300 ${
                  isActive
                    ? 'text-cyan-300'
                    : 'text-slate-400 hover:text-slate-100'
                }`
              }
              to="/skills"
            >
              Skills
            </NavLink>
          </nav>
        </div>
      </header>
      <main
        className="mx-auto max-w-6xl px-5 py-12 sm:px-10 sm:py-16 lg:py-20"
        id="main-content"
      >
        {children}
      </main>
    </div>
  );
}

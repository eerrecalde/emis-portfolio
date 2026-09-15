import { useEffect, type ReactNode } from 'react';
import { NavLink, useLocation } from 'react-router';
import type { LearningItem } from '../types/portfolio';

type SiteLayoutProps = {
  children: ReactNode;
  currentLearning?: LearningItem[];
};

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

export function SiteLayout({
  children,
  currentLearning = [],
}: SiteLayoutProps) {
  return (
    <div className="min-h-screen text-slate-100">
      <ScrollToTop />
      <a
        className="sr-only focus:not-sr-only focus:absolute focus:left-6 focus:top-6 focus:z-10 focus:rounded-md focus:bg-slate-50 focus:px-4 focus:py-2 focus:font-medium focus:text-slate-950 focus:shadow"
        href="#main-content"
      >
        Skip to content
      </a>
      <header className="border-b border-slate-800/80 bg-[#080d0f]/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-col items-start gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:px-10 sm:py-5">
          <NavLink
            className="text-lg font-semibold tracking-tight text-slate-100 focus-visible:rounded focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-300 sm:text-lg"
            to="/"
          >
            Emi Errecalde<span className="text-cyan-300">.</span>
          </NavLink>
          {currentLearning.length > 0 ? (
            <p className="hidden items-center gap-2 lg:flex">
              <span className="text-[11px] font-normal text-slate-400">
                Currently learning:
              </span>
              {currentLearning.map((item, index) => (
                <span
                  className="text-sm font-normal text-cyan-300"
                  key={item.id}
                >
                  {index > 0 ? (
                    <span aria-hidden="true" className="mr-2 text-cyan-300/60">
                      ·
                    </span>
                  ) : null}
                  {item.shortDisplayName ?? item.displayName}
                </span>
              ))}
            </p>
          ) : null}
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
            <NavLink
              className={({ isActive }) =>
                `text-sm font-medium transition-colors focus-visible:rounded focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-300 ${
                  isActive
                    ? 'text-cyan-300'
                    : 'text-slate-400 hover:text-slate-100'
                }`
              }
              to="/learning"
            >
              Learning
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

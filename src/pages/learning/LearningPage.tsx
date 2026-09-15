import { orderLearningItems } from '../../data/learning';
import type { LearningItem } from '../../types/portfolio';

type LearningPageProps = { items: LearningItem[] };

export function LearningPage({ items }: LearningPageProps) {
  const orderedItems = orderLearningItems(items);
  const completedCount = orderedItems.filter(
    (item) => item.status === 'completed',
  ).length;

  return (
    <>
      <header className="max-w-3xl">
        <p className="text-xs font-semibold tracking-[0.24em] text-cyan-300 uppercase">
          Learning
        </p>
        <h1 className="mt-4 text-3xl font-normal tracking-tight text-slate-100 sm:text-4xl">
          Learning record
        </h1>
        <p className="mt-5 text-lg leading-8 text-slate-300">
          Current study, completed courses, and credentials.
        </p>
      </header>

      <section className="mt-12 border-t border-slate-800 pt-8" aria-live="polite">
        {orderedItems.length > 0 ? (
          <p className="text-sm text-slate-400">
            {orderedItems.length} course{orderedItems.length === 1 ? '' : 's'},{' '}
            {completedCount} completed
          </p>
        ) : (
          <p className="text-slate-400">
            Course entries will appear here as they are published.
          </p>
        )}
      </section>
    </>
  );
}

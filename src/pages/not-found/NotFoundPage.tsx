import { Link } from 'react-router';

export function NotFoundPage() {
  return (
    <section className="max-w-xl" aria-labelledby="not-found-heading">
      <h1
        className="text-3xl font-semibold tracking-tight"
        id="not-found-heading"
      >
        Page not found
      </h1>
      <p className="mt-4 leading-7 text-slate-600">
        The page you are looking for does not exist or is no longer available.
      </p>
      <Link
        className="mt-6 inline-flex font-medium text-indigo-700 hover:text-indigo-900 focus-visible:rounded focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-indigo-700"
        to="/"
      >
        Return to selected work
      </Link>
    </section>
  );
}

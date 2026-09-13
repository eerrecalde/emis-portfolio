type DetailListProps = { heading: string; id: string; items: string[] };

export function DetailList({ heading, id, items }: DetailListProps) {
  return (
    <section className="mt-10" aria-labelledby={id}>
      <h2 className="text-xl font-semibold text-slate-100" id={id}>
        {heading}
      </h2>
      <ul className="mt-4 list-disc space-y-3 pl-5 leading-7 text-slate-300 marker:text-violet-400">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </section>
  );
}

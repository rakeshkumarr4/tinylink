import prisma from '@/lib/prisma';

export default async function StatsPage() {
  type LinkRow = { shortcode: string; timesAccessed: number | null | undefined };
  const links: LinkRow[] = await prisma.link.findMany({
    orderBy: { timesAccessed: 'desc' },
    select: { shortcode: true, timesAccessed: true },
  });

  type NormalizedLink = { shortcode: string; timesAccessed: number };
  const normalized: NormalizedLink[] = links.map((l) => ({
    shortcode: l.shortcode,
    timesAccessed: Number(l.timesAccessed ?? 0),
  }));

  const max = normalized.reduce((m, l) => Math.max(m, l.timesAccessed), 0) || 1;

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-black p-8">
      <div className="w-full max-w-3xl bg-white dark:bg-zinc-900 p-8 rounded shadow">
        <h1 className="text-2xl font-semibold mb-4 text-black dark:text-zinc-50">Link statistics</h1>
        {links.length === 0 ? (
          <p className="text-sm text-zinc-500">No links to show.</p>
        ) : (
          <div className="space-y-3">
            {normalized.map((link) => {
              const pct = Math.round(((link.timesAccessed ?? 0) / max) * 100);
              return (
                <div key={link.shortcode} className="flex items-center gap-4">
                  <div className="w-36 text-sm text-zinc-700 dark:text-zinc-300">{link.shortcode}</div>
                  <div className="flex-1 bg-zinc-100 dark:bg-zinc-800 rounded overflow-hidden">
                    <div
                      className="h-6 bg-indigo-600"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <div className="w-20 text-right text-sm text-zinc-600 dark:text-zinc-400">{link.timesAccessed}</div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

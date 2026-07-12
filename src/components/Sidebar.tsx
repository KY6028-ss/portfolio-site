import Link from "next/link";
import { getRecentUpdates } from "@/lib/content";
import { formatDate } from "@/lib/format";

export default function Sidebar() {
  const updates = getRecentUpdates(10);
  if (updates.length === 0) return null;

  return (
    <aside
      aria-label="最近の更新"
      className="hidden lg:block w-64 shrink-0 sticky top-4 bg-surface rounded-lg shadow-card p-4"
    >
      <h2 className="m-0 mb-3 text-base font-bold">最近の更新</h2>
      <ul className="list-none m-0 p-0 flex flex-col gap-3">
        {updates.map((update) => (
          <li
            key={update.href}
            className="border-b border-border-subtle pb-3 last:border-b-0 last:pb-0"
          >
            <p className="m-0 mb-1 flex items-center gap-2 text-xs text-muted">
              <span className="px-1.5 py-0.5 rounded bg-accent/10 text-accent font-medium">
                {update.label}
              </span>
              <time dateTime={update.date.toISOString()}>{formatDate(update.date)}</time>
            </p>
            <Link
              href={update.href}
              className="text-sm text-foreground no-underline hover:underline"
            >
              {update.title}
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
}

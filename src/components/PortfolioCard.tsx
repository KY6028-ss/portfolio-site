import Link from "next/link";
import type { PortfolioItem } from "@/lib/content";
import { truncate } from "@/lib/format";

export default function PortfolioCard({ item }: { item: PortfolioItem }) {
  return (
    <article className="border border-border-default p-4 rounded-lg bg-surface">
      <h2 className="mt-0">
        <Link href={`/portfolios/${item.slug}`}>{item.title}</Link>
      </h2>
      <p className="break-words">{truncate(item.description, 100)}</p>
      {item.url && (
        <a href={item.url} target="_blank" rel="noopener">
          詳細を見る
        </a>
      )}
    </article>
  );
}

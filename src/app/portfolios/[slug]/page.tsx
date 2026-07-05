import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Markdown from "@/components/Markdown";
import { getPortfolio, getPortfolios } from "@/lib/content";
import { truncate } from "@/lib/format";

export const dynamicParams = false;

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getPortfolios().map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const item = getPortfolio(slug);
  if (!item) return {};
  return { title: item.title, description: truncate(item.description, 120) };
}

export default async function PortfolioPage({ params }: Props) {
  const { slug } = await params;
  const item = getPortfolio(slug);
  if (!item) notFound();

  return (
    <article>
      <h1>{item.title}</h1>
      {item.imageUrl && (
        // eslint-disable-next-line @next/next/no-img-element -- 外部URL直指定のため next/image は使わない
        <img src={item.imageUrl} alt={item.title} loading="lazy" />
      )}
      <Markdown>{item.description}</Markdown>
      {item.url && (
        <p>
          <a href={item.url} target="_blank" rel="noopener">
            プロジェクトのWebサイトへ
          </a>
        </p>
      )}
      <Link href="/portfolios">一覧に戻る</Link>
    </article>
  );
}

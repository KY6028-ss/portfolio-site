import type { Metadata } from "next";
import PortfolioCard from "@/components/PortfolioCard";
import { getPortfolios } from "@/lib/content";

export const metadata: Metadata = {
  title: "ポートフォリオ / 実績",
  description: "OSS貢献・技術スタック・開発プロダクトをまとめた実績一覧です。",
};

export default function PortfoliosPage() {
  return (
    <>
      <h1>ポートフォリオ / 実績</h1>
      <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-6">
        {getPortfolios().map((item) => (
          <PortfolioCard key={item.slug} item={item} />
        ))}
      </div>
    </>
  );
}

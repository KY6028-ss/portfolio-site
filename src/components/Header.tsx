import Link from "next/link";
import NavLinks from "@/components/NavLinks";
import { getLatestContentUpdate } from "@/lib/content";
import { formatDate } from "@/lib/format";

export default function Header() {
  const latest = getLatestContentUpdate();
  return (
    <nav aria-label="メインナビゲーション" className="bg-nav text-nav-foreground p-4 mb-8">
      <div className="max-w-[1080px] mx-auto flex flex-col items-start gap-4 flex-wrap sm:flex-row sm:items-center sm:justify-between">
        <p className="m-0 text-2xl font-bold">
          <Link href="/" className="text-nav-foreground no-underline hover:underline">
            My Portfolio
          </Link>
        </p>
        <NavLinks />
      </div>
      {latest && (
        <p className="max-w-[1080px] mx-auto mt-2 mb-0 text-xs text-nav-foreground/70">
          最終更新:{" "}
          <time dateTime={latest.toISOString()}>{formatDate(latest, true)}</time>
        </p>
      )}
    </nav>
  );
}

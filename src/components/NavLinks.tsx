"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Profile" },
  { href: "/portfolios", label: "Portfolios" },
  { href: "/blogs", label: "Blog" },
  { href: "/announcements", label: "News" },
];

export default function NavLinks() {
  const pathname = usePathname();

  return (
    <ul className="list-none flex gap-2 m-0 p-0 flex-wrap">
      {links.map(({ href, label }) => {
        const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
        return (
          <li key={href}>
            <Link
              href={href}
              aria-current={active ? "page" : undefined}
              className={`inline-block px-3 py-1.5 rounded-md border text-sm font-medium no-underline transition-colors ${
                active
                  ? "bg-accent text-accent-contrast border-transparent"
                  : "text-nav-foreground bg-nav-foreground/10 border-nav-foreground/25 hover:bg-nav-foreground/25"
              }`}
            >
              {label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

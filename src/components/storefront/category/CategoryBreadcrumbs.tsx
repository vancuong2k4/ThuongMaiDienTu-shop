import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

export interface BreadcrumbItem {
  name: string;
  url: string;
}

interface CategoryBreadcrumbsProps {
  items: BreadcrumbItem[];
}

export function CategoryBreadcrumbs({ items }: CategoryBreadcrumbsProps) {
  // Schema.org BreadcrumbList JSON-LD
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Trang chủ",
        item: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
      },
      ...items.map((item, index) => ({
        "@type": "ListItem",
        position: index + 2,
        name: item.name,
        item: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}${item.url}`,
      })),
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <nav aria-label="Breadcrumb" className="py-3 text-xs text-gray-500 overflow-x-auto scrollbar-hide">
        <ol className="flex items-center gap-1.5 whitespace-nowrap">
          <li className="flex items-center gap-1.5">
            <Link
              href="/"
              className="flex items-center gap-1 hover:text-[#800028] transition-colors"
            >
              <Home className="w-3.5 h-3.5 text-gray-400" />
              <span>Trang chủ</span>
            </Link>
          </li>

          {items.map((item, idx) => {
            const isLast = idx === items.length - 1;
            return (
              <li key={item.url} className="flex items-center gap-1.5">
                <ChevronRight className="w-3.5 h-3.5 text-gray-300 shrink-0" />
                {isLast ? (
                  <span className="font-semibold text-gray-900 truncate max-w-[200px] sm:max-w-none">
                    {item.name}
                  </span>
                ) : (
                  <Link
                    href={item.url}
                    className="hover:text-[#800028] transition-colors truncate max-w-[150px] sm:max-w-none"
                  >
                    {item.name}
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}

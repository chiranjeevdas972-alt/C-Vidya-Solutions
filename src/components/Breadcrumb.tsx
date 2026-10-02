import React from "react";
import { ChevronRight, Home } from "lucide-react";

export interface BreadcrumbItem {
  name: string;
  url: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
  onNavigate?: (url: string) => void;
}

export default function Breadcrumb({ items, className = "", onNavigate }: BreadcrumbProps) {
  const allItems: BreadcrumbItem[] = [
    { name: "Home", url: "/" },
    ...items
  ];

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, url: string) => {
    if (onNavigate) {
      e.preventDefault();
      onNavigate(url);
    }
  };

  return (
    <nav 
      aria-label="Breadcrumb" 
      className={`py-3 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full text-xs text-slate-500 font-medium ${className}`}
    >
      <ol className="flex flex-wrap items-center gap-1.5 sm:gap-2">
        {allItems.map((item, idx) => {
          const isLast = idx === allItems.length - 1;
          return (
            <li key={item.url} className="flex items-center gap-1.5 sm:gap-2">
              {idx > 0 && (
                <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" aria-hidden="true" />
              )}
              {isLast ? (
                <span 
                  className="text-slate-900 font-bold truncate max-w-[200px] sm:max-w-xs" 
                  aria-current="page"
                >
                  {item.name}
                </span>
              ) : (
                <a
                  href={item.url}
                  onClick={(e) => handleClick(e, item.url)}
                  className="hover:text-blue-600 transition-colors flex items-center gap-1 text-slate-600"
                >
                  {idx === 0 && <Home className="w-3.5 h-3.5 shrink-0 text-slate-400" aria-hidden="true" />}
                  <span>{item.name}</span>
                </a>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

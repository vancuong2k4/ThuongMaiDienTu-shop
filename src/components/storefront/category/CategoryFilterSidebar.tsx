"use client";

import { AvailableFilters, FilterContent } from "./FilterContent";

interface CategoryFilterSidebarProps {
  availableFilters: AvailableFilters;
}

export function CategoryFilterSidebar({ availableFilters }: CategoryFilterSidebarProps) {
  return (
    <aside className="w-64 xl:w-72 shrink-0 hidden lg:block">
      <div className="sticky top-24 bg-white rounded-3xl border border-gray-100 p-5 shadow-2xs">
        <FilterContent availableFilters={availableFilters} />
      </div>
    </aside>
  );
}

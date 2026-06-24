"use client";

import { NEIGHBORHOODS } from "@/lib/validation";

// Search + neighborhood filter row shared by the Reviews, Listings, and
// Sublets lists. Purely presentational — state lives in the parent list.
const fieldClass =
  "w-full rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-500 dark:border-zinc-700 dark:bg-zinc-900";

export default function FilterControls({
  search,
  onSearchChange,
  neighborhood,
  onNeighborhoodChange,
  onClear,
  searchPlaceholder,
}: {
  search: string;
  onSearchChange: (value: string) => void;
  neighborhood: string;
  onNeighborhoodChange: (value: string) => void;
  onClear: () => void;
  searchPlaceholder: string;
}) {
  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row">
      <input
        type="search"
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder={searchPlaceholder}
        aria-label={searchPlaceholder}
        className={`${fieldClass} sm:flex-1`}
      />
      <select
        value={neighborhood}
        onChange={(e) => onNeighborhoodChange(e.target.value)}
        aria-label="Filter by neighborhood"
        className={`${fieldClass} sm:w-56`}
      >
        <option value="">All neighborhoods</option>
        {NEIGHBORHOODS.map((n) => (
          <option key={n} value={n}>
            {n}
          </option>
        ))}
      </select>
      <button
        type="button"
        onClick={onClear}
        className="rounded-md border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-900"
      >
        Clear
      </button>
    </div>
  );
}

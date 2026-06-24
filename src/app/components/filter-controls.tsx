"use client";

import type { ReactNode } from "react";
import { NEIGHBORHOODS } from "@/lib/validation";

// Shared filter row for the Reviews, Listings, and Sublets lists. Renders the
// common search box + neighborhood dropdown + Clear button, with a `children`
// slot for page-specific filters. All state lives in the parent list, so the
// single Clear handler resets every filter (old and new) at once.

export const controlClass =
  "rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-500 dark:border-zinc-700 dark:bg-zinc-900";

export function Field({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label
        htmlFor={htmlFor}
        className="text-xs font-medium text-zinc-500 dark:text-zinc-400"
      >
        {label}
      </label>
      {children}
    </div>
  );
}

export default function FilterControls({
  search,
  onSearchChange,
  neighborhood,
  onNeighborhoodChange,
  onClear,
  searchPlaceholder,
  children,
}: {
  search: string;
  onSearchChange: (value: string) => void;
  neighborhood: string;
  onNeighborhoodChange: (value: string) => void;
  onClear: () => void;
  searchPlaceholder: string;
  children?: ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end">
      <Field label="Search" htmlFor="filter-search">
        <input
          id="filter-search"
          type="search"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={searchPlaceholder}
          aria-label={searchPlaceholder}
          className={`${controlClass} w-full sm:w-64`}
        />
      </Field>

      <Field label="Neighborhood" htmlFor="filter-neighborhood">
        <select
          id="filter-neighborhood"
          value={neighborhood}
          onChange={(e) => onNeighborhoodChange(e.target.value)}
          className={`${controlClass} w-full sm:w-48`}
        >
          <option value="">All neighborhoods</option>
          {NEIGHBORHOODS.map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </select>
      </Field>

      {children}

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

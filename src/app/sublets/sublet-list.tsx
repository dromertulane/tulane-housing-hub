"use client";

import { useMemo, useState } from "react";
import FilterControls, { Field, controlClass } from "@/app/components/filter-controls";

export type Sublet = {
  id: string;
  created_at: string;
  building_name: string;
  neighborhood: string;
  rent: number;
  available_from: string;
  available_until: string;
  description: string;
  contact_info: string;
};

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
}

// `available_from`/`available_until` are date-only columns; format in UTC so
// the day doesn't shift across time zones.
function formatDay(value: string) {
  return new Date(value).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
}

export default function SubletList({
  rows,
  loadError,
}: {
  rows: Sublet[];
  loadError: string | null;
}) {
  const [search, setSearch] = useState("");
  const [neighborhood, setNeighborhood] = useState("");
  const [maxRent, setMaxRent] = useState("");
  const [availableOn, setAvailableOn] = useState("");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    const max = maxRent === "" ? null : Number(maxRent);
    return rows.filter((row) => {
      const matchesText = !q || row.building_name.toLowerCase().includes(q);
      const matchesNeighborhood =
        !neighborhood || row.neighborhood === neighborhood;
      const matchesRent = max === null || Number.isNaN(max) || row.rent <= max;
      const matchesDate =
        !availableOn ||
        (row.available_from <= availableOn && availableOn <= row.available_until);
      return matchesText && matchesNeighborhood && matchesRent && matchesDate;
    });
  }, [rows, search, neighborhood, maxRent, availableOn]);

  if (loadError) {
    return <p className="text-sm text-red-600">{loadError}</p>;
  }
  if (rows.length === 0) {
    return (
      <p className="text-sm text-zinc-600 dark:text-zinc-400">
        No sublets yet. Be the first to post one.
      </p>
    );
  }

  return (
    <div>
      <FilterControls
        search={search}
        onSearchChange={setSearch}
        neighborhood={neighborhood}
        onNeighborhoodChange={setNeighborhood}
        onClear={() => {
          setSearch("");
          setNeighborhood("");
          setMaxRent("");
          setAvailableOn("");
        }}
        searchPlaceholder="Search by building…"
      >
        <Field label="Max rent" htmlFor="filter-max-rent">
          <input
            id="filter-max-rent"
            type="number"
            min={0}
            inputMode="numeric"
            value={maxRent}
            onChange={(e) => setMaxRent(e.target.value)}
            placeholder="Any"
            className={`${controlClass} w-full sm:w-32`}
          />
        </Field>
        <Field label="Available on" htmlFor="filter-available-on">
          <input
            id="filter-available-on"
            type="date"
            value={availableOn}
            onChange={(e) => setAvailableOn(e.target.value)}
            className={`${controlClass} w-full sm:w-44`}
          />
        </Field>
      </FilterControls>

      {filtered.length === 0 ? (
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          No results match your search.
        </p>
      ) : (
        <div className="space-y-4">
          {filtered.map((sublet) => (
            <article
              key={sublet.id}
              className="rounded-lg border border-zinc-200 p-5 dark:border-zinc-800"
            >
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h3 className="font-semibold text-zinc-900 dark:text-zinc-50">
                  {sublet.building_name}
                </h3>
                <span className="font-medium text-zinc-900 dark:text-zinc-50">
                  ${sublet.rent.toLocaleString("en-US")}/mo
                </span>
              </div>
              <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                {sublet.neighborhood}
              </p>
              <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                Available {formatDay(sublet.available_from)} –{" "}
                {formatDay(sublet.available_until)}
              </p>
              <p className="mt-3 whitespace-pre-line text-sm text-zinc-800 dark:text-zinc-200">
                {sublet.description}
              </p>
              <p className="mt-3 text-sm text-zinc-700 dark:text-zinc-300">
                <span className="font-medium">Contact:</span>{" "}
                {sublet.contact_info}
              </p>
              <p className="mt-3 text-xs text-zinc-500">
                Posted {formatDate(sublet.created_at)}
              </p>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

"use client";

import { useMemo, useState } from "react";
import FilterControls from "@/app/components/filter-controls";

export type Listing = {
  id: string;
  created_at: string;
  building_name: string;
  neighborhood: string;
  landlord_name: string;
  rent: number;
  bedrooms: number;
  bathrooms: number;
  lease_term: string;
  description: string;
};

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
}

export default function ListingList({
  rows,
  loadError,
}: {
  rows: Listing[];
  loadError: string | null;
}) {
  const [search, setSearch] = useState("");
  const [neighborhood, setNeighborhood] = useState("");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return rows.filter((row) => {
      const matchesText =
        !q ||
        row.landlord_name.toLowerCase().includes(q) ||
        row.building_name.toLowerCase().includes(q);
      const matchesNeighborhood =
        !neighborhood || row.neighborhood === neighborhood;
      return matchesText && matchesNeighborhood;
    });
  }, [rows, search, neighborhood]);

  if (loadError) {
    return <p className="text-sm text-red-600">{loadError}</p>;
  }
  if (rows.length === 0) {
    return (
      <p className="text-sm text-zinc-600 dark:text-zinc-400">
        No listings yet. Be the first to post one.
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
        }}
        searchPlaceholder="Search by landlord or building…"
      />

      {filtered.length === 0 ? (
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          No results match your search.
        </p>
      ) : (
        <div className="space-y-4">
          {filtered.map((listing) => (
            <article
              key={listing.id}
              className="rounded-lg border border-zinc-200 p-5 dark:border-zinc-800"
            >
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h3 className="font-semibold text-zinc-900 dark:text-zinc-50">
                  {listing.building_name}
                </h3>
                <span className="font-medium text-zinc-900 dark:text-zinc-50">
                  ${listing.rent.toLocaleString("en-US")}/mo
                </span>
              </div>
              <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                {listing.neighborhood} · {listing.landlord_name}
              </p>
              <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                {listing.bedrooms} bd · {listing.bathrooms} ba ·{" "}
                {listing.lease_term}
              </p>
              <p className="mt-3 whitespace-pre-line text-sm text-zinc-800 dark:text-zinc-200">
                {listing.description}
              </p>
              <p className="mt-3 text-xs text-zinc-500">
                Posted {formatDate(listing.created_at)}
              </p>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

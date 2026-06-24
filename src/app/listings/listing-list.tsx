"use client";

import { useMemo, useState } from "react";
import FilterControls, { Field, controlClass } from "@/app/components/filter-controls";
import { LEASE_TERMS } from "@/lib/validation";

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
  const [maxRent, setMaxRent] = useState("");
  const [minBedrooms, setMinBedrooms] = useState("");
  const [minBathrooms, setMinBathrooms] = useState("");
  const [leaseTerm, setLeaseTerm] = useState("");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    const maxR = maxRent === "" ? null : Number(maxRent);
    const minBd = minBedrooms === "" ? null : Number(minBedrooms);
    const minBa = minBathrooms === "" ? null : Number(minBathrooms);
    return rows.filter((row) => {
      const matchesText =
        !q ||
        row.landlord_name.toLowerCase().includes(q) ||
        row.building_name.toLowerCase().includes(q);
      const matchesNeighborhood =
        !neighborhood || row.neighborhood === neighborhood;
      const matchesRent =
        maxR === null || Number.isNaN(maxR) || row.rent <= maxR;
      const matchesBedrooms =
        minBd === null || Number.isNaN(minBd) || row.bedrooms >= minBd;
      const matchesBathrooms =
        minBa === null || Number.isNaN(minBa) || row.bathrooms >= minBa;
      const matchesLease = !leaseTerm || row.lease_term === leaseTerm;
      return (
        matchesText &&
        matchesNeighborhood &&
        matchesRent &&
        matchesBedrooms &&
        matchesBathrooms &&
        matchesLease
      );
    });
  }, [rows, search, neighborhood, maxRent, minBedrooms, minBathrooms, leaseTerm]);

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
          setMaxRent("");
          setMinBedrooms("");
          setMinBathrooms("");
          setLeaseTerm("");
        }}
        searchPlaceholder="Search by landlord or building…"
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
        <Field label="Min beds" htmlFor="filter-min-beds">
          <input
            id="filter-min-beds"
            type="number"
            min={0}
            step={1}
            inputMode="numeric"
            value={minBedrooms}
            onChange={(e) => setMinBedrooms(e.target.value)}
            placeholder="Any"
            className={`${controlClass} w-full sm:w-28`}
          />
        </Field>
        <Field label="Min baths" htmlFor="filter-min-baths">
          <input
            id="filter-min-baths"
            type="number"
            min={0}
            step={0.5}
            inputMode="decimal"
            value={minBathrooms}
            onChange={(e) => setMinBathrooms(e.target.value)}
            placeholder="Any"
            className={`${controlClass} w-full sm:w-28`}
          />
        </Field>
        <Field label="Lease term" htmlFor="filter-lease-term">
          <select
            id="filter-lease-term"
            value={leaseTerm}
            onChange={(e) => setLeaseTerm(e.target.value)}
            className={`${controlClass} w-full sm:w-36`}
          >
            <option value="">Any term</option>
            {LEASE_TERMS.map((term) => (
              <option key={term} value={term}>
                {term}
              </option>
            ))}
          </select>
        </Field>
      </FilterControls>

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

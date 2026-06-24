"use client";

import { useMemo, useState } from "react";
import FilterControls, { Field, controlClass } from "@/app/components/filter-controls";

export type Review = {
  id: string;
  created_at: string;
  landlord_name: string;
  building_name: string;
  neighborhood: string;
  rating: number;
  review_text: string;
};

function Stars({ rating }: { rating: number }) {
  const clamped = Math.max(0, Math.min(5, rating));
  return (
    <span
      aria-label={`${clamped} out of 5`}
      className="text-amber-500"
      title={`${clamped}/5`}
    >
      {"★".repeat(clamped)}
      <span className="text-zinc-300 dark:text-zinc-600">
        {"★".repeat(5 - clamped)}
      </span>
    </span>
  );
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
}

export default function ReviewList({
  rows,
  loadError,
}: {
  rows: Review[];
  loadError: string | null;
}) {
  const [search, setSearch] = useState("");
  const [neighborhood, setNeighborhood] = useState("");
  const [minRating, setMinRating] = useState("");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    const min = minRating === "" ? null : Number(minRating);
    return rows.filter((row) => {
      const matchesText =
        !q ||
        row.landlord_name.toLowerCase().includes(q) ||
        row.building_name.toLowerCase().includes(q);
      const matchesNeighborhood =
        !neighborhood || row.neighborhood === neighborhood;
      const matchesRating = min === null || row.rating >= min;
      return matchesText && matchesNeighborhood && matchesRating;
    });
  }, [rows, search, neighborhood, minRating]);

  if (loadError) {
    return <p className="text-sm text-red-600">{loadError}</p>;
  }
  if (rows.length === 0) {
    return (
      <p className="text-sm text-zinc-600 dark:text-zinc-400">
        No reviews yet. Be the first to post one.
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
          setMinRating("");
        }}
        searchPlaceholder="Search by landlord or building…"
      >
        <Field label="Min rating" htmlFor="filter-min-rating">
          <select
            id="filter-min-rating"
            value={minRating}
            onChange={(e) => setMinRating(e.target.value)}
            className={`${controlClass} w-full sm:w-36`}
          >
            <option value="">Any rating</option>
            {[1, 2, 3, 4, 5].map((n) => (
              <option key={n} value={n}>
                {n}
                {n === 5 ? " stars" : "+ stars"}
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
          {filtered.map((review) => (
            <article
              key={review.id}
              className="rounded-lg border border-zinc-200 p-5 dark:border-zinc-800"
            >
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h3 className="font-semibold text-zinc-900 dark:text-zinc-50">
                  {review.landlord_name}
                </h3>
                <Stars rating={review.rating} />
              </div>
              <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                {review.building_name} · {review.neighborhood}
              </p>
              <p className="mt-3 whitespace-pre-line text-sm text-zinc-800 dark:text-zinc-200">
                {review.review_text}
              </p>
              <p className="mt-3 text-xs text-zinc-500">
                {formatDate(review.created_at)}
              </p>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

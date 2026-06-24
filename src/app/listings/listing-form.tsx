"use client";

import { useActionState } from "react";
import { postListing } from "./actions";
import type { ActionState } from "@/lib/auth/types";

const initialState: ActionState = {};

const fieldClass =
  "w-full rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-500 dark:border-zinc-700 dark:bg-zinc-900";
const labelClass = "block text-sm font-medium text-zinc-700 dark:text-zinc-300";

export default function ListingForm() {
  const [state, formAction, pending] = useActionState(
    postListing,
    initialState,
  );

  return (
    <form
      action={formAction}
      className="rounded-lg border border-zinc-200 p-6 dark:border-zinc-800"
    >
      <h2 className="text-xl font-semibold">Post a listing</h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div>
          <label className={labelClass} htmlFor="building_name">
            Building / property name
          </label>
          <input
            id="building_name"
            name="building_name"
            type="text"
            required
            className={fieldClass}
          />
        </div>
        <div>
          <label className={labelClass} htmlFor="neighborhood">
            Neighborhood
          </label>
          <input
            id="neighborhood"
            name="neighborhood"
            type="text"
            required
            className={fieldClass}
          />
        </div>
        <div>
          <label className={labelClass} htmlFor="landlord_name">
            Landlord name
          </label>
          <input
            id="landlord_name"
            name="landlord_name"
            type="text"
            required
            className={fieldClass}
          />
        </div>
        <div>
          <label className={labelClass} htmlFor="rent">
            Monthly rent (USD)
          </label>
          <input
            id="rent"
            name="rent"
            type="number"
            min={0}
            step={1}
            required
            className={fieldClass}
          />
        </div>
        <div>
          <label className={labelClass} htmlFor="bedrooms">
            Bedrooms
          </label>
          <input
            id="bedrooms"
            name="bedrooms"
            type="number"
            min={0}
            step={1}
            required
            className={fieldClass}
          />
        </div>
        <div>
          <label className={labelClass} htmlFor="bathrooms">
            Bathrooms
          </label>
          <input
            id="bathrooms"
            name="bathrooms"
            type="number"
            min={0}
            step={0.5}
            required
            className={fieldClass}
          />
        </div>
        <div>
          <label className={labelClass} htmlFor="lease_term">
            Lease term
          </label>
          <input
            id="lease_term"
            name="lease_term"
            type="text"
            placeholder="e.g. 12 months"
            required
            className={fieldClass}
          />
        </div>
      </div>
      <div className="mt-4">
        <label className={labelClass} htmlFor="description">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          rows={4}
          required
          className={fieldClass}
        />
      </div>

      {state.error && (
        <p aria-live="polite" className="mt-3 text-sm text-red-600">
          {state.error}
        </p>
      )}
      {state.message && (
        <p
          aria-live="polite"
          className="mt-3 rounded-md bg-green-50 px-3 py-2 text-sm text-green-700 dark:bg-green-950 dark:text-green-300"
        >
          {state.message}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="mt-4 rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-700 disabled:opacity-60 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
      >
        {pending ? "Posting…" : "Post listing"}
      </button>
    </form>
  );
}

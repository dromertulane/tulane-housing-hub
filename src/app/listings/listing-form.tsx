"use client";

import { useActionState } from "react";
import { postListing } from "./actions";
import PreservedSelect from "@/app/components/preserved-select";
import {
  NEIGHBORHOODS,
  LEASE_TERMS,
  SHORT_MAX,
  LONG_MAX,
  RENT_MAX,
  BEDROOMS_MAX,
  LISTING_FIELDS,
  collectRaw,
  validateListing,
} from "@/lib/validation";
import type { ActionState } from "@/lib/auth/types";

const initialState: ActionState = {};

const fieldClass =
  "w-full rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-500 dark:border-zinc-700 dark:bg-zinc-900";
const labelClass = "block text-sm font-medium text-zinc-700 dark:text-zinc-300";

const neighborhoodOptions = NEIGHBORHOODS.map((n) => ({ value: n, label: n }));
const leaseTermOptions = LEASE_TERMS.map((t) => ({ value: t, label: t }));

export default function ListingForm() {
  const [state, formAction, pending] = useActionState(
    async (prev: ActionState, formData: FormData): Promise<ActionState> => {
      const result = validateListing(formData);
      if ("error" in result) {
        return { error: result.error, values: collectRaw(formData, LISTING_FIELDS) };
      }
      return postListing(prev, formData);
    },
    initialState,
  );

  const v = state.values ?? {};

  return (
    <form
      action={formAction}
      noValidate
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
            maxLength={SHORT_MAX}
            defaultValue={v.building_name ?? ""}
            className={fieldClass}
          />
        </div>
        <div>
          <label className={labelClass} htmlFor="neighborhood">
            Neighborhood
          </label>
          <PreservedSelect
            id="neighborhood"
            name="neighborhood"
            placeholder="Select a neighborhood…"
            preserved={v.neighborhood ?? ""}
            options={neighborhoodOptions}
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
            maxLength={SHORT_MAX}
            defaultValue={v.landlord_name ?? ""}
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
            min={1}
            max={RENT_MAX}
            step={1}
            required
            defaultValue={v.rent ?? ""}
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
            max={BEDROOMS_MAX}
            step={1}
            required
            defaultValue={v.bedrooms ?? ""}
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
            min={1}
            step={0.5}
            required
            defaultValue={v.bathrooms ?? ""}
            className={fieldClass}
          />
        </div>
        <div>
          <label className={labelClass} htmlFor="lease_term">
            Lease term
          </label>
          <PreservedSelect
            id="lease_term"
            name="lease_term"
            placeholder="Select lease term…"
            preserved={v.lease_term ?? ""}
            options={leaseTermOptions}
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
          maxLength={LONG_MAX}
          defaultValue={v.description ?? ""}
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

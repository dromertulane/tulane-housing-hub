"use client";

import { useActionState } from "react";
import { postReview } from "./actions";
import PreservedSelect from "@/app/components/preserved-select";
import {
  NEIGHBORHOODS,
  SHORT_MAX,
  LONG_MAX,
  REVIEW_FIELDS,
  collectRaw,
  validateReview,
} from "@/lib/validation";
import type { ActionState } from "@/lib/auth/types";

const initialState: ActionState = {};

const fieldClass =
  "w-full rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-500 dark:border-zinc-700 dark:bg-zinc-900";
const labelClass = "block text-sm font-medium text-zinc-700 dark:text-zinc-300";

const neighborhoodOptions = NEIGHBORHOODS.map((n) => ({ value: n, label: n }));
const ratingOptions = [1, 2, 3, 4, 5].map((n) => ({
  value: String(n),
  label: `${n} ${n === 1 ? "star" : "stars"}`,
}));

export default function ReviewForm() {
  const [state, formAction, pending] = useActionState(
    async (prev: ActionState, formData: FormData): Promise<ActionState> => {
      // Client-side check using the same rules as the Server Action; on
      // failure, return the input so the form stays populated.
      const result = validateReview(formData);
      if ("error" in result) {
        return { error: result.error, values: collectRaw(formData, REVIEW_FIELDS) };
      }
      return postReview(prev, formData);
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
      <h2 className="text-xl font-semibold">Post a review</h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
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
            placeholder="Select neighborhood"
            preserved={v.neighborhood ?? ""}
            options={neighborhoodOptions}
          />
        </div>
        <div>
          <label className={labelClass} htmlFor="rating">
            Rating
          </label>
          <PreservedSelect
            id="rating"
            name="rating"
            placeholder="Select 1–5"
            preserved={v.rating ?? ""}
            options={ratingOptions}
          />
        </div>
      </div>
      <div className="mt-4">
        <label className={labelClass} htmlFor="review_text">
          Review
        </label>
        <textarea
          id="review_text"
          name="review_text"
          rows={4}
          required
          maxLength={LONG_MAX}
          defaultValue={v.review_text ?? ""}
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
        {pending ? "Posting…" : "Post review"}
      </button>
    </form>
  );
}

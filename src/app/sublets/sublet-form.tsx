"use client";

import { useActionState } from "react";
import { postSublet } from "./actions";
import {
  NEIGHBORHOODS,
  SHORT_MAX,
  LONG_MAX,
  RENT_MAX,
  validateSublet,
} from "@/lib/validation";
import type { ActionState } from "@/lib/auth/types";

const initialState: ActionState = {};

const fieldClass =
  "w-full rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-500 dark:border-zinc-700 dark:bg-zinc-900";
const labelClass = "block text-sm font-medium text-zinc-700 dark:text-zinc-300";

export default function SubletForm() {
  const [state, formAction, pending] = useActionState(
    async (prev: ActionState, formData: FormData): Promise<ActionState> => {
      const result = validateSublet(formData);
      if ("error" in result) return { error: result.error };
      return postSublet(prev, formData);
    },
    initialState,
  );

  return (
    <form
      action={formAction}
      noValidate
      className="rounded-lg border border-zinc-200 p-6 dark:border-zinc-800"
    >
      <h2 className="text-xl font-semibold">Post a sublet</h2>
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
            className={fieldClass}
          />
        </div>
        <div>
          <label className={labelClass} htmlFor="neighborhood">
            Neighborhood
          </label>
          <select
            id="neighborhood"
            name="neighborhood"
            required
            defaultValue=""
            className={fieldClass}
          >
            <option value="" disabled>
              Select neighborhood
            </option>
            {NEIGHBORHOODS.map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
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
            className={fieldClass}
          />
        </div>
        <div className="hidden sm:block" aria-hidden="true" />
        <div>
          <label className={labelClass} htmlFor="available_from">
            Available from
          </label>
          <input
            id="available_from"
            name="available_from"
            type="date"
            required
            className={fieldClass}
          />
        </div>
        <div>
          <label className={labelClass} htmlFor="available_until">
            Available until
          </label>
          <input
            id="available_until"
            name="available_until"
            type="date"
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
          maxLength={LONG_MAX}
          className={fieldClass}
        />
      </div>
      <div className="mt-4">
        <label className={labelClass} htmlFor="contact_info">
          Contact info
        </label>
        <input
          id="contact_info"
          name="contact_info"
          type="text"
          required
          maxLength={SHORT_MAX}
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
        {pending ? "Posting…" : "Post sublet"}
      </button>
    </form>
  );
}

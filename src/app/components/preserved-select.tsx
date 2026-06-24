"use client";

import { useState } from "react";

// A controlled <select> that keeps the user's choice after a rejected submit.
// Uncontrolled selects only honor `defaultValue` at mount, so React's
// post-action form reset would revert them to the placeholder. Driving the
// value from state (synced to `preserved`) makes the selection stick.
export type SelectOption = { value: string; label: string };

const fieldClass =
  "w-full rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-500 dark:border-zinc-700 dark:bg-zinc-900";

export default function PreservedSelect({
  id,
  name,
  options,
  placeholder,
  preserved,
}: {
  id: string;
  name: string;
  options: readonly SelectOption[];
  placeholder: string;
  preserved: string;
}) {
  const [value, setValue] = useState(preserved);

  // Re-sync when the action returns a new preserved value (e.g. after a
  // rejected submit). Adjusting state during render is React's recommended
  // alternative to a syncing effect.
  const [lastPreserved, setLastPreserved] = useState(preserved);
  if (preserved !== lastPreserved) {
    setLastPreserved(preserved);
    setValue(preserved);
  }

  return (
    <select
      id={id}
      name={name}
      required
      value={value}
      onChange={(e) => setValue(e.target.value)}
      className={fieldClass}
    >
      <option value="" disabled>
        {placeholder}
      </option>
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}

"use client";

// A <select> that keeps the user's choice after a rejected submit.
//
// React only applies a select's default selection at mount, and React 19's
// automatic form reset (after a `useActionState` action) reverts an
// uncontrolled select to that mount-time default. By keying the element on
// `preserved`, the select remounts whenever the returned value changes, so the
// new value becomes the default the reset restores — mirroring how the
// uncontrolled text inputs preserve their values. When `preserved` is empty
// (no selection), it defaults to the disabled placeholder, not a real option.
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
  return (
    <select
      key={preserved}
      id={id}
      name={name}
      required
      defaultValue={preserved}
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

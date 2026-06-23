"use client";

import { useActionState } from "react";
import { signIn, signUp } from "@/lib/auth/actions";
import type { ActionState } from "@/lib/auth/types";

const initialState: ActionState = {};

const fieldClass =
  "w-full rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-500 dark:border-zinc-700 dark:bg-zinc-900";
const labelClass = "block text-sm font-medium text-zinc-700 dark:text-zinc-300";
const buttonClass =
  "mt-4 w-full rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-700 disabled:opacity-60 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200";

export default function AuthForm() {
  const [signInState, signInAction, signInPending] = useActionState(
    signIn,
    initialState,
  );
  const [signUpState, signUpAction, signUpPending] = useActionState(
    signUp,
    initialState,
  );

  return (
    <div className="grid gap-8 sm:grid-cols-2">
      <form
        action={signInAction}
        className="rounded-lg border border-zinc-200 p-6 dark:border-zinc-800"
      >
        <h2 className="text-xl font-semibold">Log in</h2>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          Welcome back.
        </p>
        <div className="mt-4 space-y-3">
          <div>
            <label className={labelClass} htmlFor="signin-email">
              Email
            </label>
            <input
              id="signin-email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className={fieldClass}
            />
          </div>
          <div>
            <label className={labelClass} htmlFor="signin-password">
              Password
            </label>
            <input
              id="signin-password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              className={fieldClass}
            />
          </div>
        </div>
        {signInState.error && (
          <p aria-live="polite" className="mt-3 text-sm text-red-600">
            {signInState.error}
          </p>
        )}
        <button type="submit" disabled={signInPending} className={buttonClass}>
          {signInPending ? "Logging in…" : "Log in"}
        </button>
      </form>

      <form
        action={signUpAction}
        className="rounded-lg border border-zinc-200 p-6 dark:border-zinc-800"
      >
        <h2 className="text-xl font-semibold">Sign up</h2>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          Use your @tulane.edu email address.
        </p>
        <div className="mt-4 space-y-3">
          <div>
            <label className={labelClass} htmlFor="signup-email">
              Email
            </label>
            <input
              id="signup-email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="you@tulane.edu"
              required
              className={fieldClass}
            />
          </div>
          <div>
            <label className={labelClass} htmlFor="signup-password">
              Password
            </label>
            <input
              id="signup-password"
              name="password"
              type="password"
              autoComplete="new-password"
              minLength={6}
              required
              className={fieldClass}
            />
          </div>
        </div>
        {signUpState.error && (
          <p aria-live="polite" className="mt-3 text-sm text-red-600">
            {signUpState.error}
          </p>
        )}
        {signUpState.message && (
          <p
            aria-live="polite"
            className="mt-3 rounded-md bg-green-50 px-3 py-2 text-sm text-green-700 dark:bg-green-950 dark:text-green-300"
          >
            {signUpState.message}
          </p>
        )}
        <button type="submit" disabled={signUpPending} className={buttonClass}>
          {signUpPending ? "Creating account…" : "Sign up"}
        </button>
      </form>
    </div>
  );
}

"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import type { ActionState } from "./types";

const TULANE_DOMAIN = "@tulane.edu";

function readCredentials(formData: FormData) {
  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();
  const password = String(formData.get("password") ?? "");
  return { email, password };
}

const NOT_CONFIGURED =
  "Authentication is not configured yet. Add your Supabase environment variables.";

export async function signUp(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const { email, password } = readCredentials(formData);

  if (!email || !password) {
    return { error: "Enter your email and a password." };
  }
  if (!email.endsWith(TULANE_DOMAIN)) {
    return { error: "Sign up is restricted to @tulane.edu email addresses." };
  }
  if (!isSupabaseConfigured) {
    return { error: NOT_CONFIGURED };
  }

  const hdrs = await headers();
  const origin = hdrs.get("origin") ?? `https://${hdrs.get("host") ?? ""}`;

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { emailRedirectTo: `${origin}/auth/callback` },
  });

  if (error) {
    return { error: error.message };
  }

  // Email confirmation disabled: Supabase returns an active session, so the
  // user is already logged in — send them to the home page.
  if (data.session) {
    revalidatePath("/", "layout");
    redirect("/");
  }

  // Email confirmation enabled: no session yet; ask the user to confirm.
  return {
    message: "Check your email to confirm your account before logging in.",
  };
}

export async function signIn(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const { email, password } = readCredentials(formData);

  if (!email || !password) {
    return { error: "Enter your email and password." };
  }
  if (!isSupabaseConfigured) {
    return { error: NOT_CONFIGURED };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/", "layout");
  redirect("/");
}

export async function signOut() {
  if (isSupabaseConfigured) {
    const supabase = await createClient();
    await supabase.auth.signOut();
  }
  revalidatePath("/", "layout");
  redirect("/login");
}

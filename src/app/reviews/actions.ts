"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { validateReview } from "@/lib/validation";
import type { ActionState } from "@/lib/auth/types";

export async function postReview(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const result = validateReview(formData);
  if ("error" in result) {
    return { error: result.error };
  }

  if (!isSupabaseConfigured) {
    return {
      error: "Reviews are not available yet. Add your Supabase environment variables.",
    };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { error: "You must be logged in to post a review." };
  }

  const { error } = await supabase.from("reviews").insert({
    user_id: user.id,
    ...result.values,
  });
  if (error) {
    return { error: error.message };
  }

  revalidatePath("/reviews");
  return { message: "Your review has been posted." };
}

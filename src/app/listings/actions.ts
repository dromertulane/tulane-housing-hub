"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { validateListing, collectRaw, LISTING_FIELDS } from "@/lib/validation";
import type { ActionState } from "@/lib/auth/types";

export async function postListing(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const values = collectRaw(formData, LISTING_FIELDS);

  const result = validateListing(formData);
  if ("error" in result) {
    return { error: result.error, values };
  }

  if (!isSupabaseConfigured) {
    return {
      error: "Listings are not available yet. Add your Supabase environment variables.",
      values,
    };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { error: "You must be logged in to post a listing.", values };
  }

  const { error } = await supabase.from("listings").insert({
    user_id: user.id,
    ...result.values,
  });
  if (error) {
    return { error: error.message, values };
  }

  revalidatePath("/listings");
  return { message: "Your listing has been posted." };
}

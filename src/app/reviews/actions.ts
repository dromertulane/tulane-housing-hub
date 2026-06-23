"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import type { ActionState } from "@/lib/auth/types";

function readField(formData: FormData, name: string) {
  return String(formData.get(name) ?? "").trim();
}

export async function postReview(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  if (!isSupabaseConfigured) {
    return {
      error: "Reviews are not available yet. Add your Supabase environment variables.",
    };
  }

  const landlord_name = readField(formData, "landlord_name");
  const building_name = readField(formData, "building_name");
  const neighborhood = readField(formData, "neighborhood");
  const review_text = readField(formData, "review_text");
  const rating = Number(readField(formData, "rating"));

  if (!landlord_name || !building_name || !neighborhood || !review_text) {
    return { error: "Please fill in all fields." };
  }
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    return { error: "Rating must be a whole number from 1 to 5." };
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
    landlord_name,
    building_name,
    neighborhood,
    rating,
    review_text,
  });
  if (error) {
    return { error: error.message };
  }

  revalidatePath("/reviews");
  return { message: "Your review has been posted." };
}

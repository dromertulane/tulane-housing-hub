"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import type { ActionState } from "@/lib/auth/types";

function readField(formData: FormData, name: string) {
  return String(formData.get(name) ?? "").trim();
}

export async function postSublet(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  if (!isSupabaseConfigured) {
    return {
      error: "Sublets are not available yet. Add your Supabase environment variables.",
    };
  }

  const building_name = readField(formData, "building_name");
  const neighborhood = readField(formData, "neighborhood");
  const available_from = readField(formData, "available_from");
  const available_until = readField(formData, "available_until");
  const description = readField(formData, "description");
  const contact_info = readField(formData, "contact_info");
  const rentRaw = readField(formData, "rent");
  const rent = Number(rentRaw);

  if (
    !building_name ||
    !neighborhood ||
    !available_from ||
    !available_until ||
    !description ||
    !contact_info ||
    !rentRaw
  ) {
    return { error: "Please fill in all fields." };
  }
  if (!Number.isInteger(rent) || rent < 0) {
    return { error: "Monthly rent must be a non-negative whole number." };
  }
  if (available_until < available_from) {
    return { error: "“Available until” must be on or after “available from”." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { error: "You must be logged in to post a sublet." };
  }

  const { error } = await supabase.from("sublets").insert({
    user_id: user.id,
    building_name,
    neighborhood,
    rent,
    available_from,
    available_until,
    description,
    contact_info,
  });
  if (error) {
    return { error: error.message };
  }

  revalidatePath("/sublets");
  return { message: "Your sublet has been posted." };
}

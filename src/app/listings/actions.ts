"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import type { ActionState } from "@/lib/auth/types";

function readField(formData: FormData, name: string) {
  return String(formData.get(name) ?? "").trim();
}

export async function postListing(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  if (!isSupabaseConfigured) {
    return {
      error: "Listings are not available yet. Add your Supabase environment variables.",
    };
  }

  const building_name = readField(formData, "building_name");
  const neighborhood = readField(formData, "neighborhood");
  const landlord_name = readField(formData, "landlord_name");
  const lease_term = readField(formData, "lease_term");
  const description = readField(formData, "description");
  const rentRaw = readField(formData, "rent");
  const bedroomsRaw = readField(formData, "bedrooms");
  const bathroomsRaw = readField(formData, "bathrooms");
  const rent = Number(rentRaw);
  const bedrooms = Number(bedroomsRaw);
  const bathrooms = Number(bathroomsRaw);

  if (
    !building_name ||
    !neighborhood ||
    !landlord_name ||
    !lease_term ||
    !description ||
    !rentRaw ||
    !bedroomsRaw ||
    !bathroomsRaw
  ) {
    return { error: "Please fill in all fields." };
  }
  if (!Number.isInteger(rent) || rent < 0) {
    return { error: "Monthly rent must be a non-negative whole number." };
  }
  if (!Number.isInteger(bedrooms) || bedrooms < 0) {
    return { error: "Bedrooms must be a non-negative whole number." };
  }
  if (!Number.isFinite(bathrooms) || bathrooms < 0) {
    return { error: "Bathrooms must be a non-negative number (halves allowed)." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { error: "You must be logged in to post a listing." };
  }

  const { error } = await supabase.from("listings").insert({
    user_id: user.id,
    building_name,
    neighborhood,
    landlord_name,
    rent,
    bedrooms,
    bathrooms,
    lease_term,
    description,
  });
  if (error) {
    return { error: error.message };
  }

  revalidatePath("/listings");
  return { message: "Your listing has been posted." };
}

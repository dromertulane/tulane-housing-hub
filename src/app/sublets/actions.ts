"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { validateSublet, collectRaw, SUBLET_FIELDS } from "@/lib/validation";
import type { ActionState } from "@/lib/auth/types";

export async function postSublet(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const values = collectRaw(formData, SUBLET_FIELDS);

  const result = validateSublet(formData);
  if ("error" in result) {
    return { error: result.error, values };
  }

  if (!isSupabaseConfigured) {
    return {
      error: "Sublets are not available yet. Add your Supabase environment variables.",
      values,
    };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { error: "You must be logged in to post a sublet.", values };
  }

  const { error } = await supabase.from("sublets").insert({
    user_id: user.id,
    ...result.values,
  });
  if (error) {
    return { error: error.message, values };
  }

  revalidatePath("/sublets");
  return { message: "Your sublet has been posted." };
}

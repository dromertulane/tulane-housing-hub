import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import SubletForm from "./sublet-form";
import SubletList, { type Sublet } from "./sublet-list";

export default async function SubletsPage() {
  let isLoggedIn = false;
  let sublets: Sublet[] = [];
  let loadError: string | null = null;

  if (isSupabaseConfigured) {
    try {
      const supabase = await createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      isLoggedIn = !!user;

      const { data, error } = await supabase
        .from("sublets")
        .select(
          "id, created_at, building_name, neighborhood, rent, available_from, available_until, description, contact_info",
        )
        .order("created_at", { ascending: false });

      if (error) {
        loadError = error.message;
      } else {
        sublets = (data as Sublet[]) ?? [];
      }
    } catch {
      loadError = "Unable to load sublets right now.";
    }
  }

  return (
    <section>
      <h1 className="text-3xl font-semibold tracking-tight">Sublets</h1>
      <p className="mt-2 text-zinc-600 dark:text-zinc-400">
        Find and post short-term sublets for the semester or summer.
      </p>

      <div className="mt-8">
        {isLoggedIn ? (
          <SubletForm />
        ) : (
          <div className="rounded-lg border border-zinc-200 p-6 text-sm text-zinc-600 dark:border-zinc-800 dark:text-zinc-400">
            <Link
              href="/login"
              className="font-medium text-zinc-900 underline underline-offset-4 dark:text-zinc-50"
            >
              Log in
            </Link>{" "}
            to post a sublet.
          </div>
        )}
      </div>

      <div className="mt-10">
        <SubletList rows={sublets} loadError={loadError} />
      </div>
    </section>
  );
}

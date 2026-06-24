import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import ListingForm from "./listing-form";
import ListingList, { type Listing } from "./listing-list";

export default async function ListingsPage() {
  let isLoggedIn = false;
  let listings: Listing[] = [];
  let loadError: string | null = null;

  if (isSupabaseConfigured) {
    try {
      const supabase = await createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      isLoggedIn = !!user;

      const { data, error } = await supabase
        .from("listings")
        .select(
          "id, created_at, building_name, neighborhood, landlord_name, rent, bedrooms, bathrooms, lease_term, description",
        )
        .order("created_at", { ascending: false });

      if (error) {
        loadError = error.message;
      } else {
        listings = (data as Listing[]) ?? [];
      }
    } catch {
      loadError = "Unable to load listings right now.";
    }
  }

  return (
    <section>
      <h1 className="text-3xl font-semibold tracking-tight">Listings</h1>
      <p className="mt-2 text-zinc-600 dark:text-zinc-400">
        Browse available housing listings near campus.
      </p>

      <div className="mt-8">
        {isLoggedIn ? (
          <ListingForm />
        ) : (
          <div className="rounded-lg border border-zinc-200 p-6 text-sm text-zinc-600 dark:border-zinc-800 dark:text-zinc-400">
            <Link
              href="/login"
              className="font-medium text-zinc-900 underline underline-offset-4 dark:text-zinc-50"
            >
              Log in
            </Link>{" "}
            to post a listing.
          </div>
        )}
      </div>

      <div className="mt-10">
        <ListingList rows={listings} loadError={loadError} />
      </div>
    </section>
  );
}

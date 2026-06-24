import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import ListingForm from "./listing-form";

type Listing = {
  id: string;
  created_at: string;
  building_name: string;
  neighborhood: string;
  landlord_name: string;
  rent: number;
  bedrooms: number;
  bathrooms: number;
  lease_term: string;
  description: string;
};

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

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

      <div className="mt-10 space-y-4">
        {loadError && <p className="text-sm text-red-600">{loadError}</p>}
        {!loadError && listings.length === 0 && (
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            No listings yet. Be the first to post one.
          </p>
        )}
        {listings.map((listing) => (
          <article
            key={listing.id}
            className="rounded-lg border border-zinc-200 p-5 dark:border-zinc-800"
          >
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h3 className="font-semibold text-zinc-900 dark:text-zinc-50">
                {listing.building_name}
              </h3>
              <span className="font-medium text-zinc-900 dark:text-zinc-50">
                ${listing.rent.toLocaleString("en-US")}/mo
              </span>
            </div>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
              {listing.neighborhood} · {listing.landlord_name}
            </p>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
              {listing.bedrooms} bd · {listing.bathrooms} ba · {listing.lease_term}
            </p>
            <p className="mt-3 whitespace-pre-line text-sm text-zinc-800 dark:text-zinc-200">
              {listing.description}
            </p>
            <p className="mt-3 text-xs text-zinc-500">
              Posted {formatDate(listing.created_at)}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}

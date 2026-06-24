import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import ReviewForm from "./review-form";
import ReviewList, { type Review } from "./review-list";

export default async function ReviewsPage() {
  let isLoggedIn = false;
  let reviews: Review[] = [];
  let loadError: string | null = null;

  if (isSupabaseConfigured) {
    try {
      const supabase = await createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      isLoggedIn = !!user;

      const { data, error } = await supabase
        .from("reviews")
        .select(
          "id, created_at, landlord_name, building_name, neighborhood, rating, review_text",
        )
        .order("created_at", { ascending: false });

      if (error) {
        loadError = error.message;
      } else {
        reviews = (data as Review[]) ?? [];
      }
    } catch {
      loadError = "Unable to load reviews right now.";
    }
  }

  return (
    <section>
      <h1 className="text-3xl font-semibold tracking-tight">Reviews</h1>
      <p className="mt-2 text-zinc-600 dark:text-zinc-400">
        Read and share reviews of landlords and properties.
      </p>

      <div className="mt-8">
        {isLoggedIn ? (
          <ReviewForm />
        ) : (
          <div className="rounded-lg border border-zinc-200 p-6 text-sm text-zinc-600 dark:border-zinc-800 dark:text-zinc-400">
            <Link
              href="/login"
              className="font-medium text-zinc-900 underline underline-offset-4 dark:text-zinc-50"
            >
              Log in
            </Link>{" "}
            to post a review.
          </div>
        )}
      </div>

      <div className="mt-10">
        <ReviewList rows={reviews} loadError={loadError} />
      </div>
    </section>
  );
}

import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import ReviewForm from "./review-form";

type Review = {
  id: string;
  created_at: string;
  landlord_name: string;
  building_name: string;
  neighborhood: string;
  rating: number;
  review_text: string;
};

function Stars({ rating }: { rating: number }) {
  const clamped = Math.max(0, Math.min(5, rating));
  return (
    <span
      aria-label={`${clamped} out of 5`}
      className="text-amber-500"
      title={`${clamped}/5`}
    >
      {"★".repeat(clamped)}
      <span className="text-zinc-300 dark:text-zinc-600">
        {"★".repeat(5 - clamped)}
      </span>
    </span>
  );
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

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

      <div className="mt-10 space-y-4">
        {loadError && (
          <p className="text-sm text-red-600">{loadError}</p>
        )}
        {!loadError && reviews.length === 0 && (
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            No reviews yet. Be the first to post one.
          </p>
        )}
        {reviews.map((review) => (
          <article
            key={review.id}
            className="rounded-lg border border-zinc-200 p-5 dark:border-zinc-800"
          >
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h3 className="font-semibold text-zinc-900 dark:text-zinc-50">
                {review.landlord_name}
              </h3>
              <Stars rating={review.rating} />
            </div>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
              {review.building_name} · {review.neighborhood}
            </p>
            <p className="mt-3 whitespace-pre-line text-sm text-zinc-800 dark:text-zinc-200">
              {review.review_text}
            </p>
            <p className="mt-3 text-xs text-zinc-500">
              {formatDate(review.created_at)}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}

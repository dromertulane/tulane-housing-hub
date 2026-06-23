import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import SubletForm from "./sublet-form";

type Sublet = {
  id: string;
  created_at: string;
  building_name: string;
  neighborhood: string;
  rent: number;
  available_from: string;
  available_until: string;
  description: string;
  contact_info: string;
};

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

// `available_from`/`available_until` are date-only columns; format in UTC so
// the day doesn't shift across time zones.
function formatDay(value: string) {
  return new Date(value).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
}

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

      <div className="mt-10 space-y-4">
        {loadError && <p className="text-sm text-red-600">{loadError}</p>}
        {!loadError && sublets.length === 0 && (
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            No sublets yet. Be the first to post one.
          </p>
        )}
        {sublets.map((sublet) => (
          <article
            key={sublet.id}
            className="rounded-lg border border-zinc-200 p-5 dark:border-zinc-800"
          >
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h3 className="font-semibold text-zinc-900 dark:text-zinc-50">
                {sublet.building_name}
              </h3>
              <span className="font-medium text-zinc-900 dark:text-zinc-50">
                ${sublet.rent.toLocaleString("en-US")}/mo
              </span>
            </div>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
              {sublet.neighborhood}
            </p>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
              Available {formatDay(sublet.available_from)} –{" "}
              {formatDay(sublet.available_until)}
            </p>
            <p className="mt-3 whitespace-pre-line text-sm text-zinc-800 dark:text-zinc-200">
              {sublet.description}
            </p>
            <p className="mt-3 text-sm text-zinc-700 dark:text-zinc-300">
              <span className="font-medium">Contact:</span> {sublet.contact_info}
            </p>
            <p className="mt-3 text-xs text-zinc-500">
              Posted {formatDate(sublet.created_at)}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}

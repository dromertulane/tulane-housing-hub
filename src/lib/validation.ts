// Shared validation rules for the Reviews, Sublets, and Listings forms.
// Pure functions with no server-only imports, so the SAME logic runs on the
// client (immediate inline feedback) and in the Server Actions (authoritative).

export const SHORT_MAX = 100; // names, neighborhood, contact info, lease term
export const LONG_MAX = 1000; // description, review text
export const RENT_MAX = 100000;
export const BEDROOMS_MAX = 20;

export const NEIGHBORHOODS = [
  "Uptown",
  "Audubon/Freret",
  "Maple Street/Carrollton",
  "Mid-City",
  "Broadmoor",
  "Garden District",
  "Marigny/Bywater",
  "Other",
] as const;

export const LEASE_TERMS = ["6 months", "9 months", "12 months", "Other"] as const;

export type ValidationResult<T> = { error: string } | { ok: true; values: T };

// Field names per form, used to collect raw input back for repopulation.
export const REVIEW_FIELDS = [
  "landlord_name",
  "building_name",
  "neighborhood",
  "rating",
  "review_text",
] as const;

export const SUBLET_FIELDS = [
  "building_name",
  "neighborhood",
  "rent",
  "available_from",
  "available_until",
  "description",
  "contact_info",
] as const;

export const LISTING_FIELDS = [
  "building_name",
  "neighborhood",
  "landlord_name",
  "rent",
  "bedrooms",
  "bathrooms",
  "lease_term",
  "description",
] as const;

// Collect the exact (untrimmed) submitted values so a rejected form can be
// repopulated with what the user typed.
export function collectRaw(
  formData: FormData,
  names: readonly string[],
): Record<string, string> {
  const out: Record<string, string> = {};
  for (const name of names) {
    out[name] = String(formData.get(name) ?? "");
  }
  return out;
}

function clean(formData: FormData, name: string): string {
  return String(formData.get(name) ?? "").trim();
}

function checkText(value: string, label: string, max: number): string | null {
  if (!value) return `${label} is required.`;
  if (value.length > max) {
    return `${label} must be ${max} characters or fewer.`;
  }
  return null;
}

// Whole number, greater than 0, up to RENT_MAX. Returns the number or an
// error message string.
function parseRent(raw: string): number | string {
  if (!raw) return "Monthly rent is required.";
  const n = Number(raw);
  if (!Number.isInteger(n)) return "Monthly rent must be a whole number.";
  if (n <= 0) return "Monthly rent must be greater than 0.";
  if (n > RENT_MAX) {
    return `Monthly rent must be at most $${RENT_MAX.toLocaleString("en-US")}.`;
  }
  return n;
}

export type ReviewValues = {
  landlord_name: string;
  building_name: string;
  neighborhood: string;
  rating: number;
  review_text: string;
};

export function validateReview(
  formData: FormData,
): ValidationResult<ReviewValues> {
  const landlord_name = clean(formData, "landlord_name");
  const building_name = clean(formData, "building_name");
  const neighborhood = clean(formData, "neighborhood");
  const review_text = clean(formData, "review_text");
  const ratingRaw = clean(formData, "rating");

  const textError =
    checkText(landlord_name, "Landlord name", SHORT_MAX) ??
    checkText(building_name, "Building name", SHORT_MAX) ??
    checkText(neighborhood, "Neighborhood", SHORT_MAX) ??
    checkText(review_text, "Review", LONG_MAX);
  if (textError) return { error: textError };

  if (!ratingRaw) return { error: "Please select a rating." };
  const rating = Number(ratingRaw);
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    return { error: "Rating must be a whole number from 1 to 5." };
  }

  return {
    ok: true,
    values: { landlord_name, building_name, neighborhood, rating, review_text },
  };
}

export type SubletValues = {
  building_name: string;
  neighborhood: string;
  rent: number;
  available_from: string;
  available_until: string;
  description: string;
  contact_info: string;
};

export function validateSublet(
  formData: FormData,
): ValidationResult<SubletValues> {
  const building_name = clean(formData, "building_name");
  const neighborhood = clean(formData, "neighborhood");
  const available_from = clean(formData, "available_from");
  const available_until = clean(formData, "available_until");
  const description = clean(formData, "description");
  const contact_info = clean(formData, "contact_info");

  const textError =
    checkText(building_name, "Building name", SHORT_MAX) ??
    checkText(neighborhood, "Neighborhood", SHORT_MAX) ??
    checkText(description, "Description", LONG_MAX) ??
    checkText(contact_info, "Contact info", SHORT_MAX);
  if (textError) return { error: textError };

  const rent = parseRent(clean(formData, "rent"));
  if (typeof rent === "string") return { error: rent };

  if (!available_from || !available_until) {
    return { error: "Please provide both availability dates." };
  }
  if (available_until < available_from) {
    return { error: "“Available until” must be on or after “available from”." };
  }

  return {
    ok: true,
    values: {
      building_name,
      neighborhood,
      rent,
      available_from,
      available_until,
      description,
      contact_info,
    },
  };
}

export type ListingValues = {
  building_name: string;
  neighborhood: string;
  landlord_name: string;
  rent: number;
  bedrooms: number;
  bathrooms: number;
  lease_term: string;
  description: string;
};

export function validateListing(
  formData: FormData,
): ValidationResult<ListingValues> {
  const building_name = clean(formData, "building_name");
  const neighborhood = clean(formData, "neighborhood");
  const landlord_name = clean(formData, "landlord_name");
  const lease_term = clean(formData, "lease_term");
  const description = clean(formData, "description");

  const textError =
    checkText(building_name, "Building name", SHORT_MAX) ??
    checkText(neighborhood, "Neighborhood", SHORT_MAX) ??
    checkText(landlord_name, "Landlord name", SHORT_MAX) ??
    checkText(lease_term, "Lease term", SHORT_MAX) ??
    checkText(description, "Description", LONG_MAX);
  if (textError) return { error: textError };

  const rent = parseRent(clean(formData, "rent"));
  if (typeof rent === "string") return { error: rent };

  const bedroomsRaw = clean(formData, "bedrooms");
  if (!bedroomsRaw) return { error: "Bedrooms is required." };
  const bedrooms = Number(bedroomsRaw);
  if (!Number.isInteger(bedrooms) || bedrooms < 0) {
    return { error: "Bedrooms must be a whole number (0 or more)." };
  }
  if (bedrooms > BEDROOMS_MAX) {
    return { error: `Bedrooms must be at most ${BEDROOMS_MAX}.` };
  }

  const bathroomsRaw = clean(formData, "bathrooms");
  if (!bathroomsRaw) return { error: "Bathrooms is required." };
  const bathrooms = Number(bathroomsRaw);
  if (!Number.isFinite(bathrooms) || bathrooms < 1) {
    return { error: "Bathrooms must be at least 1." };
  }
  if (!Number.isInteger(bathrooms * 2)) {
    return { error: "Bathrooms must increase in steps of 0.5 (1, 1.5, 2, …)." };
  }

  return {
    ok: true,
    values: {
      building_name,
      neighborhood,
      landlord_name,
      rent,
      bedrooms,
      bathrooms,
      lease_term,
      description,
    },
  };
}

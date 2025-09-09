// lib/mappings.ts
import { Mood, MainCategoryEnum, PriceRange } from "@prisma/client";

// Map Google place types → MainCategoryEnum
export const categoryMapping: Record<string, MainCategoryEnum> = {
  restaurant: "FOOD",
  cafe: "FOOD",
  bar: "FOOD",
  park: "OUTDOOR",
  night_club: "ENTERTAINMENT",
  gym: "SPORTS",
  museum: "CULTURE",
  movie_theater: "ENTERTAINMENT",
  // fallback
  default: "GENERAL",
};

// Simple heuristic for mood
export const moodMapping: Record<string, Mood> = {
  cafe: "ROMANTIC",
  park: "RELAXED",
  night_club: "PARTY",
  gym: "ACTIVE",
  museum: "CULTURAL",
  default: "NEUTRAL",
};

// Map Google price_level (0–4) → min/max price
export function mapPriceRange(priceLevel?: number): PriceRange {
  switch (priceLevel) {
    case 0:
      return { min: 0, max: 0 };
    case 1:
      return { min: 1, max: 10 };
    case 2:
      return { min: 11, max: 30 };
    case 3:
      return { min: 31, max: 60 };
    case 4:
      return { min: 61, max: 100 };
    default:
      return { min: 0, max: 999 };
  }
}

// Normalize Google Place → Mtoko Place type
export interface NormalizedPlace {
  id: string;
  name: string;
  image: string;
  address: string;
  rating: number | null;
  mood: Mood;
  category: MainCategoryEnum;
  priceRange: PriceRange;
}

export function normalizeGooglePlace(place: unknown): NormalizedPlace {
  if (!place || typeof place !== "object") {
    throw new Error("Invalid place object");
  }

  const p = place as Record<string, any>;
  const types: string[] = Array.isArray(p.types) ? p.types : [];
  const primaryType = types[0] || "default";

  return {
    id: String(p.place_id),
    name: String(p.name ?? "Unknown Place"),
    image:
      p.photos?.[0]?.photo_reference
        ? `/api/places/photo?ref=${p.photos[0].photo_reference}`
        : "/default-place.jpg",
    address: String(p.formatted_address ?? ""),
    rating: typeof p.rating === "number" ? p.rating : null,
    mood: moodMapping[primaryType] ?? moodMapping.default,
    category: categoryMapping[primaryType] ?? categoryMapping.default,
    priceRange: mapPriceRange(typeof p.price_level === "number" ? p.price_level : undefined),
  };
}

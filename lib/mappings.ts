// lib/mappings.ts
import { Mood, MainCategoryEnum, PriceRange } from "@prisma/client";

// Map Google types → MainCategoryEnum
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

// Simple heuristic for mood (extend later if needed)
export const moodMapping: Record<string, Mood> = {
    cafe: "ROMANTIC",
    park: "RELAXED",
    night_club: "PARTY",
    gym: "ACTIVE",
    museum: "CULTURAL",
    default: "NEUTRAL",
};

// Map Google price_level (0–4) → min/max price ranges
export function mapPriceRange(priceLevel?: number): PriceRange {
    switch (priceLevel) {
        case 0: return { min: 0, max: 0 };
        case 1: return { min: 1, max: 10 };
        case 2: return { min: 11, max: 30 };
        case 3: return { min: 31, max: 60 };
        case 4: return { min: 61, max: 100 };
        default: return { min: 0, max: 999 };
    }
}

// Normalize Google place into Mtoko schema-like object
export function normalizeGooglePlace(place: any) {
    const types: string[] = place.types || [];
    const primaryType = types[0] || "default";

    return {
        id: place.place_id,
        name: place.name,
        image: place.photos?.[0]
            ? `/api/places/photo?ref=${place.photos[0].photo_reference}`
            : "/default-place.jpg",
        address: place.formatted_address || "",
        rating: place.rating || null,
        mood: moodMapping[primaryType] || moodMapping.default,
        category: categoryMapping[primaryType] || categoryMapping.default,
        priceRange: mapPriceRange(place.price_level),
    };
}

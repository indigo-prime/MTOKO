// lib/mappings.ts
import type { MainCategory, Mood } from "./googlePlaceMappings";

// Local type for price range shape used by mapping
export type PriceRange = { min: number; max: number };

// Map Google types → MainCategory
export const categoryMapping: Record<string, MainCategory> = {
    restaurant: "FOOD_PACK",
    cafe: "FOOD_PACK",
    bar: "FOOD_PACK",
    park: "NATURE_AND_OUTDOOR",
    night_club: "NIGHT_LIFE",
    gym: "EVENTS_AND_EXPERIENCE",
    museum: "ARTS_AND_CULTURE",
    movie_theater: "ARTS_AND_CULTURE",
    // fallback
    default: "SHOPPING_AND_LIFESTYLE",
};

// Simple heuristic for mood
export const moodMapping: Record<string, Mood> = {
    cafe: "ROMANTIC",
    park: "RELAXED",
    night_club: "ADVENTUROUS",
    gym: "ADVENTUROUS",
    museum: "CULTURAL",
    default: "RELAXED",
};

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

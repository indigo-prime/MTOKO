<<<<<<< HEAD
// lib/mappings.ts
import { Mood, MainCategoryEnum } from "@prisma/client";

// Local type for price range shape used by mapping
export type PriceRange = { min: number; max: number };

// Map Google types → MainCategoryEnum
export const categoryMapping: Record<string, MainCategoryEnum> = {
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
=======
/* eslint-disable @typescript-eslint/no-explicit-any */

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
    default: "GENERAL",
>>>>>>> 0e790886216d75430ba39eed33c0a5a8e5a5bda4
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

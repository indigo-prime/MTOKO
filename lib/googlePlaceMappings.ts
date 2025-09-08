// lib/googlePlaceMappings.ts
export type MainCategory =
    | "FOOD_PACK"
    | "FAMILY_AND_KIDS"
    | "NIGHT_LIFE"
    | "ARTS_AND_CULTURE"
    | "NATURE_AND_OUTDOOR"
    | "SHOPPING_AND_LIFESTYLE"
    | "EVENTS_AND_EXPERIENCE";

export type Mood =
    | "RELAXED"
    | "ROMANTIC"
    | "ADVENTUROUS"
    | "FAMILY_FRIENDLY"
    | "BUSINESS"
    | "HISTORICAL"
    | "SHOPPING"
    | "EDUCATIONAL"
    | "CULTURAL";

// Google Place "includedTypes" (Table A values).
export const MAIN_TO_TYPES: Record<MainCategory, string[]> = {
    FOOD_PACK: ["restaurant", "cafe", "bakery", "coffee_shop", "fast_food_restaurant"],
    FAMILY_AND_KIDS: ["zoo", "aquarium", "park", "amusement_park", "community_center"],
    NIGHT_LIFE: ["night_club", "bar", "wine_bar"],
    ARTS_AND_CULTURE: ["museum", "art_gallery", "performing_arts_theater", "cultural_center"],
    NATURE_AND_OUTDOOR: ["park", "national_park", "hiking_area", "campground", "beach"],
    SHOPPING_AND_LIFESTYLE: ["shopping_mall", "clothing_store", "shoe_store", "convenience_store", "supermarket"],
    EVENTS_AND_EXPERIENCE: ["event_venue", "convention_center", "wedding_venue", "banquet_hall"]
};

// Optional: nudge Text Search by mood.
export const MOOD_HINT_TYPES: Partial<Record<Mood, string[]>> = {
    RELAXED: ["spa", "park", "cafe"],
    ROMANTIC: ["fine_dining_restaurant", "wine_bar"],
    ADVENTUROUS: ["adventure_sports_center", "hiking_area", "tourist_attraction"],
    FAMILY_FRIENDLY: ["park", "zoo", "aquarium"],
    BUSINESS: ["restaurant", "cafe"],
    HISTORICAL: ["historical_place", "museum"],
    SHOPPING: ["shopping_mall", "clothing_store"],
    EDUCATIONAL: ["museum", "library"],
    CULTURAL: ["cultural_center", "art_gallery", "museum"]
};

// Turn selected subcategories (strings) into keywords for textQuery.
export function subcatsToKeywords(subcats: string[]): string {
    return (subcats || []).join(" ");
}

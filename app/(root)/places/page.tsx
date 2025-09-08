"use client";

import { useState, useEffect, useMemo } from "react";
import CombinedSearchFilter3, { FilterValues } from "@/components/CombinedSearchFilter3";
import PlacesResults, { Place } from "@/components/PlacesResults";
import { supabase } from "@/lib/supabase";

export default function PlacesPage() {
    const [filters, setFilters] = useState<FilterValues>({
        searchTerm: "",
        selectedMood: "All",
        selectedCategories: [],
        priceRange: [2000, 10000],
    });
    const [allPlaces, setAllPlaces] = useState<Place[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchPlaces() {
            try {
                const { data, error } = await supabase
                    .from("Place")
                    .select(`
            *,
            PlaceSubCategory (SubCategory (name)),
            PlaceMainCategory (MainCategory (name))
          `);

                if (error) {
                    console.error("Error fetching places:", error);
                    setError(`Failed to load places: ${error.message}`);
                    return;
                }

                console.log("Raw Supabase data:", data); // Debug: Log raw data

                const mappedPlaces: Place[] = data.map((place: any) => ({
                    id: place.id,
                    name: place.name || "Unknown Place",
                    categories: (place.PlaceSubCategory || []).map((s: any) => s?.SubCategory?.name || "Unknown Category"),
                    moods: Array.isArray(place.moods) ? place.moods : [],
                    priceMin: place.priceMin ?? 0,
                    priceMax: place.priceMax ?? 0,
                    avatarSrc: place.imageUrls?.[1] || "/default-avatar.jpg",
                    imageSrc: place.imageUrls?.[0] || "/default-image.jpg",
                    likes: place.likes || 0,
                    description: place.description || "No description available",
                    location: place.location || "Unknown Location", // Add location
                }));

                setAllPlaces(mappedPlaces);
            } catch (err: any) {
                console.error("Unexpected error:", err);
                setError("Unexpected error occurred: " + (err.message || "Unknown error"));
            } finally {
                setLoading(false);
            }
        }

        fetchPlaces();
    }, []);

    const rangesOverlap = (placeMin: number, placeMax: number, selMin: number, selMax: number) =>
        placeMax >= selMin && placeMin <= selMax;

    const filteredPlaces = useMemo(() => {
        const term = filters.searchTerm.toLowerCase().trim();

        return allPlaces.filter((place) => {
            const matchesSearch =
                term === "" ||
                place.name.toLowerCase().includes(term) ||
                place.description.toLowerCase().includes(term) ||
                place.location.toLowerCase().includes(term); // Include location in search

            const matchesMood =
                filters.selectedMood === "All" ||
                place.moods.map((m: string) => m.toLowerCase()).includes(filters.selectedMood.toLowerCase());

            const matchesCategory =
                filters.selectedCategories.length === 0 ||
                place.categories.some((c: string) => filters.selectedCategories.includes(c));

            const matchesPrice = rangesOverlap(
                place.priceMin ?? 0,
                place.priceMax ?? 0,
                filters.priceRange[0],
                filters.priceRange[1]
            );

            return matchesSearch && matchesMood && matchesCategory && matchesPrice;
        });
    }, [allPlaces, filters]);

    if (loading) return <p>Loading places...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className="space-y-8">
            <CombinedSearchFilter3 onFilterChange={setFilters} />
            <PlacesResults places={filteredPlaces} />
        </div>
    );
}
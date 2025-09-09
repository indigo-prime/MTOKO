"use client";

import { useState, useEffect, useMemo } from "react";
import CombinedSearchFilter3, { FilterValues } from "@/components/CombinedSearchFilter3";
import PlacesResults, { Place } from "@/components/PlacesResults";
import { supabase } from "@/lib/supabase";

// Strongly-typed Supabase response
interface SupabasePlace {
  id: string;
  name: string | null;
  moods: string[] | null;
  priceMin: number | null;
  priceMax: number | null;
  imageUrls: string[] | null;
  likes: number | null;
  description: string | null;
  location: string | null;
  PlaceSubCategory?: { SubCategory?: { name: string } }[];
  PlaceMainCategory?: { MainCategory?: { name: string } }[];
}

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
        const { data, error: fetchError } = await supabase
          .from<SupabasePlace>("Place")
          .select(`
            *,
            PlaceSubCategory (SubCategory (name)),
            PlaceMainCategory (MainCategory (name))
          `);

        if (fetchError) {
          console.error("Error fetching places:", fetchError);
          setError(`Failed to load places: ${fetchError.message}`);
          return;
        }

        const mappedPlaces: Place[] = (data ?? []).map((place) => ({
          id: place.id,
          name: place.name ?? "Unknown Place",
          categories: (place.PlaceSubCategory ?? []).map(
            (s) => s?.SubCategory?.name ?? "Unknown Category"
          ),
          moods: Array.isArray(place.moods) ? place.moods : [],
          priceMin: place.priceMin ?? 0,
          priceMax: place.priceMax ?? 0,
          avatarSrc: place.imageUrls?.[1] ?? "/default-avatar.jpg",
          imageSrc: place.imageUrls?.[0] ?? "/default-image.jpg",
          likes: place.likes ?? 0,
          description: place.description ?? "No description available",
          location: place.location ?? "Unknown Location",
        }));

        setAllPlaces(mappedPlaces);
      } catch (err: unknown) {
        console.error("Unexpected error:", err);
        if (err instanceof Error) setError(err.message);
        else setError("Unexpected error occurred");
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
        place.location.toLowerCase().includes(term);

      const matchesMood =
        filters.selectedMood === "All" ||
        place.moods.map((m) => m.toLowerCase()).includes(filters.selectedMood.toLowerCase());

      const matchesCategory =
        filters.selectedCategories.length === 0 ||
        place.categories.some((c) => filters.selectedCategories.includes(c));

      const matchesPrice = rangesOverlap(
        place.priceMin,
        place.priceMax,
        filters.priceRange[0],
        filters.priceRange[1]
      );

      return matchesSearch && matchesMood && matchesCategory && matchesPrice;
    });
  }, [allPlaces, filters]);

  if (loading) return <p>Loading places...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="space-y-8">
      <CombinedSearchFilter3 onFilterChange={setFilters} />
      <PlacesResults places={filteredPlaces} />
    </div>
  );
}

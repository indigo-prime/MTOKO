"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import CombinedSearchFilter4, { FilterValues } from "@/components/CombinedSearchFilter4";
import PlaceCard2 from "@/components/PlaceCard2";
import { supabase } from "@/lib/supabase";

// Map pretty slugs -> Prisma enum (MainCategoryEnum)
const SLUG_TO_ENUM: Record<string, string> = {
    "food": "FOOD_PACK",
    "family": "FAMILY_AND_KIDS",
    "nightlife": "NIGHT_LIFE",
    "arts-and-culture": "ARTS_AND_CULTURE",
    "nature-and-outdoor": "NATURE_AND_OUTDOOR",
    "shopping-and-lifestyle": "SHOPPING_AND_LIFESTYLE",
    "events-and-experiences": "EVENTS_AND_EXPERIENCE",
};

type RawPlace = {
    id: string;
    name: string;
    description: string;
    location: string;
    latitude: number | null;
    longitude: number | null;
    moods: string[] | null;
    imageUrls: string[] | null;
    priceMin: number | null;
    priceMax: number | null;
    PlaceSubCategory?: { SubCategory?: { name: string } | null }[] | null;
    PlaceMainCategory?: { mainCategoryId: string }[] | null;
};

type UiPlace = {
    id: string;
    name: string;
    description: string;
    location: string;
    latitude?: number;
    longitude?: number;
    moods: string[];
    imageSrc: string;
    avatarSrc: string;
    priceMin: number;
    priceMax: number;
    categories: string[]; // derived from PlaceSubCategory -> SubCategory.name
    likes: number;
};

export default function CategoryPage() {

    const params = useParams<{ slug: string }>();
    const slug = params?.slug;
    const mainEnum = slug ? SLUG_TO_ENUM[slug] : undefined;

    const [filters, setFilters] = useState<FilterValues>({
        searchTerm: "",
        selectedMood: "All",
        selectedCategories: [],
        priceRange: [2000, 10000],
    });

    const [places, setPlaces] = useState<UiPlace[]>([]);
    const [loading, setLoading] = useState(true);
    const [errMsg, setErrMsg] = useState<string | null>(null);

    useEffect(() => {
        if (!mainEnum) {
            setErrMsg("Unknown category");
            setLoading(false);
            return;
        }

        (async () => {
            try {
                setLoading(true);
                setErrMsg(null);

                // 1) Get the MainCategory row (to obtain its id)
                const { data: mainCat, error: mcErr } = await supabase
                    .from("MainCategory")
                    .select("id,name")
                    .eq("name", mainEnum)
                    .maybeSingle();

                if (mcErr) {
                    setErrMsg(`Failed to fetch main category: ${mcErr.message}`);
                    return;
                }
                if (!mainCat) {
                    setErrMsg("Main category not found");
                    return;
                }

                // 2) Fetch Places that are linked to this MainCategory via PlaceMainCategory (inner join)
                //    We filter by the junction's mainCategoryId to only get places in this category.
                let { data, error } = await supabase
                    .from("Place")
                    .select(`
            id,name,description,location,latitude,longitude,moods,priceMin,priceMax,imageUrls,
            PlaceSubCategory(SubCategory(name)),
            PlaceMainCategory!inner(mainCategoryId)
          `)
                    .eq("PlaceMainCategory.mainCategoryId", mainCat.id);

                // Fallback: if the inner join filter fails on your Supabase setup, fetch + filter client-side
                if (error) {
                    console.warn("Join-filter fetch failed, falling back:", error.message);
                    const fallback = await supabase
                        .from("Place")
                        .select(`
              id,name,description,location,latitude,longitude,moods,priceMin,priceMax,imageUrls,
              PlaceSubCategory(SubCategory(name)),
              PlaceMainCategory(mainCategoryId)
            `);

                    if (fallback.error) {
                        setErrMsg(`Failed to load places: ${fallback.error.message}`);
                        return;
                    }
                    data = (fallback.data as RawPlace[]).filter(p =>
                        (p.PlaceMainCategory ?? []).some(pm => pm?.mainCategoryId === mainCat.id)
                    );
                }

                const mapped: UiPlace[] = (data as RawPlace[]).map((p) => ({
                    id: p.id,
                    name: p.name ?? "Unknown Place",
                    description: p.description ?? "",
                    location: p.location ?? "",
                    latitude: p.latitude ?? undefined,
                    longitude: p.longitude ?? undefined,
                    moods: Array.isArray(p.moods) ? p.moods : [],
                    imageSrc: p.imageUrls?.[0] ?? "/default-image.jpg",
                    avatarSrc: p.imageUrls?.[1] ?? "/default-avatar.jpg",
                    priceMin: p.priceMin ?? 0,
                    priceMax: p.priceMax ?? 0,
                    categories: (p.PlaceSubCategory ?? [])
                        .map(s => s?.SubCategory?.name)
                        .filter(Boolean) as string[],
                    likes: 0, // You can join likes count if you have a view; left at 0 for now
                }));

                setPlaces(mapped);
            } catch (e: any) {
                console.error(e);
                setErrMsg("Unexpected error loading places");
            } finally {
                setLoading(false);
            }
        })();
    }, [mainEnum, slug]);

    const rangesOverlap = (placeMin: number, placeMax: number, selMin: number, selMax: number) =>
        placeMax >= selMin && placeMin <= selMax;

    const filteredPlaces = useMemo(() => {
        const term = filters.searchTerm.toLowerCase().trim();

        return places.filter((place) => {
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
                place.priceMin ?? 0,
                place.priceMax ?? 0,
                filters.priceRange[0],
                filters.priceRange[1]
            );

            return matchesSearch && matchesMood && matchesCategory && matchesPrice;
        });
    }, [places, filters]);

    if (!mainEnum) {
        return <div className="p-6 text-center">Unknown category</div>;
    }
    if (loading) {
        return (
            <div className="p-6 text-center">Loading {slug} places…</div>
        );
    }
    if (errMsg) {
        return <div className="p-6 text-center text-red-500">{errMsg}</div>;
    }

    return (
        <div className="space-y-8">
            {/* Filter shows ONLY subcategories for this main category */}
            <CombinedSearchFilter4
                mainCategoryEnum={mainEnum}
                onFilterChange={setFilters}
            />

            {/* Results (reusing your PlaceCard2) */}
            <div className="max-w-[935px] mx-auto flex flex-col gap-6">
                {filteredPlaces.length === 0 && (
                    <div className="p-6 text-center">No places match your filters.</div>
                )}

                {filteredPlaces.map((place) => (
                    <PlaceCard2
                        key={place.id}
                        placeId={place.id}
                        name={place.name}
                        description={place.description}
                        location={place.location}
                        imageSrc={place.imageSrc}
                        priceMin={place.priceMin}
                        priceMax={place.priceMax}
                        categories={place.categories}
                        moods={place.moods}
                        likes={place.likes}
                        avatarSrc={place.avatarSrc}
                        username={place.name}
                    />
                ))}
            </div>
        </div>
    );
}

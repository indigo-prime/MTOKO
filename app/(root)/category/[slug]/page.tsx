// @ts-nocheck
"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import CombinedSearchFilter4, { FilterValues } from "@/components/CombinedSearchFilter4";
import PlaceCard2 from "@/components/PlaceCard2";
import { supabase } from "@/lib/supabase";

// Map pretty slugs -> MainCategoryEnum
const SLUG_TO_ENUM = {
  food: "FOOD_PACK",
  family: "FAMILY_AND_KIDS",
  nightlife: "NIGHT_LIFE",
  "arts-and-culture": "ARTS_AND_CULTURE",
  "nature-and-outdoor": "NATURE_AND_OUTDOOR",
  "shopping-and-lifestyle": "SHOPPING_AND_LIFESTYLE",
  "events-and-experiences": "EVENTS_AND_EXPERIENCES",
} as const;

type MainCategoryEnumType = typeof SLUG_TO_ENUM[keyof typeof SLUG_TO_ENUM];

type RawPlace = {
<<<<<<< HEAD
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
    PlaceSubCategory: { SubCategory: { name: string } }[];
    PlaceMainCategory: { mainCategoryId: string }[];
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
    categories: string[];
    likes: number;
};

export default function CategoryPage() {
    const params = useParams<{ slug: string }>();
    const slug = params?.slug;
    const mainEnum = slug ? SLUG_TO_ENUM[slug] : undefined;
=======
  id: string;
  name: string | null;
  description: string | null;
  location: string | null;
  latitude: number | null;
  longitude: number | null;
  moods: string[] | null;
  imageUrls: string[] | null;
  priceMin: number | null;
  priceMax: number | null;
  PlaceSubCategory?: { subCategory: { name: string } | null }[] | null;
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
  categories: string[];
  likes: number;
};

export default function CategoryPage() {
  const params = useParams<{ slug: string }>();
  const slug = params?.slug;
  const mainEnum: MainCategoryEnumType | undefined =
    slug && slug in SLUG_TO_ENUM ? SLUG_TO_ENUM[slug as keyof typeof SLUG_TO_ENUM] : undefined;

  const [filters, setFilters] = useState<FilterValues>({
    searchTerm: "",
    selectedMood: "All",
    selectedCategories: [],
    priceRange: [2000, 10000],
  });
  const [places, setPlaces] = useState<UiPlace[]>([]);
  const [loading, setLoading] = useState(true);
  const [errMsg, setErrMsg] = useState<string | null>(null);
>>>>>>> 0e790886216d75430ba39eed33c0a5a8e5a5bda4

  useEffect(() => {
    if (!mainEnum) {
      setErrMsg("Unknown category");
      setLoading(false);
      return;
    }

    const fetchPlaces = async () => {
      try {
        setLoading(true);
        setErrMsg(null);

        // Fetch main category
        const { data: mainCat, error: mcErr } = await supabase
          .from("MainCategory")
          .select("id, name")
          .eq("name", mainEnum)
          .maybeSingle();

        if (mcErr) throw new Error(`Failed to fetch main category: ${mcErr.message}`);
        if (!mainCat) throw new Error("Main category not found");

<<<<<<< HEAD
                // 1) Get MainCategory row to obtain its id
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

                // 2) Fetch places linked to this MainCategory
                let { data, error } = await supabase
                    .from("Place")
                    .select(`
                        id,name,description,location,latitude,longitude,moods,priceMin,priceMax,imageUrls,
                        PlaceSubCategory(SubCategory(name)),
                        PlaceMainCategory!inner(mainCategoryId)
                    `)
                    .eq("PlaceMainCategory.mainCategoryId", mainCat.id);

                // Fallback: if inner join fails, fetch + filter client-side
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

                    // ⚡ Normalize arrays to satisfy TypeScript
                    const rawPlaces: RawPlace[] = (fallback.data as any[]).map((p: any) => ({
                        ...p,
                        PlaceSubCategory: (p.PlaceSubCategory ?? []).map((sc: any) => ({
                            SubCategory: sc?.SubCategory ? { name: sc.SubCategory.name } : { name: "" },
                        })),
                        PlaceMainCategory: p.PlaceMainCategory ?? [],
                    }));

                    // Filter by main category safely
                    data = rawPlaces.filter((p: RawPlace) =>
                        (p.PlaceMainCategory ?? []).some(pm => pm?.mainCategoryId === mainCat.id)
                    );
                }

                // 3) Map RawPlace -> UiPlace
                const mapped: UiPlace[] = (data as RawPlace[]).map(p => ({
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
                    categories: (p.PlaceSubCategory ?? []).map(s => s.SubCategory.name).filter(Boolean),
                    likes: 0,
                }));
=======
        // Fetch places linked to main category
        const { data, error: placeError } = await supabase
          .from("Place")
          .select(`
            id, name, description, location, latitude, longitude, moods, priceMin, priceMax, imageUrls,
            PlaceSubCategory(subCategory(name)),
            PlaceMainCategory!inner(mainCategoryId)
          `)
          .eq("PlaceMainCategory.mainCategoryId", mainCat.id);

        if (placeError) throw new Error(`Failed to fetch places: ${placeError.message}`);

        const rawPlaces: RawPlace[] = (data ?? []).map((p) => ({
          id: String(p.id),
          name: p.name ?? null,
          description: p.description ?? null,
          location: p.location ?? null,
          latitude: p.latitude ?? null,
          longitude: p.longitude ?? null,
          moods: Array.isArray(p.moods) ? p.moods : null,
          imageUrls: Array.isArray(p.imageUrls) ? p.imageUrls : null,
          priceMin: p.priceMin ?? null,
          priceMax: p.priceMax ?? null,
          PlaceSubCategory: Array.isArray(p.PlaceSubCategory)
            ? p.PlaceSubCategory.map((psc) => ({
                subCategory: psc.subCategory?.[0] ? { name: psc.subCategory[0].name } : null,
              }))
            : null,
          PlaceMainCategory: Array.isArray(p.PlaceMainCategory)
            ? p.PlaceMainCategory.map((pm) => ({ mainCategoryId: String(pm.mainCategoryId) }))
            : null,
        }));

        const mapped: UiPlace[] = rawPlaces.map((p) => ({
          id: p.id,
          name: p.name ?? "Unknown Place",
          description: p.description ?? "",
          location: p.location ?? "",
          latitude: p.latitude ?? undefined,
          longitude: p.longitude ?? undefined,
          moods: p.moods ?? [],
          imageSrc: p.imageUrls?.[0] ?? "/default-image.jpg",
          avatarSrc: p.imageUrls?.[1] ?? "/default-avatar.jpg",
          priceMin: p.priceMin ?? 0,
          priceMax: p.priceMax ?? 0,
          categories: (p.PlaceSubCategory ?? [])
            .map((s) => s?.subCategory?.name)
            .filter((c): c is string => !!c),
          likes: 0,
        }));
>>>>>>> 0e790886216d75430ba39eed33c0a5a8e5a5bda4

        setPlaces(mapped);
      } catch (err) {
        console.error(err);
        setErrMsg(err instanceof Error ? err.message : "Unexpected error loading places");
      } finally {
        setLoading(false);
      }
    };

    fetchPlaces();
  }, [mainEnum]);

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
        place.priceMin,
        place.priceMax,
        filters.priceRange[0],
        filters.priceRange[1]
      );

      return matchesSearch && matchesMood && matchesCategory && matchesPrice;
    });
  }, [places, filters]);

<<<<<<< HEAD
    if (!mainEnum) return <div className="p-6 text-center">Unknown category</div>;
    if (loading) return <div className="p-6 text-center">Loading {slug} places…</div>;
    if (errMsg) return <div className="p-6 text-center text-red-500">{errMsg}</div>;

    return (
        <div className="space-y-8">
            <CombinedSearchFilter4 mainCategoryEnum={mainEnum} onFilterChange={setFilters} />

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
=======
  if (!mainEnum) return <div className="p-6 text-center">Unknown category</div>;
  if (loading) return <div className="p-6 text-center">Loading {slug} places…</div>;
  if (errMsg) return <div className="p-6 text-center text-red-500">{errMsg}</div>;

  return (
    <div className="space-y-8">
      <CombinedSearchFilter4 mainCategoryEnum={mainEnum} onFilterChange={setFilters} />
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
>>>>>>> 0e790886216d75430ba39eed33c0a5a8e5a5bda4
}

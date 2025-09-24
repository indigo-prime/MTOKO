// app/(root)/places/[id]/page.tsx
import PlaceCard2 from "@/components/PlaceCard2";
import PlaceMapCard from "@/components/PlaceMapCard";
import FeaturesRules from "@/components/FeaturesRules";
import CommentSection from "@/components/CommentSection";
import { supabase } from "@/lib/supabase";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth";

interface Place {
  id: string;
  name: string;
  description: string;
  location: string;
  latitude?: number | null;
  longitude?: number | null;
  moods: string[];
  imageUrls: string[];
  likes: number;
  priceMin?: number | null;
  priceMax?: number | null;
  owner?: { name?: string | null; image?: string | null } | null;
  features: { id: string; name: string }[];
  rules: { id: string; text: string }[];
  placeMainCategories: { mainCategory: { name?: string | null } }[] | null;
  placeSubCategories: { subCategory: { name?: string | null } }[] | null;
}

export default async function PlaceDetail({
  params,
}: {
  params: { id: string };
}) {
  // server-side auth check
  const session = await auth();
  if (!session) redirect("/sign-in");

  const { id } = params;

  // fetch place data from Supabase
  const { data, error } = await supabase
    .from("Place")
    .select(`
      *,
      owner:User(name, image),
      features:Feature(*),
      rules:Rule(*),
      placeMainCategories:PlaceMainCategory(mainCategory:MainCategory(name)),
      placeSubCategories:PlaceSubCategory(subCategory:SubCategory(name))
    `)
    .eq("id", id)
    .single();

  if (error || !data) {
    console.error("Supabase error or no data:", error);
    return notFound();
  }

  const place = data as Place;

  // combine main & sub categories safely (guard for null/undefined)
  const mainCats =
    Array.isArray(place.placeMainCategories) && place.placeMainCategories.length
      ? place.placeMainCategories
          .map((c) => c?.mainCategory?.name)
          .filter(Boolean) as string[]
      : [];

  const subCats =
    Array.isArray(place.placeSubCategories) && place.placeSubCategories.length
      ? place.placeSubCategories
          .map((c) => c?.subCategory?.name)
          .filter(Boolean) as string[]
      : [];

  const categories = [...mainCats, ...subCats];

  // Server component can include client components (PlaceMapCard is client)
  // NOTE: Do NOT pass `mapSrc` here unless PlaceMapCard accepts it in its props.
  return (
    <div className="grid justify-items-center mt-6 w-full max-w-[935px] mx-auto gap-6">
      <PlaceCard2
        placeId={place.id}
        username={place.owner?.name ?? "owner"}
        avatarSrc={place.owner?.image ?? "/images/avatars/default.png"}
        name={place.name}
        imageSrc={place.imageUrls?.[0] ?? "/placeholder.jpg"}
        likes={place.likes ?? 0}
        location={place.location}
        categories={categories}
        moods={place.moods ?? []}
        priceMin={place.priceMin ?? 0}
        priceMax={place.priceMax ?? 0}
        description={place.description ?? ""}
      />

      <PlaceMapCard
        location={place.location}
        lat={typeof place.latitude === "number" ? place.latitude : -6.8}
        lng={typeof place.longitude === "number" ? place.longitude : 39.28}
      />

      <FeaturesRules features={place.features ?? []} rules={place.rules ?? []} />

      <CommentSection placeId={place.id} />
    </div>
  );
}

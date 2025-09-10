// app/places/[id]/page.tsx

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
  latitude?: number;
  longitude?: number;
  moods: string[];
  imageUrls: string[];
  likes: number;
  priceMin?: number;
  priceMax?: number;
  owner: { name: string; image: string };
  features: { id: string; name: string }[];
  rules: { id: string; text: string }[];
  placeMainCategories: { mainCategory: { name: string } }[];
  placeSubCategories: { subCategory: { name: string } }[];
}

// ❌ Remove "use client" because this is a server component
export default async function PlaceDetail({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session) redirect("/sign-in");

  const { id } = await params;

  const { data, error } = await supabase
    .from("Place") // ❌ removed <SupabasePlace> type arg
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

  if (error || !data) notFound();

  const place = data as Place;

  const categories = [
    ...place.placeMainCategories.map((c) => c.mainCategory.name),
    ...place.placeSubCategories.map((c) => c.subCategory.name),
  ];

  const mapSrc = `https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d15000!2d${
    place.longitude ?? 39.28
  }!3d${place.latitude ?? -6.8}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2stz!4v1724071234567`;

  return (
    <div className="grid justify-items-center mt-6 w-full max-w-[935px] mx-auto">
      <PlaceCard2
        placeId={place.id}
        username={place.name || "owner"}
        avatarSrc={place.imageUrls?.[0] || "/images/avatars/default.png"} // safe fallback
        name={place.name}
        imageSrc={place.imageUrls?.[0] || "/placeholder.jpg"} // safe fallback
        likes={place.likes}
        location={place.location}
        categories={categories}
        moods={place.moods}
        priceMin={place.priceMin ?? 0}
        priceMax={place.priceMax ?? 0}
        description={place.description}
      />

      <PlaceMapCard
        mapSrc={mapSrc}
        location={place.location}
        lat={place.latitude ?? -6.8}
        lng={place.longitude ?? 39.28}
      />

      <FeaturesRules features={place.features} rules={place.rules} />

      <CommentSection placeId={place.id} />
    </div>
  );
}

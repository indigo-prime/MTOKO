// app/api/trending/most-liked/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

// Define type for place with nested relations
interface PlaceItem {
  id: string;
  name: string;
  description: string | null;
  location: string | null;
  imageUrls: string[];
  priceMin: number | null;
  priceMax: number | null;
  moods: string[] | null;
  placeLikes: { id: string }[]; // array of likes
  placeMainCategories: { mainCategory: { name: string } }[];
  placeSubCategories: { subCategory: { name: string } }[];
}

export async function GET(req: NextRequest) {
  try {
    // Fetch all places with their likes and categories
    const places: PlaceItem[] = await prisma.place.findMany({
      include: {
        placeLikes: true,
        placeMainCategories: { include: { mainCategory: true } },
        placeSubCategories: { include: { subCategory: true } },
      },
    });

    // Map places to a frontend-friendly format
    const mapped = places.map((p: PlaceItem) => ({
      id: p.id,
      name: p.name,
      description: p.description,
      location: p.location,
      imageSrc: p.imageUrls[0] || "/default-image.jpg",
      priceMin: p.priceMin || 0,
      priceMax: p.priceMax || 0,
      moods: p.moods || [],
      likes: p.placeLikes.length,
      categories: [
        ...p.placeMainCategories.map((c) => c.mainCategory.name),
        ...p.placeSubCategories.map((c) => c.subCategory.name),
      ],
    }));

    // Sort descending by number of likes
    mapped.sort((a, b) => b.likes - a.likes);

    return NextResponse.json(mapped);
  } catch (err) {
    console.error("Failed to fetch most liked places:", err);
    return NextResponse.json(
      { error: "Failed to fetch places" },
      { status: 500 }
    );
  }
}

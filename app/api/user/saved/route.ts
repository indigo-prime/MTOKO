// app/api/user/saved/route.ts
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

// Define types for nested place data
interface SavedPlaceItem {
  place: {
    id: string;
    name: string;
    description: string | null;
    location: string | null;
    imageUrls: string[];
    priceMin: number | null;
    priceMax: number | null;
    moods: string[] | null;
    placeMainCategories: { mainCategory: { name: string } }[];
    placeSubCategories: { subCategory: { name: string } }[];
    placeLikes: { id: string }[];
    reviews: { id: string }[];
  };
}

export async function GET() {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const savedPlaces: SavedPlaceItem[] = await prisma.savedPlace.findMany({
      where: { userId: session.user.id },
      include: {
        place: {
          include: {
            placeMainCategories: { include: { mainCategory: true } },
            placeSubCategories: { include: { subCategory: true } },
            reviews: true,
            placeLikes: true,
          },
        },
      },
      orderBy: { id: "desc" },
    });

    return NextResponse.json(
      savedPlaces.map((sp: SavedPlaceItem) => ({
        id: sp.place.id,
        name: sp.place.name,
        description: sp.place.description,
        location: sp.place.location,
        imageSrc: sp.place.imageUrls[0] || "/default-image.jpg",
        priceMin: sp.place.priceMin ?? 0,
        priceMax: sp.place.priceMax ?? 0,
        categories: [
          ...sp.place.placeMainCategories.map((pmc) => pmc.mainCategory.name),
          ...sp.place.placeSubCategories.map((psc) => psc.subCategory.name),
        ],
        moods: sp.place.moods,
        likes: sp.place.placeLikes.length,
      }))
    );
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to fetch saved places" },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET(req: NextRequest) {
    try {
        // Fetch all places with their likes
        const places = await prisma.place.findMany({
            include: {
                placeLikes: true, // include likes
                placeMainCategories: { include: { mainCategory: true } },
                placeSubCategories: { include: { subCategory: true } },
            },
        });

        // Map places to a frontend-friendly format
        const mapped = places.map((p) => ({
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

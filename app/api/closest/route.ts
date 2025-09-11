// app/api/closest/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// Define the type based on your Prisma select
interface Place {
    id: string;
    name: string;
    description: string | null;
    location: string | null;
    latitude: number | string | null;
    longitude: number | string | null;
    priceMin: number | null;
    priceMax: number | null;
    imageUrls: string[] | null;
}

export async function GET(req: NextRequest) {
    try {
        const places: Place[] = await prisma.place.findMany({
            where: {
                latitude: { not: null },
                longitude: { not: null },
            },
            select: {
                id: true,
                name: true,
                description: true,
                location: true,
                latitude: true,
                longitude: true,
                priceMin: true,
                priceMax: true,
                imageUrls: true,
            },
        });

        // Ensure coordinates are numbers
        const sanitized = places.map((p: Place) => ({
            ...p,
            latitude: Number(p.latitude),
            longitude: Number(p.longitude),
        }));

        return NextResponse.json(sanitized);
    } catch (err) {
        console.error(err);
        return NextResponse.json(
            { error: "Failed to fetch places" },
            { status: 500 }
        );
    }
}
// app/api/closest/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// Define the type based on your Prisma select
interface Place {
    id: string;
    name: string;
    description: string | null;
    location: string | null;
    latitude: number | string | null;
    longitude: number | string | null;
    priceMin: number | null;
    priceMax: number | null;
    imageUrls: string[] | null;
}

export async function GET(req: NextRequest) {
    try {
        const places: Place[] = await prisma.place.findMany({
            where: {
                latitude: { not: null },
                longitude: { not: null },
            },
            select: {
                id: true,
                name: true,
                description: true,
                location: true,
                latitude: true,
                longitude: true,
                priceMin: true,
                priceMax: true,
                imageUrls: true,
            },
        });

        // Ensure coordinates are numbers
        const sanitized = places.map((p: Place) => ({
            ...p,
            latitude: Number(p.latitude),
            longitude: Number(p.longitude),
        }));

        return NextResponse.json(sanitized);
    } catch (err) {
        console.error(err);
        return NextResponse.json(
            { error: "Failed to fetch places" },
            { status: 500 }
        );
    }
}

// app/api/closest/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
    try {
        const places = await prisma.place.findMany({
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
        const sanitized = places.map((p) => ({
            ...p,
            latitude: Number(p.latitude),
            longitude: Number(p.longitude),
        }));

        return NextResponse.json(sanitized);
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "Failed to fetch places" }, { status: 500 });
    }
}

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma"; // adjust path if different

export async function GET() {
    try {
        const foodPack = await prisma.subCategory.findMany({
            where: { mainCategory: { name: "FOOD_PACK" } },
            select: { imageUrl: true },
        });

        const familyAndKids = await prisma.subCategory.findMany({
            where: { mainCategory: { name: "FAMILY_AND_KIDS" } },
            select: { imageUrl: true },
        });

        const nightLife = await prisma.subCategory.findMany({
            where: { mainCategory: { name: "NIGHT_LIFE" } },
            select: { imageUrl: true },
        });

        return NextResponse.json({
            foodPack: foodPack.map((s) => s.imageUrl).filter(Boolean),
            familyAndKids: familyAndKids.map((s) => s.imageUrl).filter(Boolean),
            nightLife: nightLife.map((s) => s.imageUrl).filter(Boolean),
        });
    } catch (error) {
        console.error("Slider fetch error:", error);
        return NextResponse.json({ error: "Failed to fetch slider images" }, { status: 500 });
    }
}


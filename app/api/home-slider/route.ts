// app/api/home-slider/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma"; // adjust path if different

// Define the type of the subCategory query result
interface SubCategoryItem {
    imageUrl: string | null;
}

export async function GET() {
    try {
        const foodPack: SubCategoryItem[] = await prisma.subCategory.findMany({
            where: { mainCategory: { name: "FOOD_PACK" } },
            select: { imageUrl: true },
        });

        const familyAndKids: SubCategoryItem[] = await prisma.subCategory.findMany({
            where: { mainCategory: { name: "FAMILY_AND_KIDS" } },
            select: { imageUrl: true },
        });

        const nightLife: SubCategoryItem[] = await prisma.subCategory.findMany({
            where: { mainCategory: { name: "NIGHT_LIFE" } },
            select: { imageUrl: true },
        });

        return NextResponse.json({
            foodPack: foodPack.map((s: SubCategoryItem) => s.imageUrl).filter(Boolean),
            familyAndKids: familyAndKids.map((s: SubCategoryItem) => s.imageUrl).filter(Boolean),
            nightLife: nightLife.map((s: SubCategoryItem) => s.imageUrl).filter(Boolean),
        });
    } catch (error) {
        console.error("Slider fetch error:", error);
        return NextResponse.json(
            { error: "Failed to fetch slider images" },
            { status: 500 }
        );
    }
}

import { NextResponse } from "next/server";
import prisma from "@/lib/db";

// Define type for review returned by Prisma
interface ReviewItem {
    id: string;
    comment: string | null;
    rating: number;
    userId: string;
}

export async function GET() {
    try {
        const reviews: ReviewItem[] = await prisma.review.findMany({
            select: {
                id: true,
                comment: true,
                rating: true,
                userId: true,
            },
        });

        return NextResponse.json(
            reviews.map((r: ReviewItem) => ({
                id: r.id,
                content: r.comment,
                rating: r.rating,
                userId: r.userId,
            }))
        );
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "Failed to fetch reviews" }, { status: 500 });
    }
}

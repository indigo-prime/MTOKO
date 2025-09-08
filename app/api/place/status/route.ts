// app/api/place/status/route.ts
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/db";

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const placeId = searchParams.get("placeId");
    if (!placeId) return NextResponse.json({ error: "Missing placeId" }, { status: 400 });

    const session = await auth();

    const likeCount = await prisma.placeLike.count({ where: { placeId } });

    if (!session?.user?.id) {
        return NextResponse.json({ liked: false, saved: false, likeCount });
    }

    const userId = session.user.id;

    const [liked, saved] = await Promise.all([
        prisma.placeLike.findFirst({ where: { userId, placeId }, select: { id: true } }),
        prisma.savedPlace.findFirst({ where: { userId, placeId }, select: { id: true } }),
    ]);

    return NextResponse.json({
        liked: Boolean(liked),
        saved: Boolean(saved),
        likeCount,
    });
}
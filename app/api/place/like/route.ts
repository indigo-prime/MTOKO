// app/api/place/like/route.ts
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/db";

export async function POST(req: Request) {
    const session = await auth();
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { placeId } = await req.json();
    if (!placeId) return NextResponse.json({ error: "Missing placeId" }, { status: 400 });

    const userId = session.user.id;

    const existing = await prisma.placeLike.findFirst({ where: { userId, placeId } });

    if (existing) {
        await prisma.placeLike.delete({ where: { id: existing.id } });
    } else {
        await prisma.placeLike.create({ data: { userId, placeId } });
    }

    const likeCount = await prisma.placeLike.count({ where: { placeId } });

    return NextResponse.json({ liked: !existing, likeCount });
}
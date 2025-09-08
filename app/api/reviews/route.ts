import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import prisma from '@/lib/db';

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const placeId = searchParams.get('placeId');
    if (!placeId) return NextResponse.json([], { status: 400 });

    const reviews = await prisma.review.findMany({
        where: { placeId },
        include: { user: { select: { name: true, image: true } } },
        orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(reviews.map((r) => ({
        id: r.id,
        content: r.comment,
        rating: r.rating,
        createdAt: r.createdAt.toLocaleDateString(),
        user: { name: r.user.name, image: r.user.image },
    })));
}

export async function POST(req: Request) {
    const session = await auth();
    if (!session?.user?.id) return NextResponse.json({ message: 'Unauthenticated' }, { status: 401 });

    const { placeId, content, rating } = await req.json();
    if (!placeId || !rating) return NextResponse.json({ message: 'Invalid data' }, { status: 400 });

    const newReview = await prisma.review.create({
        data: {
            placeId,
            comment: content,
            rating,
            userId: session.user.id,
        },
        include: { user: { select: { name: true, image: true } } },
    });

    return NextResponse.json([{
        id: newReview.id,
        content: newReview.comment,
        rating: newReview.rating,
        createdAt: newReview.createdAt.toLocaleDateString(),
        user: { name: newReview.user.name, image: newReview.user.image },
    }]);
}

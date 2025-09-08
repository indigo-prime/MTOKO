import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import prisma from '@/lib/db';

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
    const session = await auth();
    if (!session?.user?.id) return NextResponse.json({ message: 'Unauthenticated' }, { status: 401 });

    const id = params.id;
    const review = await prisma.review.findUnique({ where: { id } });
    if (!review || review.userId !== session.user.id) {
        return NextResponse.json({ message: 'Not allowed' }, { status: 403 });
    }

    await prisma.review.delete({ where: { id } });
    return NextResponse.json({ success: true });
}

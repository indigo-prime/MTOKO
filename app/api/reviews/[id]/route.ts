// app/api/reviews/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/db";

// DELETE /api/reviews/[id]
export async function DELETE(
  req: NextRequest,
  context: any // use 'any' because Next.js doesn't type this officially
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthenticated" }, { status: 401 });
  }

  const { id } = context.params as { id: string };
  if (!id) {
    return NextResponse.json({ message: "Missing review ID" }, { status: 400 });
  }

  const review = await prisma.review.findUnique({ where: { id } });
  if (!review || review.userId !== session.user.id) {
    return NextResponse.json({ message: "Not allowed" }, { status: 403 });
  }

  await prisma.review.delete({ where: { id } });
  return NextResponse.json({ success: true });
}

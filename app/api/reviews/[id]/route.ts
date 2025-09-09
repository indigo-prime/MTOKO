import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/db";

export async function DELETE(
  request: Request,
  context: { params: { id: string } } // Correct type for Next.js App Router
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthenticated" }, { status: 401 });
  }

  const { id } = context.params;

  const review = await prisma.review.findUnique({ where: { id } });
  if (!review || review.userId !== session.user.id) {
    return NextResponse.json({ message: "Not allowed" }, { status: 403 });
  }

  await prisma.review.delete({ where: { id } });
  return NextResponse.json({ success: true });
}

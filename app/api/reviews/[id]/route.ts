// app/api/reviews/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/db";

// DELETE /api/reviews/[id]
export async function DELETE(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthenticated" }, { status: 401 });
  }

  // Extract the id from the URL
  const url = new URL(req.url);
  const segments = url.pathname.split("/");
  const id = segments[segments.length - 1]; // last segment

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

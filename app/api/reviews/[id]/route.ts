<<<<<<< HEAD
// app/api/reviews/[id]/route.ts
=======
>>>>>>> 66fc7289905e4cf9c341e20a3443a65433cabd7b
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/db";

// DELETE /api/reviews/[id]
export async function DELETE(req: NextRequest) {
  // Authenticate the user
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthenticated" }, { status: 401 });
  }

  // Extract the ID from the URL (last segment of the path)
  const url = new URL(req.url);
  const segments = url.pathname.split("/");
  const id = segments[segments.length - 1];

  if (!id) {
    return NextResponse.json({ message: "Missing review ID" }, { status: 400 });
  }

  // Check if the review exists and belongs to the user
  const review = await prisma.review.findUnique({ where: { id } });
  if (!review || review.userId !== session.user.id) {
    return NextResponse.json({ message: "Not allowed" }, { status: 403 });
  }

  // Delete the review
  await prisma.review.delete({ where: { id } });
  return NextResponse.json({ success: true });
}

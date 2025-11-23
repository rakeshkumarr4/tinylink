import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request: Request, { params }: { params: any }) {
  const resolved = await params;
  const { shortcode } = resolved ?? {};

  if (!shortcode) {
    return new NextResponse("Not found", { status: 404 });
  }

  const link = await prisma.link.findUnique({ where: { shortcode } });
  if (!link) {
    return new NextResponse("Not found", { status: 404 });
  }

  try {
    await prisma.link.update({
      where: { id: link.id },
      data: {
        timesAccessed: { increment: 1 },
        lastAccessed: new Date(),
      },
    });
  } catch (e) {
    console.error('Failed to update access metrics for', shortcode, e);
  }

  return NextResponse.redirect(link.longUrl, 302);
}

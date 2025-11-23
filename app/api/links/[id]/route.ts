import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function DELETE(request: Request, { params }: { params: any }) {
  const resolved = await params;
  const { id } = resolved ?? {};

  if (!id) {
    return NextResponse.json({ error: 'id is required' }, { status: 400 });
  }

  const numericId = Number(id);
  if (Number.isNaN(numericId)) {
    return NextResponse.json({ error: 'invalid id' }, { status: 400 });
  }

  try {
    await prisma.link.delete({ where: { id: numericId as any } });
    return NextResponse.json({ success: true });
  } catch (err: any) {
    if (err?.code === 'P2025') {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }
    throw err;
  }
}

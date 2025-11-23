import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request: Request, { params }: { params: any }) {
    const resolvedParams = await params;
    const { shortcode } = resolvedParams ?? {};

    if (!shortcode) {
        return NextResponse.json({ error: "shortcode is required" }, { status: 400 });
    }

    const exists = await prisma.link.findUnique({ where: { shortcode } });

    return NextResponse.json({ exists: !!exists });
}
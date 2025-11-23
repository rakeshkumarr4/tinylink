import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";

export async function GET() {
    const links = await prisma.link.findMany();
    return NextResponse.json(links);
}

export async function POST(request: Request) {
    const raw = await request.text();
    console.log('raw body:', raw);

    let body: any;
    try {
        body = raw ? JSON.parse(raw) : {};
    } catch (e) {
        return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
    }

    const { longUrl, shortcode } = body;

    console.log('parsed:', longUrl, shortcode);

    try {
        new URL(longUrl);
    } catch {
        return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
    }

    try {
        const newLink = await prisma.link.create({
            data: {
                longUrl,
                shortcode,
            },
        });

        return NextResponse.json(newLink);
    } catch (err: any) {
        if (err?.code === 'P2002' || (err instanceof Prisma?.PrismaClientKnownRequestError && err.code === 'P2002')) {
            return NextResponse.json({ error: 'Shortcode already exists' }, { status: 409 });
        }
        throw err;
    }
}
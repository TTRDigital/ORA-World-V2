import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";

/** Sanity webhook → on-demand revalidation of every content fetch. */
export async function POST(req: Request) {
  const secret = process.env.ORA2_SANITY_REVALIDATE_SECRET;
  const provided = req.headers.get("x-ora2-secret") || new URL(req.url).searchParams.get("secret");
  if (!secret || provided !== secret) return NextResponse.json({ ok: false }, { status: 401 });
  revalidateTag("content", "max");
  return NextResponse.json({ ok: true, revalidated: true, at: new Date().toISOString() });
}

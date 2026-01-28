import { NextResponse } from "next/server";
import crypto from "crypto";
import { redis } from "@/lib/redis";
import { getNowMs } from "@/lib/time";

type CreatePasteBody = {
  content?: string;
  ttl_seconds?: number;
  max_views?: number;
};

export async function POST(req: Request) {
  let body: CreatePasteBody;

  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON body" },
      { status: 400 }
    );
  }

  const { content, ttl_seconds, max_views } = body;

  // ---- validation ----
  if (typeof content !== "string" || content.trim().length === 0) {
    return NextResponse.json(
      { error: "content must be a non-empty string" },
      { status: 400 }
    );
  }

  if (
    ttl_seconds !== undefined &&
    (!Number.isInteger(ttl_seconds) || ttl_seconds < 1)
  ) {
    return NextResponse.json(
      { error: "ttl_seconds must be an integer >= 1" },
      { status: 400 }
    );
  }

  if (
    max_views !== undefined &&
    (!Number.isInteger(max_views) || max_views < 1)
  ) {
    return NextResponse.json(
      { error: "max_views must be an integer >= 1" },
      { status: 400 }
    );
  }

  // ---- create paste ----
  const id = crypto.randomBytes(6).toString("hex"); // short & unique
  const now = await getNowMs();

  const expires_at =
    ttl_seconds !== undefined ? now + ttl_seconds * 1000 : null;

  const paste = {
    id,
    content,
    created_at: now,
    expires_at,
    max_views: max_views ?? null,
    views: 0,
  };

  await redis.set(`paste:${id}`, paste);

  const origin =
  req.headers.get("origin") ??
  process.env.NEXT_PUBLIC_BASE_URL ??
  "http://localhost:3000";

const url = `${origin}/p/${id}`;

  return NextResponse.json(
    { id, url },
    { status: 201 }
  );
}

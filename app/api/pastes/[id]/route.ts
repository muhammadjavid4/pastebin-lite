import { NextResponse } from "next/server";
import { redis } from "@/lib/redis";
import { getNowMs } from "@/lib/time";

type Paste = {
  id: string;
  content: string;
  created_at: number;
  expires_at: number | null;
  max_views: number | null;
  views: number;
};

export async function GET(
  _req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const key = `paste:${id}`;

  const paste = await redis.get<Paste>(key);

  // ---- missing ----
  if (!paste) {
    return NextResponse.json(
      { error: "Paste not found" },
      { status: 404 }
    );
  }

  const now = await getNowMs();

  // ---- expired ----
  if (paste.expires_at !== null && now >= paste.expires_at) {
    await redis.del(key);
    return NextResponse.json(
      { error: "Paste expired" },
      { status: 404 }
    );
  }

  // ---- view limit exceeded ----
  if (paste.max_views !== null && paste.views >= paste.max_views) {
    return NextResponse.json(
      { error: "Paste unavailable" },
      { status: 404 }
    );
  }

  // ---- increment views ----
  const newViews = paste.views + 1;

  await redis.set(key, {
    ...paste,
    views: newViews,
  });

  const remaining_views =
    paste.max_views === null
      ? null
      : Math.max(paste.max_views - newViews, 0);

  return NextResponse.json(
    {
      content: paste.content,
      remaining_views,
      expires_at: paste.expires_at
        ? new Date(paste.expires_at).toISOString()
        : null,
    },
    { status: 200 }
  );
}

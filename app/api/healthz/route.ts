import { NextResponse } from "next/server";
import { redis } from "@/lib/redis";

export async function GET() {
  try {
    // quick ping to check persistence access
    await redis.ping();

    return NextResponse.json(
      { ok: true },
      { status: 200 }
    );
  } catch (err) {
    // still return JSON, but indicate unhealthy
    return NextResponse.json(
      { ok: false },
      { status: 200 }
    );
  }
}

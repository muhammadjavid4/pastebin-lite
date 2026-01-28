import { headers } from "next/headers";

export async function getNowMs(): Promise<number> {
  // TEST_MODE enabled?
  if (process.env.TEST_MODE === "1") {
    const h = await headers();
    const testNow = h.get("x-test-now-ms");

    if (testNow) {
      const parsed = Number(testNow);
      if (!Number.isNaN(parsed)) {
        return parsed;
      }
    }
  }

  // fallback to real system time
  return Date.now();
}

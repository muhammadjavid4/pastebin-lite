# Pastebin Lite

A simple Pastebin-like application where users can create text pastes and share a link to view them.
Pastes can optionally expire based on time (TTL) or view count.

This project is built as part of a take-home assessment.

---

## Features

- Create a paste with arbitrary text
- Get a shareable URL for the paste
- View paste content via browser
- Optional constraints:
  - Time-based expiry (TTL)
  - View count limit
- Automatic expiry when any constraint is triggered
- Deterministic time support for testing
- Serverless-safe persistent storage

---

## Tech Stack

- **Next.js (App Router)**
- **TypeScript**
- **Upstash Redis** (persistence layer)
- **Vercel** (deployment)

---

## API Endpoints

### Health Check

GET /api/healthz


Response:
```json
{ "ok": true }

Create Paste
POST /api/pastes


Request body:

{
  "content": "Hello world",
  "ttl_seconds": 60,
  "max_views": 5
}


Response:

{
  "id": "abc123",
  "url": "https://your-app.vercel.app/p/abc123"
}

Fetch Paste (API)
GET /api/pastes/:id


Response:

{
  "content": "Hello world",
  "remaining_views": 4,
  "expires_at": "2026-01-01T00:00:00.000Z"
}


Each successful fetch counts as a view.

Deterministic Time (Testing)

If TEST_MODE=1 is set, the application uses the request header:

x-test-now-ms: <milliseconds since epoch>


as the current time for expiry logic.

Persistence Layer

The application uses Upstash Redis as a persistence layer.
This ensures data survives across requests in a serverless environment such as Vercel.

Running Locally
1. Install dependencies
npm install

2. Create .env.local
UPSTASH_REDIS_REST_URL=your_upstash_url
UPSTASH_REDIS_REST_TOKEN=your_upstash_token
NEXT_PUBLIC_BASE_URL=http://localhost:3000
TEST_MODE=0

3. Run the development server
npm run dev


Open:

http://localhost:3000

Deployment

The app is designed to be deployed on Vercel with no manual migrations required.
--------------------------------------------------------------------------------

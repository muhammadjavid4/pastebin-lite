// import { notFound } from "next/navigation";

// type PasteResponse = {
//   content: string;
//   remaining_views: number | null;
//   expires_at: string | null;
// };

// async function getPaste(id: string): Promise<PasteResponse> {
//   const res = await fetch(
//     `/api/pastes/${id}`,
//     { cache: "no-store" }
//   );

//   if (!res.ok) {
//     notFound();
//   }

//   return res.json();
// }

// export default async function PastePage({
//   params,
// }: {
//   params: Promise<{ id: string }>;
// }) {
//   const { id } = await params;
//   const paste = await getPaste(id);

//   return (
//     <main style={{ padding: "2rem", maxWidth: "800px", margin: "auto" }}>
//       <h1>Paste</h1>

//       <pre
//         style={{
//           marginTop: "1rem",
//           padding: "1rem",
//           background: "#f5f5f5",
//           borderRadius: "6px",
//           whiteSpace: "pre-wrap",
//           wordBreak: "break-word",
//         }}
//       >
//         {paste.content}
//       </pre>

//       <div style={{ marginTop: "1rem", color: "#555" }}>
//         {paste.remaining_views !== null && (
//           <p>Remaining views: {paste.remaining_views}</p>
//         )}
//         {paste.expires_at && (
//           <p>Expires at: {new Date(paste.expires_at).toLocaleString()}</p>
//         )}
//       </div>
//     </main>
//   );
// }


// import { notFound } from "next/navigation";

// type PasteResponse = {
//   content: string;
//   remaining_views: number | null;
//   expires_at: string | null;
// };

// async function getPaste(id: string): Promise<PasteResponse> {
//   const res = await fetch(`http://localhost:3000/api/pastes/${id}`, {
//     cache: "no-store",
//   });

//   if (!res.ok) {
//     notFound();
//   }

//   return res.json();
// }

// export default async function PastePage({
//   params,
// }: {
//   params: { id: string };
// }) {
//   const { id } = params;
//   const paste = await getPaste(id);

//   return (
//     <main style={{ padding: "2rem", maxWidth: 800, margin: "auto" }}>
//       <h1>Paste</h1>

//       <pre
//         style={{
//           marginTop: "1rem",
//           padding: "1rem",
//           background: "#f5f5f5",
//           whiteSpace: "pre-wrap",
//           wordBreak: "break-word",
//         }}
//       >
//         {paste.content}
//       </pre>

//       <p>Remaining views: {paste.remaining_views}</p>
//     </main>
//   );
// }


// import { notFound } from "next/navigation";

// type PasteResponse = {
//   content: string;
//   remaining_views: number | null;
//   expires_at: string | null;
// };

// async function getPaste(id: string): Promise<PasteResponse> {
//   const res = await fetch(`http://localhost:3000/api/pastes/${id}`, {
//     cache: "no-store",
//   });

//   if (!res.ok) {
//     notFound();
//   }

//   return res.json();
// }

// export default async function PastePage({
//   params,
// }: {
//   params: Promise<{ id: string }>;
// }) {
//   // ✅ THIS IS THE FIX
//   const { id } = await params;

//   const paste = await getPaste(id);

//   return (
//     <main style={{ padding: "2rem", maxWidth: 800, margin: "auto" }}>
//       <h1>Paste</h1>

//       <pre
//         style={{
//           marginTop: "1rem",
//           padding: "1rem",
//           background: "#f5f5f5",
//           whiteSpace: "pre-wrap",
//           wordBreak: "break-word",
//         }}
//       >
//         {paste.content}
//       </pre>

//       {paste.remaining_views !== null && (
//         <p>Remaining views: {paste.remaining_views}</p>
//       )}
//     </main>
//   );
// }


// import { notFound } from "next/navigation";

// type PasteResponse = {
//   content: string;
//   remaining_views: number | null;
//   expires_at: string | null;
// };

// async function getPaste(id: string): Promise<PasteResponse> {
//   // ✅ RELATIVE URL (works locally + on Vercel)
//   const res = await fetch(`/api/pastes/${id}`, {
//     cache: "no-store",
//   });

//   if (!res.ok) {
//     notFound();
//   }

//   return res.json();
// }

// export default async function PastePage({
//   params,
// }: {
//   params: Promise<{ id: string }>;
// }) {
//   // ✅ Next.js App Router: params is async
//   const { id } = await params;

//   const paste = await getPaste(id);

//   return (
//     <main style={{ padding: "2rem", maxWidth: 800, margin: "auto" }}>
//       <h1>Paste</h1>

//       <pre
//         style={{
//           marginTop: "1rem",
//           padding: "1rem",
//           background: "#f5f5f5",
//           whiteSpace: "pre-wrap",
//           wordBreak: "break-word",
//         }}
//       >
//         {paste.content}
//       </pre>

//       {paste.remaining_views !== null && (
//         <p>Remaining views: {paste.remaining_views}</p>
//       )}

//       {paste.expires_at && (
//         <p>Expires at: {new Date(paste.expires_at).toLocaleString()}</p>
//       )}
//     </main>
//   );
// }

import { notFound } from "next/navigation";
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

export default async function PastePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const key = `paste:${id}`;
  const paste = await redis.get<Paste>(key);

  if (!paste) {
    notFound();
  }

  const now = await getNowMs();

  // expired
  if (paste.expires_at !== null && now >= paste.expires_at) {
    await redis.del(key);
    notFound();
  }

  // view limit
  if (paste.max_views !== null && paste.views >= paste.max_views) {
    notFound();
  }

  // increment views
  const newViews = paste.views + 1;
  await redis.set(key, { ...paste, views: newViews });

  const remaining_views =
    paste.max_views === null
      ? null
      : Math.max(paste.max_views - newViews, 0);

  return (
    <main style={{ padding: "2rem", maxWidth: 800, margin: "auto" }}>
      <h1>Paste</h1>

      <pre
        style={{
          marginTop: "1rem",
          padding: "1rem",
          background: "#f5f5f5",
          whiteSpace: "pre-wrap",
          wordBreak: "break-word",
        }}
      >
        {paste.content}
      </pre>

      {remaining_views !== null && (
        <p>Remaining views: {remaining_views}</p>
      )}

      {paste.expires_at && (
        <p>Expires at: {new Date(paste.expires_at).toLocaleString()}</p>
      )}
    </main>
  );
}

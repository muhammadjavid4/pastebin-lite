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


import { notFound } from "next/navigation";

type PasteResponse = {
  content: string;
  remaining_views: number | null;
  expires_at: string | null;
};

async function getPaste(id: string): Promise<PasteResponse> {
  const res = await fetch(`http://localhost:3000/api/pastes/${id}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    notFound();
  }

  return res.json();
}

export default async function PastePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // ✅ THIS IS THE FIX
  const { id } = await params;

  const paste = await getPaste(id);

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

      {paste.remaining_views !== null && (
        <p>Remaining views: {paste.remaining_views}</p>
      )}
    </main>
  );
}

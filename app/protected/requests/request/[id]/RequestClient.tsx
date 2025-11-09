// app/protected/requests/request/[id]/RequestClient.tsx
// "use client";

// import Image from "next/image";
// import { useState, useRef, useEffect } from "react";

// export default function RequestClient({ request }: { request: any }) {
//   const [open, setOpen] = useState(false);
//   const [value, setValue] = useState<"On Going" | "Completed" | "Cancel">("On Going");
//   const ref = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     const handler = (e: MouseEvent) => {
//       if (!ref.current) return;
//       if (!ref.current.contains(e.target as Node)) setOpen(false);
//     };
//     document.addEventListener("mousedown", handler);
//     return () => document.removeEventListener("mousedown", handler);
//   }, []);

//   const select = (v: "On Going" | "Completed" | "Cancel") => {
//     setValue(v);
//     setOpen(false);
//   };

//   return (
//     <section className="mx-auto flex w-full max-w-5xl flex-col gap-8 border rounded-xl bg-white p-6 md:p-10">
//       <header className="flex flex-col gap-4 md:flex-row md:items-start md:gap-8">
//         <div className="mx-auto w-full max-w-sm flex-shrink-0 md:mx-0">
//           <div className="relative h-64 w-full overflow-hidden rounded-lg bg-gray-100 shadow-sm sm:h-72">
//             {request.image_url ? (
//               <Image
//                 src={request.image_url}
//                 alt={request.title}
//                 fill
//                 className="object-cover"
//                 sizes="(max-width: 768px) 100vw, 320px"
//               />
//             ) : (
//               <div className="flex h-full w-full items-center justify-center text-sm text-gray-500">
//                 No image available
//               </div>
//             )}
//           </div>
//         </div>
//             <div className="flex flex-1 flex-col gap-4">
//           <h1 className="w-full font-bold">
//             {request.title}, {request.community}. Requested by spic
//           </h1>
//           <h2 className="text-gray-800">
//             Description: {request.description ?? "No description provided."}
//           </h2>
//         </div>
//       </header>

//       <article className="mx-left w-full max-w-sm flex gap-4 mt-2" ref={ref}>
//         <button
//           type="button"
//           onClick={() => setOpen(o => !o)}
//           className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white px-5 py-2 rounded-lg text-lg font-semibold hover:bg-blue-700 transition"
//         >
//           Change State
//         </button>

//         {open && (
//           <div className="absolute left-0 z-10 mt-2 w-full rounded-xl border bg-white shadow-lg p-2">
//             {(["On Going", "Completed", "Cancel"] as const).map(opt => (
//               <button
//                 key={opt}
//                 onClick={() => select(opt)}
//                 className="w-full text-left px-3 py-2 rounded-md hover:bg-gray-100 ${
//                   value === opt ?"
//               >
//                 {opt}
//               </button>
//             ))}
//           </div>
//         )}

//         <button className="flex-1 bg-red-600 text-white px-5 py-3 rounded-lg text-lg font-semibold hover:bg-red-700 transition">
//           Save
//         </button>
//       </article>
//     </section>
//   );
// }
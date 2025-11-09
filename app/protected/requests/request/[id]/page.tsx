// app/protected/requests/request/[id]/page.tsx
// import { notFound } from "next/navigation";
// import { RetrieveRequestById } from "@/lib/supabase/supabaseCall";
// import RequestClient from "./RequestClient";

// export default async function RequestPage({ params }: { params: { id: string } }) {
//   const request = await RetrieveRequestById(params.id);
//   if (!request) notFound();

//   return <RequestClient request={request} />;
// }
import Image from "next/image";
import { notFound } from "next/navigation";

import { RetrieveRequestById } from "@/lib/supabase/supabaseCall";


type RequestPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function Request(props: RequestPageProps) {
  const { params } = props;
  const { id } = await params;

  const request = await RetrieveRequestById(id);

  if (!request) {
    notFound();
  }

  const createdAt =
    typeof request.created_at === "string"
      ? request.created_at.replace(" ", "T")
      : request.created_at;
  const createdAtDate =
    createdAt && !Number.isNaN(new Date(createdAt).getTime())
      ? new Date(createdAt).toLocaleDateString(undefined, {
          weekday: "short",
          month: "short",
          day: "numeric",
          year: "numeric",
        })
      : "Unknown date";
  const createdAtTime =
    createdAt && !Number.isNaN(new Date(createdAt).getTime())
      ? new Date(createdAt).toLocaleTimeString(undefined, {
          hour: "numeric",
          minute: "2-digit",
        })
      : "Unknown time";

  const title = request.title ?? "Untitled request";
  const location = request.community ?? "Unknown location";
  const description = request.description ?? "No description provided.";
  const type = request.type ?? "Unknown type";
  const state = request.state ?? "Unknown state";
  const imageUrl = request.image_url ?? null;

  return (
    <section className="mx-auto flex w-full max-w-5xl flex-col gap-8 border rounded-xl bg-white p-6 md:p-10">
      <header className="flex flex-col gap-4 md:flex-row md:items-start md:gap-8">
        <div className="mx-auto w-full max-w-sm flex-shrink-0 md:mx-0">
          <div className="relative h-64 w-full overflow-hidden rounded-lg bg-gray-100 shadow-sm sm:h-72">
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt={title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 320px"
                priority
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-sm text-gray-500">
                No image available
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-1 flex-col gap-4">
          <h1 className="w-full text-left justify-center font-bold"> 
          {title}, {location}. Requested by spic </h1> 
          <h2 className="text-x1 text-gray-800"> 
          Description of request: {description} 
          </h2>
        </div>
      </header>
        <article className="mx-left w-full max-w-sm flex gap-4 mt-2">
          <button className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition">
            <img width="18"src="/drop_menu_arrow.png" height="18" alt=""></img>
            Update Status
          </button>
          <button className="flex-1 bg-red-600 text-white px-2 py-2 rounded-lg text-lg font-semibold hover:bg-red-700 transition" > 
            Save 
          </button>
        </article>
    </section>
  );
}
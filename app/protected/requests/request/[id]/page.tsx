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
            {/* 
                In this block, we should have title , location, type dat
            */}


            
        </div>
      </header>

        {/* Below the image, do not use this design as it looks pretty ugly
            1. Needs to have a description of the issue
            2. Needs to also have 2 buttons, 1 being the ability to change the state - (Open to Closed)
            3. And the other to save the changes. 
        
        */}
      <article className="flex flex-col gap-4">
        
        {/* <h2 className="text-xl font-semibold text-gray-900">Description</h2>
        <p className="text-base leading-relaxed text-gray-700">{description}</p> */}
      </article>

    </section>
  );
}
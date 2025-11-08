import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { RetrieveRecentRequests } from "@/lib/supabase/supabaseCall";
import Link from "next/link";
// import { InfoIcon } from "lucide-react";
// import { FetchDataSteps } from "@/components/tutorial/fetch-data-steps";

export default async function ProtectedPage() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();

  if (error || !data?.claims) {
    redirect("/auth/login");
  }

  const recentRequests = await RetrieveRecentRequests();

  const normalizedRequests = recentRequests.map((request) => {
    const isoTimestamp =
      typeof request.created_at === "string"
        ? request.created_at.replace(" ", "T")
        : null;
    const createdAtDateTime = isoTimestamp ? new Date(isoTimestamp) : undefined;
    const hasValidDate =
      createdAtDateTime && !Number.isNaN(createdAtDateTime.getTime());
    const createdAtDate = hasValidDate
      ? createdAtDateTime.toLocaleDateString(undefined, {
            month: "short",
            day: "numeric",
        })
      : "Unknown date";
    const createdAtTime = hasValidDate
      ? createdAtDateTime.toLocaleTimeString(undefined, {
          hour: "numeric",
          minute: "2-digit",
        })
      : "Unknown time";

      console.log(request.id)

    return {
      id: request.id,
      title: request.title ?? "Untitled request",
      neighbourhood: request.community ?? "Unknown area",
      type: request.type ?? "Unknown Type",
      state: request.state ?? "Unknown State",
      createdAtDate,
      createdAtTime,
    };
  });

  return (
    <section className="flex w-full flex-row items-start gap-6">
      <div className="flex-1 rounded-xl bg-gray-100 p-4">
        <div className="flex h-[70vh] w-full items-center justify-center text-gray-500">
          Map goes here
        </div>
      </div>

      <aside className="w-80 bg-white rounded-xl shadow-md p-4 flex flex-col">
        <h2 className="text-xl font-semibold mb-4">New Requests</h2>
        <div className="flex-1 overflow-y-auto space-y-3">
          {normalizedRequests.length === 0 ? (
            <div className="p-3 rounded-lg bg-gray-50 border text-sm text-gray-500">
              No requests yet.
            </div>
          ) : (
            normalizedRequests.map((request) => (
              <Link
                key={
                  request.id ??
                  `${request.createdAtDate}-${request.createdAtTime}-${request.title}`
                }
                href={`/protected/requests/request/${request.id}`}
                className="block"
              >
                <div className="p-3 flex flex-rows rounded-lg bg-gray-50 border transition hover:border-blue-400 hover:shadow">
                  <div className="flex flex-col gap-1">
                    <h3 className="font-medium">
                      {request.title} - {request.type}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {request.createdAtDate} • {request.createdAtTime} • {" "}
                      {request.neighbourhood}
                    </p>
                  </div>

                  <div className="flex flex-col gap-1 ml-auto items-end">
                    <div
                      className={
                        `px-2 py-1 rounded text-xs font-semibold ` +
                        (request.state === "Open"
                          ? "bg-green-100 text-green-800"
                          : request.state === "Closed"
                          ? "bg-red-100 text-red-800"
                          : "bg-gray-200 text-gray-700")
                      }
                    >
                      {request.state}
                    </div>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </aside>
    </section>
  );
}

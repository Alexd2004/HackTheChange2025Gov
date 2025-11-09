// 'use client';

// import { useEffect, useState } from 'react';
// import Image from 'next/image';
// import Link from 'next/link';
// import { useParams, useRouter } from 'next/navigation';
// import { createClient } from '@/lib/supabase/client';

// type RequestRecord = {
//   id: string;
//   title?: string | null;
//   description?: string | null;
//   community?: string | null;
//   state?: string | null;
//   type?: string | null;
//   image_url?: string | null;
//   created_at?: string | null;
// };

// export default function RequestPage() {
//   const params = useParams();
//   const router = useRouter();
//   const id = params?.id as string;

//   const [request, setRequest] = useState<RequestRecord | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [status, setStatus] = useState<string>('open');
//   const [saving, setSaving] = useState(false);
//   const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

//   useEffect(() => {
//     async function fetchRequest() {
//       setLoading(true);
//       const supabase = createClient();
//       const { data, error } = await supabase
//         .from('requests')
//         .select('*')
//         .eq('id', id)
//         .single();
//       if (error || !data) {
//         console.error(`Failed to fetch request ${id}:`, error);
//         router.push('/protected');
//         return;
//       }
//       setRequest(data as RequestRecord);
//       setStatus(data.state ?? 'open');
//       setLoading(false);
//     }
//     fetchRequest();
//   }, [id, router]);

//   const handleSave = async () => {
//     if (!request) return;
//     setSaving(true);
//     setMessage(null);
//     const supabase = createClient();
//     const { error } = await supabase
//       .from('requests')
//       .update({ state: status })
//       .eq('id', request.id);
//     if (error) {
//       console.error(`Failed to update request ${request.id}:`, error);
//       setMessage({ type: 'error', text: '❌ Failed to update request status.' });
//     } else {
//       setMessage({
//         type: 'success',
//         text: `✅ Request marked as ${status.toUpperCase()}.`,
//       });
//       setRequest({ ...request, state: status });
//     }

//     setSaving(false);
//   };

//   if (loading) {
//     return (
//       <main className="flex h-[70vh] items-center justify-center text-gray-500">
//         Loading request details…
//       </main>
//     );
//   }

//   if (!request) {
//     return (
//       <main className="flex h-[70vh] flex-col items-center justify-center gap-3 text-gray-500">
//         <p className="text-lg font-semibold text-gray-700">Request not found.</p>
//         <Link
//           href="/protected"
//           className="text-sm font-medium text-red-600 hover:underline"
//         >
//           ← Back to Dashboard
//         </Link>
//       </main>
//     );
//   }

//   const {
//     title = 'Untitled Request',
//     description = 'No description provided.',
//     community = 'Unknown Location',
//     state = 'Unknown State',
//     type = 'Unknown Type',
//     image_url,
//     created_at,
//   } = request;

//   const date = created_at
//     ? new Date(created_at).toLocaleDateString(undefined, {
//         weekday: 'short',
//         month: 'short',
//         day: 'numeric',
//         year: 'numeric',
//       })
//     : 'Unknown Date';

//   const time = created_at
//     ? new Date(created_at).toLocaleTimeString(undefined, {
//         hour: 'numeric',
//         minute: '2-digit',
//       })
//     : 'Unknown Time';

//   const normalizedState = (status ?? state ?? '').toString().toLowerCase();

//   const stateColor =
//     normalizedState === 'open'
//       ? 'bg-green-100 text-green-800 border-green-200'
//       : normalizedState.includes('progress')
//       ? 'bg-amber-100 text-amber-800 border-amber-200'
//       : 'bg-red-100 text-red-800 border-red-200';

//   return (
//     <main className="mx-auto w-full max-w-5xl px-6 py-10">
//       {/* 🔙 Back button */}
//       <div className="mb-6">
//         <Link
//           href="/protected"
//           className="inline-flex items-center text-sm font-medium text-red-600 hover:underline"
//         >
//           ← Back to Dashboard
//         </Link>
//       </div>

//       {/* 🧾 Main Card */}
//       <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
//         {/* Image Header */}
//         <div className="relative h-64 sm:h-80 w-full bg-gray-100">
//           {image_url ? (
//             <Image
//               src={image_url}
//               alt={title ?? 'Request image'}
//               fill
//               className="object-cover"
//               sizes="(max-width: 768px) 100vw, 768px"
//             />
//           ) : (
//             <div className="flex h-full w-full items-center justify-center text-gray-400 text-sm">
//               No image available
//             </div>
//           )}
//         </div>

//         {/* Details section */}
//         <div className="flex flex-col sm:flex-row gap-8 p-6 sm:p-10">
//           {/* Left column */}
//           <div className="flex-1 space-y-5">
//             <div>
//               <h1 className="text-2xl font-bold text-gray-900 mb-1">
//                 {title}
//               </h1>
//               <p className="text-sm text-gray-500">
//                 Reported in <span className="font-semibold">{community}</span>
//               </p>
//             </div>

//             <div>
//               <h2 className="text-lg font-semibold text-gray-900 mt-6">
//                 Description
//               </h2>
//               <p className="mt-2 text-gray-700 leading-relaxed">
//                 {description}
//               </p>
//             </div>

//             <div>
//               <h2 className="text-lg font-semibold text-gray-900">
//                 Request Details
//               </h2>
//               <dl className="mt-3 divide-y divide-gray-100 border border-gray-100 rounded-xl bg-gray-50 text-sm text-gray-700">
//                 <div className="flex justify-between p-3">
//                   <dt className="font-medium text-gray-600">Type</dt>
//                   <dd>{type}</dd>
//                 </div>
//                 <div className="flex justify-between p-3">
//                   <dt className="font-medium text-gray-600">Status</dt>
//                   <dd>
//                     <span
//                       className={`inline-block px-2 py-1 rounded-full border text-xs font-semibold ${stateColor}`}
//                     >
//                       {status.toUpperCase()}
//                     </span>
//                   </dd>
//                 </div>
//                 <div className="flex justify-between p-3">
//                   <dt className="font-medium text-gray-600">Date Created</dt>
//                   <dd>{date}</dd>
//                 </div>
//                 <div className="flex justify-between p-3">
//                   <dt className="font-medium text-gray-600">Time</dt>
//                   <dd>{time}</dd>
//                 </div>
//               </dl>
//             </div>
//           </div>

//           {/* Right column: status controls */}
//           <aside className="w-full sm:w-64 flex flex-col gap-4">
//             <label className="text-sm font-medium text-gray-700">
//               Update Status
//             </label>
//             <select
//               value={status}
//               onChange={(e) => setStatus(e.target.value)}
//               className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//             >
//               <option value="open">Open</option>
//               <option value="closed">Closed</option>
//             </select>

//             <button
//               disabled={saving}
//               onClick={handleSave}
//               className="flex items-center justify-center gap-2 rounded-lg bg-red-600 text-white py-3 text-base font-semibold hover:bg-red-700 transition disabled:opacity-50"
//             >
//               {saving ? 'Saving…' : 'Save Changes'}
//             </button>

//             {message && (
//               <p
//                 className={`text-sm mt-2 ${
//                   message.type === 'success' ? 'text-green-700' : 'text-red-600'
//                 }`}
//               >
//                 {message.text}
//               </p>
//             )}
//           </aside>
//         </div>
//       </section>
//     </main>
//   );
// }

'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { RetrieveRequestById, UpdateRequestState, CreateNotification } from '@/lib/supabase/supabaseClientCalls';
type RequestRecord = {
  id: string;
  submitted_by?: string | null;
  title?: string | null;
  description?: string | null;
  community?: string | null;
  state?: string | null;
  type?: string | null;
  image_url?: string | null;
  created_at?: string | null;
};

export default function RequestPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [request, setRequest] = useState<RequestRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<string>('open');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Fetch request from Supabase
  useEffect(() => {
    async function fetchRequest() {
      console.log(`🔍 Fetching request by ID: ${id}`);
      setLoading(true);
      const data = await RetrieveRequestById(id);

      if (!data) {
        console.error(`❌ Failed to fetch request ${id}`);
        router.push('/protected');
        return;
      }

      console.log('✅ Request data retrieved:', data);
      setRequest(data);
      setStatus(data.state ?? 'open');
      setLoading(false);
    }

    fetchRequest();
  }, [id, router]);

  // Handle save button click
  const handleSave = async () => {
    if (!request) return;
  
    console.log(`💾 Attempting to update request ID: ${request.id} → New state: ${status}`);
    setSaving(true);
    setMessage(null);
  
    try {
      const { success } = await UpdateRequestState(request.id, status);

      console.log('REQUEST ID , in the handle save', request.submitted_by)

      // const {data, error } = await getUserIDFromRequestID(request.id)
      
  
      if (!success) {
        console.error('❌ Update failed — check network or Supabase policy.');
        setMessage({ type: 'error', text: '❌ Failed to update request status.' });
      } else {
        console.log('✅ Successfully updated request in Supabase.');
        setMessage({
          type: 'success',
          text: `✅ Request marked as ${status.toUpperCase()}.`,
        });
        setRequest({ ...request, state: status });
  
        // 🆕 Create a notification when request is closed
        if (status.toLowerCase() === "closed") {
          console.log("📨 Creating notification for closed request...");
          await CreateNotification(
            request.submitted_by as string,
            request.id,
            "request_closed",
            `Your request "${request.title}" has been marked as closed.`
          );
        }
      }
    } catch (err) {
      console.error('🔥 Unexpected error during update:', err);
      setMessage({ type: 'error', text: '❌ Unexpected error occurred.' });
    }
  
    setSaving(false);
  };
  
  if (loading) {
    return (
      <main className="flex h-[70vh] items-center justify-center text-gray-500">
        Loading request details…
      </main>
    );
  }

  if (!request) {
    return (
      <main className="flex h-[70vh] flex-col items-center justify-center gap-3 text-gray-500">
        <p className="text-lg font-semibold text-gray-700">Request not found.</p>
        <Link href="/protected" className="text-sm font-medium text-red-600 hover:underline">
          ← Back to Dashboard
        </Link>
      </main>
    );
  }

  const {
    title = 'Untitled Request',
    description = 'No description provided.',
    community = 'Unknown Location',
    state = 'Unknown State',
    type = 'Unknown Type',
    image_url,
    created_at,
  } = request;

  const date = created_at
    ? new Date(created_at).toLocaleDateString(undefined, {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : 'Unknown Date';

  const time = created_at
    ? new Date(created_at).toLocaleTimeString(undefined, {
        hour: 'numeric',
        minute: '2-digit',
      })
    : 'Unknown Time';

  const normalizedState = (status ?? state ?? '').toString().toLowerCase();

  const stateColor =
    normalizedState === 'open'
      ? 'bg-green-100 text-green-800 border-green-200'
      : normalizedState.includes('progress')
      ? 'bg-amber-100 text-amber-800 border-amber-200'
      : 'bg-red-100 text-red-800 border-red-200';

  return (
    <main className="mx-auto w-full max-w-5xl px-6 py-10">
      <div className="mb-6">
        <Link
          href="/protected"
          className="inline-flex items-center text-sm font-medium text-red-600 hover:underline"
        >
          ← Back to Dashboard
        </Link>
      </div>

      <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="relative h-[480px] w-full bg-gray-100">
          {image_url ? (
            <>
              <Image
                src={image_url}
                alt={title ?? 'Request image'}
                fill
                className="object-cover"
                sizes="100vw"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              <div className="absolute bottom-6 left-6 text-white">
                <h1 className="text-3xl font-bold">{title}</h1>
                <p className="text-sm opacity-90">
                  Reported in <span className="font-semibold">{community}</span>
                </p>
              </div>
            </>
          ) : (
            <div className="flex h-full w-full items-center justify-center text-gray-400 text-sm">
              No image available
            </div>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-10 p-8 sm:p-10">
          <div className="flex-1 space-y-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Description</h2>
              <p className="mt-2 text-gray-700 leading-relaxed">{description}</p>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-gray-900">Request Details</h2>
              <dl className="mt-3 divide-y divide-gray-100 border border-gray-100 rounded-xl bg-gray-50 text-sm text-gray-700">
                <div className="flex justify-between p-3">
                  <dt className="font-medium text-gray-600">Type</dt>
                  <dd>{type}</dd>
                </div>
                <div className="flex justify-between p-3">
                  <dt className="font-medium text-gray-600">Status</dt>
                  <dd>
                    <span
                      className={`inline-block px-2 py-1 rounded-full border text-xs font-semibold ${stateColor}`}
                    >
                      {status.toUpperCase()}
                    </span>
                  </dd>
                </div>
                <div className="flex justify-between p-3">
                  <dt className="font-medium text-gray-600">Date Created</dt>
                  <dd>{date}</dd>
                </div>
                <div className="flex justify-between p-3">
                  <dt className="font-medium text-gray-600">Time</dt>
                  <dd>{time}</dd>
                </div>
              </dl>
            </div>
          </div>

          {/* Controls */}
          <aside className="w-full sm:w-64 flex flex-col gap-4">
            <label className="text-sm font-medium text-gray-700">Update Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Open">Open</option>
              <option value="Closed">Closed</option>
            </select>

            <button
              disabled={saving}
              onClick={handleSave}
              className="flex items-center justify-center gap-2 rounded-lg bg-red-600 text-white py-3 text-base font-semibold hover:bg-red-700 transition disabled:opacity-50"
            >
              {saving ? 'Saving…' : 'Save Changes'}
            </button>

            {message && (
              <p
                className={`text-sm mt-2 ${
                  message.type === 'success' ? 'text-green-700' : 'text-red-600'
                }`}
              >
                {message.text}
              </p>
            )}
          </aside>
        </div>
      </section>
    </main>
  );
}

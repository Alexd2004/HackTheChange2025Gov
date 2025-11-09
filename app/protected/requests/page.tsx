// 'use client';

// import { useEffect, useState, useMemo } from 'react';
// import { createClient } from '@/lib/supabase/client';
// import Link from 'next/link';

// type RequestRecord = {
//   id: number;
//   title: string | null;
//   community: string | null;
//   type: string | null;
//   state: string | null;
//   created_at: string | null;
// };

// export default function RequestsPage() {
//   const [requests, setRequests] = useState<RequestRecord[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [filterCommunity, setFilterCommunity] = useState<string>('All');
//   const [filterType, setFilterType] = useState<string>('All');

//   // 🧭 Normalize helper (for display)
//   const formatCommunity = (name: string | null) => {
//     if (!name) return 'Unknown';
//     // Remove codes like B0, 9A, etc.
//     if (/^[A-Z0-9]{1,3}$/.test(name.trim())) return '';
//     // Proper case
//     return name
//       .toLowerCase()
//       .replace(/\b\w/g, (c) => c.toUpperCase())
//       .trim();
//   };

//   // 1️⃣ Fetch requests
//   useEffect(() => {
//     const fetchData = async () => {
//       setLoading(true);
//       const supabase = createClient();

//       const { data, error } = await supabase
//         .from('requests')
//         .select('id, title, community, type, state, created_at')
//         .order('created_at', { ascending: false })
//         .limit(1000);

//       if (error) {
//         console.error('Error fetching requests:', error);
//         setRequests([]);
//       } else {
//         // Clean and filter invalid community names
//         const cleaned = (data || [])
//           .filter((r) => {
//             const comm = r.community?.trim() ?? '';
//             return comm && !/^[A-Z0-9]{1,3}$/.test(comm);
//           })
//           .map((r) => ({
//             ...r,
//             community: formatCommunity(r.community),
//           }));
//         setRequests(cleaned);
//       }

//       setLoading(false);
//     };

//     fetchData();
//   }, []);

//   // 2️⃣ Extract unique communities and types
//   const communities = useMemo(() => {
//     const set = new Set<string>();
//     requests.forEach((r) => r.community && set.add(r.community));
//     return Array.from(set).sort();
//   }, [requests]);

//   const types = useMemo(() => {
//     const set = new Set<string>();
//     requests.forEach((r) => r.type && set.add(r.type));
//     return Array.from(set).sort();
//   }, [requests]);

//   // 3️⃣ Filtered requests
//   const filteredRequests = useMemo(() => {
//     return requests.filter((r) => {
//       const communityMatch =
//         filterCommunity === 'All' ||
//         r.community?.toLowerCase() === filterCommunity.toLowerCase();
//       const typeMatch =
//         filterType === 'All' ||
//         r.type?.toLowerCase() === filterType.toLowerCase();
//       return communityMatch && typeMatch;
//     });
//   }, [requests, filterCommunity, filterType]);

//   // 4️⃣ Render
//   return (
//     <main className="flex flex-col w-full max-w-6xl mx-auto px-5 py-8">
//       <header className="flex flex-wrap items-center justify-between gap-3 mb-6">
//         <h1 className="text-2xl font-bold text-gray-900"> All Requests</h1>

//         <div className="flex flex-wrap gap-3 items-center">
//           {/* Filter by community */}
//           <select
//             value={filterCommunity}
//             onChange={(e) => setFilterCommunity(e.target.value)}
//             className="rounded-full border border-gray-300 bg-white px-3 py-1 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500"
//           >
//             <option value="All">All Communities</option>
//             {communities.map((c) => (
//               <option key={c} value={c}>
//                 {c}
//               </option>
//             ))}
//           </select>

//           {/* Filter by type */}
//           <select
//             value={filterType}
//             onChange={(e) => setFilterType(e.target.value)}
//             className="rounded-full border border-gray-300 bg-white px-3 py-1 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500"
//           >
//             <option value="All">All Types</option>
//             {types.map((t) => (
//               <option key={t} value={t}>
//                 {t}
//               </option>
//             ))}
//           </select>

//           {/* Reset filters */}
//           <button
//             onClick={() => {
//               setFilterCommunity('All');
//               setFilterType('All');
//             }}
//             className="text-sm text-red-600 font-semibold hover:underline"
//           >
//             Reset Filters
//           </button>
//         </div>
//       </header>

//       {/* Request table or cards */}
//       {loading ? (
//         <div className="flex items-center justify-center h-64 text-gray-500">
//           Loading requests…
//         </div>
//       ) : filteredRequests.length === 0 ? (
//         <div className="flex items-center justify-center h-64 text-gray-500">
//           No requests found.
//         </div>
//       ) : (
//         <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm bg-white">
//           <table className="min-w-full divide-y divide-gray-200">
//             <thead className="bg-gray-50">
//               <tr>
//                 <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
//                   Title
//                 </th>
//                 <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
//                   Type
//                 </th>
//                 <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
//                   Community
//                 </th>
//                 <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
//                   State
//                 </th>
//                 <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
//                   Created At
//                 </th>
//                 <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
//                   View
//                 </th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-gray-100">
//               {filteredRequests.map((r) => (
//                 <tr key={r.id} className="hover:bg-gray-50 transition-colors">
//                   <td className="px-4 py-3 text-sm text-gray-800">
//                     {r.title ?? 'Untitled'}
//                   </td>
//                   <td className="px-4 py-3 text-sm text-gray-600">{r.type}</td>
//                   <td className="px-4 py-3 text-sm text-gray-600">
//                     {formatCommunity(r.community)}
//                   </td>
//                   <td>
//                     <StateBadge state={r.state ?? 'Unknown'} />
//                   </td>
//                   <td className="px-4 py-3 text-sm text-gray-500">
//                     {r.created_at
//                       ? new Date(r.created_at).toLocaleDateString()
//                       : '—'}
//                   </td>
//                   <td className="px-4 py-3 text-sm font-semibold text-red-600">
//                     <Link
//                       href={`/protected/requests/request/${r.id}`}
//                       className="hover:underline"
//                     >
//                       View
//                     </Link>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}
//     </main>
//   );
// }

// // 🔹 Simple state badge
// function StateBadge({ state }: { state: string }) {
//   const normalized = state.toLowerCase();
//   let color = 'bg-gray-100 text-gray-700 border-gray-200';
//   if (normalized === 'open')
//     color = 'bg-green-50 text-green-700 border-green-200';
//   else if (normalized === 'closed')
//     color = 'bg-red-50 text-red-700 border-red-200';
//   else if (normalized.includes('progress'))
//     color = 'bg-amber-50 text-amber-700 border-amber-200';

//   return (
//     <span
//       className={`inline-block px-2 py-1 text-xs font-semibold border rounded-full ${color}`}
//     >
//       {state}
//     </span>
//   );
// }


'use client';

import { useEffect, useState, useMemo } from 'react';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';

type RequestRecord = {
  id: number;
  title: string | null;
  community: string | null;
  type: string | null;
  state: string | null;
  created_at: string | null;
};

const PAGE_SIZE = 100;

export default function RequestsPage() {
  const [requests, setRequests] = useState<RequestRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterCommunity, setFilterCommunity] = useState<string>('All');
  const [filterType, setFilterType] = useState<string>('All');
  const [page, setPage] = useState<number>(1);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc'); // 🆕 added sorting state

  // 🧭 Normalize community names
  const formatCommunity = (name: string | null) => {
    if (!name) return 'Unknown';
    if (/^[A-Z0-9]{1,3}$/.test(name.trim())) return '';
    return name
      .toLowerCase()
      .replace(/\b\w/g, (c) => c.toUpperCase())
      .trim();
  };

  // 🔹 Fetch requests (1000 max)
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const supabase = createClient();

      const { data, error } = await supabase
        .from('requests')
        .select('id, title, community, type, state, created_at')
        .order('created_at', { ascending: false }) // still fetch descending from DB
        .limit(1000);

      if (error) {
        console.error('Error fetching requests:', error);
        setRequests([]);
      } else {
        const cleaned = (data || [])
          .filter((r) => {
            const comm = r.community?.trim() ?? '';
            return comm && !/^[A-Z0-9]{1,3}$/.test(comm);
          })
          .map((r) => ({
            ...r,
            community: formatCommunity(r.community),
          }));
        setRequests(cleaned);
      }

      setLoading(false);
    };

    fetchData();
  }, []);

  // 🧮 Filter logic
  const filteredRequests = useMemo(() => {
    return requests
      .filter((r) => {
        const communityMatch =
          filterCommunity === 'All' ||
          r.community?.toLowerCase() === filterCommunity.toLowerCase();
        const typeMatch =
          filterType === 'All' ||
          r.type?.toLowerCase() === filterType.toLowerCase();
        return communityMatch && typeMatch;
      })
      .sort((a, b) => {
        const aDate = new Date(a.created_at ?? '').getTime();
        const bDate = new Date(b.created_at ?? '').getTime();
        return sortOrder === 'asc' ? aDate - bDate : bDate - aDate;
      });
  }, [requests, filterCommunity, filterType, sortOrder]);

  // 🔸 Pagination
  const totalPages = Math.ceil(filteredRequests.length / PAGE_SIZE);
  const start = (page - 1) * PAGE_SIZE;
  const currentRequests = filteredRequests.slice(start, start + PAGE_SIZE);

  const visiblePages = useMemo(() => {
    const pages: number[] = [];
    const maxVisible = 4;
    const half = Math.floor(maxVisible / 2);
    let startPage = Math.max(1, page - half);
    const endPage = Math.min(totalPages, startPage + maxVisible - 1);
    if (endPage - startPage < maxVisible - 1)
      startPage = Math.max(1, endPage - maxVisible + 1);
    for (let i = startPage; i <= endPage; i++) pages.push(i);
    return pages;
  }, [page, totalPages]);

  // 🖥️UI
  return (
    <main className="flex flex-col w-full max-w-7xl mx-auto px-5 py-8">
      <header className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-3">
          <Link
            href="/protected"
            className="inline-flex items-center rounded-full border border-gray-300 px-3 py-1 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-100 transition-colors"
          >
            ← Back to Dashboard
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">All Requests</h1>
        </div>

        <div className="flex flex-wrap gap-3 items-center">
          {/* Community Filter */}
          <select
            value={filterCommunity}
            onChange={(e) => {
              setFilterCommunity(e.target.value);
              setPage(1);
            }}
            className="rounded-full border border-gray-300 bg-white px-3 py-1 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            <option value="All">All Communities</option>
            {[...new Set(requests.map((r) => r.community))].sort().map((c) => (
              <option key={c} value={c ?? ''}>
                {c}
              </option>
            ))}
          </select>

          {/* Type Filter */}
          <select
            value={filterType}
            onChange={(e) => {
              setFilterType(e.target.value);
              setPage(1);
            }}
            className="rounded-full border border-gray-300 bg-white px-3 py-1 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            <option value="All">All Types</option>
            {[...new Set(requests.map((r) => r.type))].sort().map((t) => (
              <option key={t} value={t ?? ''}>
                {t}
              </option>
            ))}
          </select>

          {/* Sorting Toggle Button */}
          <button
            onClick={() =>
              setSortOrder((prev) => (prev === 'desc' ? 'asc' : 'desc'))
            }
            className="text-sm font-semibold text-red-600 hover:underline"
          >
            Sort: {sortOrder === 'desc' ? 'Newest → Oldest' : 'Oldest → Newest'}
          </button>

          {/* Reset */}
          <button
            onClick={() => {
              setFilterCommunity('All');
              setFilterType('All');
              setSortOrder('desc');
              setPage(1);
            }}
            className="text-sm text-gray-700 font-semibold hover:underline"
          >
            Reset Filters
          </button>
        </div>
      </header>

      {/* Table */}
      {loading ? (
        <div className="flex items-center justify-center h-64 text-gray-500">
          Loading requests…
        </div>
      ) : currentRequests.length === 0 ? (
        <div className="flex items-center justify-center h-64 text-gray-500">
          No requests found.
        </div>
      ) : (
        <>
          <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm bg-white">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Community
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    State
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer">
                    Created At
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    View
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {currentRequests.map((r) => (
                  <tr key={r.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 text-sm text-gray-800">
                      {r.title ?? 'Untitled'}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">{r.type}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {formatCommunity(r.community)}
                    </td>
                    <td>
                      <StateBadge state={r.state ?? 'Unknown'} />
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">
                      {r.created_at
                        ? new Date(r.created_at).toLocaleDateString()
                        : '—'}
                    </td>
                    <td className="px-4 py-3 text-sm font-semibold text-red-600">
                      <Link
                        href={`/protected/requests/request/${r.id}`}
                        className="hover:underline"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex justify-center items-center gap-2 mt-6">
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="px-3 py-1 text-sm font-semibold rounded-md border border-gray-300 hover:bg-gray-100 disabled:opacity-40"
            >
              ← Prev
            </button>

            {visiblePages.map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`px-3 py-1 text-sm font-semibold rounded-md border ${
                  p === page
                    ? 'bg-red-600 text-white border-red-600'
                    : 'border-gray-300 hover:bg-gray-100'
                }`}
              >
                {p}
              </button>
            ))}

            <button
              disabled={page === totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              className="px-3 py-1 text-sm font-semibold rounded-md border border-gray-300 hover:bg-gray-100 disabled:opacity-40"
            >
              Next →
            </button>
          </div>
        </>
      )}
    </main>
  );
}

// 🔹 State badge
function StateBadge({ state }: { state: string }) {
  const normalized = state.toLowerCase();
  let color = 'bg-gray-100 text-gray-700 border-gray-200';
  if (normalized === 'open')
    color = 'bg-green-50 text-green-700 border-green-200';
  else if (normalized === 'closed')
    color = 'bg-red-50 text-red-700 border-red-200';
  else if (normalized.includes('progress'))
    color = 'bg-amber-50 text-amber-700 border-amber-200';

  return (
    <span
      className={`inline-block px-2 py-1 text-xs font-semibold border rounded-full ${color}`}
    >
      {state}
    </span>
  );
}

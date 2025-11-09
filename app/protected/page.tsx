// 'use client';

// import { useCallback, useEffect, useRef, useState } from 'react';
// import Link from 'next/link';
// import { createClient } from '@/lib/supabase/client';

// type RequestRecord = {
//   id: string | number;
//   title?: string | null;
//   community?: string | null;
//   type?: string | null;
//   state?: string | null;
//   created_at?: string | Date | null;
// };

// type NormalizedRequest = {
//   id: string | number;
//   title: string;
//   neighbourhood: string;
//   type: string;
//   state: string;
//   createdAtDate: string;
//   createdAtTime: string;
// };

// export default function ProtectedPage() {
//   const [requests, setRequests] = useState<RequestRecord[]>([]);
//   const [loading, setLoading] = useState(true);

//   const fetchRequests = useCallback(async () => {
//     setLoading(true);
//     const supabase = createClient();
//     const { data, error } = await supabase
//       .from('requests')
//       .select('*')
//       .range(0, 7499);

//     if (error) {
//       console.error('Error fetching requests:', error);
//       setRequests([]);
//     } else {
//       setRequests((data ?? []) as RequestRecord[]);
//     }

//     setLoading(false);
//   }, []);

//   useEffect(() => {
//     fetchRequests();
//   }, [fetchRequests]);

//   // Normalization
//   const normalizedRequests: NormalizedRequest[] = requests.map((request) => {
//     const rawTimestamp =
//       typeof request.created_at === 'string'
//         ? request.created_at
//         : request.created_at instanceof Date
//         ? request.created_at.toISOString()
//         : null;
//     const isoTimestamp = rawTimestamp ? rawTimestamp.replace(' ', 'T') : null;
//     const createdAtDateTime = isoTimestamp ? new Date(isoTimestamp) : undefined;
//     const hasValidDate =
//       createdAtDateTime && !Number.isNaN(createdAtDateTime.getTime());
//     const createdAtDate = hasValidDate
//       ? createdAtDateTime.toLocaleDateString(undefined, {
//             month: 'short',
//             day: 'numeric',
//         })
//       : 'Unknown date';
//     const createdAtTime = hasValidDate
//       ? createdAtDateTime.toLocaleTimeString(undefined, {
//           hour: 'numeric',
//           minute: '2-digit',
//         })
//       : 'Unknown time';

//     return {
//       id: request.id,
//       title: request.title ?? 'Untitled request',
//       neighbourhood: request.community ?? 'Unknown area',
//       type: request.type ?? 'Unknown Type',
//       state: request.state ?? 'Unknown State',
//       createdAtDate,
//       createdAtTime,
//     };
//   });

//   return (
//     <div className="flex w-full flex-col gap-4">
//       {/* <div className="flex flex-wrap items-center gap-3"> */}
//         {/* <button
//           type="button"
//           onClick={handleSeedClick}
//           disabled={seedLoading}
//           className="inline-flex items-center justify-center rounded-full bg-red-600 px-5 py-2 text-sm font-semibold text-white shadow-sm transition-colors duration-200 hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-red-300"
//         >
//           {seedLoading ? 'Seeding requests…' : 'Generate fake requests'}
//         </button> */}
//         {/* {seedMessage ? (
//           <span
//             className={`text-sm ${
//               seedMessage.type === 'success' ? 'text-green-700' : 'text-red-600'
//             }`}
//           >
//             {seedMessage.text}
//           </span>
//         ) : null}
//       </div> */}
//       <section className="flex w-full flex-row items-start gap-6">
//       <div className="flex-1 rounded-xl bg-gray-100 p-4">
//         {loading ? (
//           <div className="flex h-[70vh] w-full items-center justify-center text-gray-500">
//             Loading map...
//           </div>
//         ) : (
//           <CommunityHeatmap requests={normalizedRequests} />
//         )}
//       </div>

//       <aside className="w-80 flex h-[74vh] flex-col overflow-hidden rounded-3xl border-2 border-red-300 bg-white/95">
//         <header className="border-b border-gray-100 px-5 py-4 text-center">
//           <p className="text-xs font-semibold uppercase tracking-[0.35em] text-gray-400">
//             Newest Requests
//           </p>
//           <h2 className="mt-1 text-lg font-semibold text-gray-900">
//             Activity Feed
//           </h2>
//         </header>

//         <div className="flex-1 space-y-4 overflow-y-auto px-5 py-4">
//           {normalizedRequests.length === 0 ? (
//             <div className="flex flex-col items-center gap-2 rounded-2xl border border-dashed border-gray-200 bg-white/80 p-6 text-center">
//               <span className="text-base font-semibold text-gray-700">
//                 No requests yet
//               </span>
//               <p className="text-sm text-gray-500">
//                 New activity will appear here as soon as it arrives.
//               </p>
//             </div>
//           ) : (
//             normalizedRequests.map((request) => (
//               <Link
//                 key={
//                   request.id ??
//                   `${request.createdAtDate}-${request.createdAtTime}-${request.title}`
//                 }
//                 href={`/protected/requests/request/${request.id}`}
//                 className="block group"
//               >
//                 <article className="flex h-full flex-col gap-4 rounded-2xl border border-gray-100 bg-white/90 p-4 shadow-sm ring-1 ring-black/5 transition-all duration-200 group-hover:-translate-y-1 group-hover:border-red-600/40 group-hover:shadow-md">
//                   <header className="flex items-start justify-between gap-3">
//                     <div className="space-y-1">
//                       <p className="text-[0.65rem] font-semibold uppercase tracking-[0.35em] text-red-600/80">
//                         {request.type}
//                       </p>
//                       <h3 className="text-base font-semibold text-gray-900 transition-colors duration-200 group-hover:text-red-600">
//                         {request.title}
//                       </h3>
//                       <p className="text-xs text-gray-500">
//                         {request.createdAtDate} • {request.createdAtTime}
//                       </p>
//                     </div>
//                     <StateBadge state={request.state} />
//                   </header>

//                   <div className="flex items-center gap-2 text-sm text-gray-600">
//                     <span className="h-2 w-2 rounded-full bg-red-600" />
//                     {request.neighbourhood}
//                   </div>

//                   <span className="inline-flex items-center justify-center rounded-full bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm transition-colors duration-200 group-hover:bg-red-700">
//                     View request
//                   </span>
//                 </article>
//               </Link>
//             ))
//           )}
//         </div>

//         <footer className="border-t mt-4 border-gray-100 bg-white px-5 py-4">
//           <Link
//             href="/protected/requests"
//             className="flex items-center justify-center rounded-full bg-red-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition-colors duration-200 hover:bg-red-700"
//           >
//             View all requests
//           </Link>
//         </footer>
//       </aside>
//     </section>
//     </div>
//   );
// }

// function StateBadge({ state }: { state: string }) {
//   const normalized = state?.toLowerCase();
//   let classes =
//     'border border-gray-200 bg-gray-100 text-gray-600 rounded-full px-3 py-1 text-xs font-semibold';
//   if (normalized === 'open')
//     classes =
//       'border border-green-200 bg-green-50 text-green-700 rounded-full px-3 py-1 text-xs font-semibold';
//   else if (normalized === 'closed')
//     classes =
//       'border border-red-600/30 bg-red-600/10 text-red-600 rounded-full px-3 py-1 text-xs font-semibold';
//   else if (normalized === 'in progress' || normalized === 'in-progress')
//     classes =
//       'border border-amber-200 bg-amber-50 text-amber-700 rounded-full px-3 py-1 text-xs font-semibold';

//   return <span className={classes}>{state}</span>;
// }


// function CommunityHeatmap({ requests }: { requests: NormalizedRequest[] }) {
//   const mapRef = useRef<LeafletMap | null>(null);
//   const geoJsonLayerRef = useRef<LeafletLayer | null>(null);

//   // helper to normalize names
//   function normalizeCommunityName(name?: string | null): string {
//     return (name ?? '')
//       .toLowerCase()
//       .trim()
//       .replace(/\s+/g, ' '); // collapse multiple spaces
//   }

//   useEffect(() => {
//     let isCancelled = false;

//     async function initialise() {
//       try {
//         const leaflet = await ensureLeafletAssets();
//         if (isCancelled) return;

//         // initialize map only once
//         if (!mapRef.current) {
//           mapRef.current = leaflet.map('heatmap', {
//             center: [51.0447, -114.0719],
//             zoom: 11,
//             scrollWheelZoom: false,
//           });

//           leaflet
//             .tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
//               maxZoom: 18,
//               attribution: '&copy; OpenStreetMap contributors',
//             })
//             .addTo(mapRef.current);
//         }

//         // 🔢 Aggregate request counts per normalized community
//         const counts: Record<string, number> = {};
//         requests.forEach((r) => {
//           const key = normalizeCommunityName(r.neighbourhood);
//           if (!key) return;
//           counts[key] = (counts[key] || 0) + 1;
//         });

//         // 🗂️ Fetch the community boundaries file
//         const response = await fetch('/Community_District_Boundaries_20251108.geojson');
//         const geojson = await response.json();
//         if (isCancelled || !mapRef.current) return;

//         // remove previous layers
//         if (geoJsonLayerRef.current?.remove) {
//           geoJsonLayerRef.current.remove();
//         }

//         // 🎨 color scale
//         const colorScale = (count: number) => {
//           if (count > 6) return '#b10026';
//           if (count > 5) return '#e31a1c';
//           if (count > 4) return '#fc4e2a';
//           if (count > 3) return '#fd8d3c';
//           if (count > 2) return '#feb24c';
//           if (count > 0) return '#fed976';
//           return '#f0f0f0';
//         };

//         // 🗺️ Add GeoJSON polygons with heat styling
//         const layer = leaflet.geoJSON(geojson, {
//           style: (feature?: CommunityFeature) => {
//             const rawName =
//               feature?.properties?.name ??
//               feature?.properties?.community_name ??
//               'Unknown';
//             const name = normalizeCommunityName(rawName);
//             const count = counts[name] || 0;
//             return {
//               fillColor: colorScale(count),
//               color: '#555',
//               weight: 1,
//               fillOpacity: 0.7,
//             };
//           },
//           onEachFeature: (feature: CommunityFeature, layerInstance: PopupLayer) => {
//             const rawName =
//               feature.properties?.name ??
//               feature.properties?.community_name ??
//               'Unknown';
//             const name = normalizeCommunityName(rawName);
//             const displayName = rawName
//               .toString()
//               .toLowerCase()
//               .replace(/\b\w/g, (l) => l.toUpperCase()); // re-capitalize for popup
//             const count = counts[name] || 0;
//             layerInstance.bindPopup(`<b>${displayName}</b><br>${count} requests`);
//           },
//         });

//         geoJsonLayerRef.current = layer.addTo(mapRef.current);
//       } catch (error) {
//         if (!isCancelled) {
//           console.error('Failed to initialise Leaflet heatmap', error);
//         }
//       }
//     }

//     initialise();

//     return () => {
//       isCancelled = true;
//     };
//   }, [requests]);

//   // clean up map/layers
//   useEffect(() => {
//     return () => {
//       if (geoJsonLayerRef.current?.remove) {
//         geoJsonLayerRef.current.remove();
//       }
//       if (mapRef.current?.remove) {
//         mapRef.current.remove();
//       }
//       geoJsonLayerRef.current = null;
//       mapRef.current = null;
//     };
//   }, []);

//   return <div id="heatmap" className="h-[70vh] w-full rounded-xl" />;
// }


// type LeafletMap = {
//   remove?: () => void;
// };

// type LeafletLayer = {
//   addTo: (map: LeafletMap) => LeafletLayer;
//   remove?: () => void;
// };

// type PopupLayer = LeafletLayer & {
//   bindPopup: (html: string) => void;
// };

// type LeafletModule = {
//   map: (id: string, options: Record<string, unknown>) => LeafletMap;
//   tileLayer: (url: string, options: Record<string, unknown>) => LeafletLayer;
//   geoJSON: (
//     data: unknown,
//     options: {
//       style?: (feature?: CommunityFeature) => Record<string, unknown>;
//       onEachFeature?: (feature: CommunityFeature, layer: PopupLayer) => void;
//     },
//   ) => LeafletLayer;
// };

// type CommunityFeature = {
//   properties?: {
//     community_name?: string | null;
//     name?: string | null;
//     [key: string]: unknown;
//   };
// };

// declare global {
//   interface Window {
//     L?: LeafletModule;
//   }
// }

// const LEAFLET_JS_SRC = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
// const LEAFLET_CSS_HREF = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';

// function ensureLeafletAssets(): Promise<LeafletModule> {
//   return new Promise((resolve, reject) => {
//     if (typeof window === 'undefined') {
//       reject(new Error('Leaflet requires a browser environment'));
//       return;
//     }

//     if (window.L) {
//       resolve(window.L);
//       return;
//     }

//     const existingScript = document.querySelector<HTMLScriptElement>(
//       `script[src="${LEAFLET_JS_SRC}"]`,
//     );
//     const existingLink = document.querySelector<HTMLLinkElement>(
//       `link[href="${LEAFLET_CSS_HREF}"]`,
//     );

//     if (!existingLink) {
//       const link = document.createElement('link');
//       link.rel = 'stylesheet';
//       link.href = LEAFLET_CSS_HREF;
//       link.setAttribute('data-leaflet', 'true');
//       document.head.appendChild(link);
//     }

//     if (existingScript) {
//       existingScript.addEventListener('load', () => {
//         if (window.L) {
//           resolve(window.L);
//         } else {
//           reject(new Error('Leaflet failed to initialise'));
//         }
//       });
//       return;
//     }

//     const script = document.createElement('script');
//     script.src = LEAFLET_JS_SRC;
//     script.async = true;
//     script.dataset.leaflet = 'true';
//     script.onload = () => {
//       if (window.L) {
//         resolve(window.L);
//       } else {
//         reject(new Error('Leaflet failed to load'));
//       }
//     };
//     script.onerror = () => reject(new Error('Unable to load Leaflet assets'));

//     document.body.appendChild(script);
//   });
// }



'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';

type RequestRecord = {
  id: string | number;
  title?: string | null;
  community?: string | null;
  type?: string | null;
  state?: string | null;
  created_at?: string | Date | null;
};

type NormalizedRequest = {
  id: string | number;
  title: string;
  neighbourhood: string;
  type: string;
  state: string;
  createdAtDate: string;
  createdAtTime: string;
  createdAtMs: number;
};

// 🧭 Main page
export default function ProtectedPage() {
  const [requests, setRequests] = useState<RequestRecord[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRequests = useCallback(async () => {
    setLoading(true);
    const supabase = createClient();
    const { data, error } = await supabase
      .from('requests')
      .select('*')
      .order('created_at', { ascending: false }) // ✅ Sort newest first
      .limit(1000); // You likely don’t need 7500 here


    if (error) {
      console.error('Error fetching requests:', error);
      setRequests([]);
    } else {
      setRequests((data ?? []) as RequestRecord[]);
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  // 🧹 Clean up titles like “Snow Piles Blocking Driveways in ALBERT PARK/RADISSON HEIGHTS”
  const cleanTitle = (title?: string | null) => {
    if (!title) return 'Untitled request';
    return title.replace(/\s+in\s+[A-Z0-9\s\/\-\(\)']+$/i, '').trim();
  };

  

  // 🧠 Normalize data
  const normalizedRequests: NormalizedRequest[] = requests.map((request) => {
    const rawTimestamp =
      typeof request.created_at === 'string'
        ? request.created_at
        : request.created_at instanceof Date
        ? request.created_at.toISOString()
        : null;
    const isoTimestamp = rawTimestamp ? rawTimestamp.replace(' ', 'T') : null;
    const createdAtDateTime = isoTimestamp ? new Date(isoTimestamp) : undefined;
    const hasValidDate =
      createdAtDateTime && !Number.isNaN(createdAtDateTime.getTime());
    const createdAtDate = hasValidDate
      ? createdAtDateTime.toLocaleDateString(undefined, {
          month: 'short',
          day: 'numeric',
        })
      : 'Unknown date';
    const createdAtTime = hasValidDate
      ? createdAtDateTime.toLocaleTimeString(undefined, {
          hour: 'numeric',
          minute: '2-digit',
        })
      : 'Unknown time';

    const neighbourhood = request.community ?? 'Unknown area';
    const formattedNeighbourhood =
      neighbourhood && /^[A-Z0-9\s\/]+$/.test(neighbourhood)
        ? neighbourhood
            .toLowerCase()
            .replace(/\b\w/g, (l) => l.toUpperCase())
            .trim()
        : neighbourhood;
    return {
      id: request.id,
      title: cleanTitle(request.title ?? 'Untitled request'),
      neighbourhood: formattedNeighbourhood,
      type: request.type ?? 'Unknown Type',
      state: request.state ?? 'Unknown State',
      createdAtDate,
      createdAtTime,
      createdAtMs: hasValidDate ? createdAtDateTime!.getTime() : 0,
    };
  });

  const sortedRequests = useMemo<NormalizedRequest[]>(() => {
    return [...normalizedRequests].sort((a, b) => {
      return b.createdAtMs - a.createdAtMs;
    });
  }, [normalizedRequests]);

  

  return (
    <div className="flex w-full flex-col gap-4">
      <section className="flex w-full flex-row items-start gap-6">
        <div className="flex-1 rounded-xl bg-gray-100 p-4">
          {loading ? (
            <div className="flex h-[70vh] w-full items-center justify-center text-gray-500">
              Loading map...
            </div>
          ) : (
            <CommunityHeatmap requests={normalizedRequests} />
          )}
        </div>

        <aside className="w-80 flex h-[74vh] flex-col overflow-hidden rounded-3xl border-2 border-red-300 bg-white/95">
          <header className="border-b border-gray-100 px-5 py-4 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-gray-400">
              Newest Requests
            </p>
            <h2 className="mt-1 text-lg font-semibold text-gray-900">
              Activity Feed
            </h2>
          </header>

          <div className="flex-1 space-y-4 overflow-y-auto px-5 py-4">
            {normalizedRequests.length === 0 ? (
              <div className="flex flex-col items-center gap-2 rounded-2xl border border-dashed border-gray-200 bg-white/80 p-6 text-center">
                <span className="text-base font-semibold text-gray-700">
                  No requests yet
                </span>
                <p className="text-sm text-gray-500">
                  New activity will appear here as soon as it arrives.
                </p>
              </div>
            ) : (
              sortedRequests.slice(0, 10).map((request) => (
                <Link
                  key={
                    request.id ??
                    `${request.createdAtDate}-${request.createdAtTime}-${request.title}`
                  }
                  href={`/protected/requests/request/${request.id}`}
                  className="block group"
                >
                  <article className="flex h-full flex-col gap-4 rounded-2xl border border-gray-100 bg-white/90 p-4 shadow-sm ring-1 ring-black/5 transition-all duration-200 group-hover:-translate-y-1 group-hover:border-red-600/40 group-hover:shadow-md">
                    <header className="flex items-start justify-between gap-3">
                      <div className="space-y-1">
                        <p className="text-[0.65rem] font-semibold uppercase tracking-[0.35em] text-red-600/80">
                          {request.type}
                        </p>
                        <h3 className="text-base font-semibold text-gray-900 transition-colors duration-200 group-hover:text-red-600">
                          {request.title}
                        </h3>
                        <p className="text-xs text-gray-500">
                          {request.createdAtDate} • {request.createdAtTime}
                        </p>
                      </div>
                      <StateBadge state={request.state} />
                    </header>

                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <span className="h-2 w-2 rounded-full bg-red-600" />
                      {request.neighbourhood}
                    </div>

                    <span className="inline-flex items-center justify-center rounded-full bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm transition-colors duration-200 group-hover:bg-red-700">
                      View request
                    </span>
                  </article>
                </Link>
              ))
            )}
          </div>

          <footer className="border-t mt-4 border-gray-100 bg-white px-5 py-4">
            <Link
              href="/protected/requests"
              className="flex items-center justify-center rounded-full bg-red-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition-colors duration-200 hover:bg-red-700"
            >
              View all requests
            </Link>
          </footer>
        </aside>
      </section>
    </div>
  );
}

function StateBadge({ state }: { state: string }) {
  const normalized = state?.toLowerCase();
  let classes =
    'border border-gray-200 bg-gray-100 text-gray-600 rounded-full px-3 py-1 text-xs font-semibold';
  if (normalized === 'open')
    classes =
      'border border-green-200 bg-green-50 text-green-700 rounded-full px-3 py-1 text-xs font-semibold';
  else if (normalized === 'closed')
    classes =
      'border border-red-600/30 bg-red-600/10 text-red-600 rounded-full px-3 py-1 text-xs font-semibold';
  else if (normalized === 'in progress' || normalized === 'in-progress')
    classes =
      'border border-amber-200 bg-amber-50 text-amber-700 rounded-full px-3 py-1 text-xs font-semibold';

  return <span className={classes}>{state}</span>;
}

function CommunityHeatmap({ requests }: { requests: NormalizedRequest[] }) {
  const mapRef = useRef<LeafletMap | null>(null);
  const geoJsonLayerRef = useRef<LeafletLayer | null>(null);

  const normalizeCommunityName = (name?: string | null): string =>
    (name ?? '').toLowerCase().trim().replace(/\s+/g, ' ');

  useEffect(() => {
    let isCancelled = false;

    async function initialise() {
      try {
        const leaflet = await ensureLeafletAssets();
        if (isCancelled) return;

        if (!mapRef.current) {
          mapRef.current = leaflet.map('heatmap', {
            center: [51.0447, -114.0719],
            zoom: 11,
            scrollWheelZoom: false,
          });

          leaflet
            .tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
              maxZoom: 18,
              attribution: '&copy; OpenStreetMap contributors',
            })
            .addTo(mapRef.current);
        }

        const counts: Record<string, number> = {};
        requests.forEach((r) => {
          const key = normalizeCommunityName(r.neighbourhood);
          if (!key) return;
          counts[key] = (counts[key] || 0) + 1;
        });

        const response = await fetch('/Community_District_Boundaries_20251108.geojson');
        const geojson = await response.json();
        if (isCancelled || !mapRef.current) return;

        if (geoJsonLayerRef.current?.remove) geoJsonLayerRef.current.remove();

        const colorScale = (count: number) => {
          if (count > 6) return '#b10026';
          if (count > 5) return '#e31a1c';
          if (count > 4) return '#fc4e2a';
          if (count > 3) return '#fd8d3c';
          if (count > 2) return '#feb24c';
          if (count > 0) return '#fed976';
          return '#f0f0f0';
        };

        const layer = leaflet.geoJSON(geojson, {
          style: (feature?: CommunityFeature) => {
            const rawName =
              feature?.properties?.name ??
              feature?.properties?.community_name ??
              'Unknown';
            const name = normalizeCommunityName(rawName);
            const count = counts[name] || 0;
            return {
              fillColor: colorScale(count),
              color: '#555',
              weight: 1,
              fillOpacity: 0.7,
            };
          },
          onEachFeature: (feature: CommunityFeature, layerInstance: PopupLayer) => {
            const rawName =
              feature.properties?.name ??
              feature.properties?.community_name ??
              'Unknown';
            const name = normalizeCommunityName(rawName);
            const displayName = rawName
              .toString()
              .toLowerCase()
              .replace(/\b\w/g, (l) => l.toUpperCase());
            const count = counts[name] || 0;
            layerInstance.bindPopup(`<b>${displayName}</b><br>${count} requests`);
          },
        });

        geoJsonLayerRef.current = layer.addTo(mapRef.current);
      } catch (error) {
        if (!isCancelled)
          console.error('Failed to initialise Leaflet heatmap', error);
      }
    }

    initialise();

    return () => {
      isCancelled = true;
    };
  }, [requests]);

  useEffect(() => {
    return () => {
      if (geoJsonLayerRef.current?.remove) geoJsonLayerRef.current.remove();
      if (mapRef.current?.remove) mapRef.current.remove();
      geoJsonLayerRef.current = null;
      mapRef.current = null;
    };
  }, []);

  return <div id="heatmap" className="h-[70vh] w-full rounded-xl" />;
}

type LeafletMap = { remove?: () => void };
type LeafletLayer = { addTo: (map: LeafletMap) => LeafletLayer; remove?: () => void };
type PopupLayer = LeafletLayer & { bindPopup: (html: string) => void };
type LeafletModule = {
  map: (id: string, options: Record<string, unknown>) => LeafletMap;
  tileLayer: (url: string, options: Record<string, unknown>) => LeafletLayer;
  geoJSON: (
    data: unknown,
    options: {
      style?: (feature?: CommunityFeature) => Record<string, unknown>;
      onEachFeature?: (feature: CommunityFeature, layer: PopupLayer) => void;
    },
  ) => LeafletLayer;
};
type CommunityFeature = {
  properties?: { community_name?: string | null; name?: string | null; [key: string]: unknown };
};

declare global {
  interface Window {
    L?: LeafletModule;
  }
}

const LEAFLET_JS_SRC = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
const LEAFLET_CSS_HREF = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';

function ensureLeafletAssets(): Promise<LeafletModule> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined') {
      reject(new Error('Leaflet requires a browser environment'));
      return;
    }

    if (window.L) {
      resolve(window.L);
      return;
    }

    const scriptExists = document.querySelector(`script[src="${LEAFLET_JS_SRC}"]`);
    const cssExists = document.querySelector(`link[href="${LEAFLET_CSS_HREF}"]`);

    if (!cssExists) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = LEAFLET_CSS_HREF;
      document.head.appendChild(link);
    }

    if (scriptExists) {
      scriptExists.addEventListener('load', () =>
        window.L ? resolve(window.L) : reject(new Error('Leaflet failed to load'))
      );
      return;
    }

    const script = document.createElement('script');
    script.src = LEAFLET_JS_SRC;
    script.async = true;
    script.onload = () =>
      window.L ? resolve(window.L) : reject(new Error('Leaflet failed to load'));
    script.onerror = () => reject(new Error('Unable to load Leaflet'));
    document.body.appendChild(script);
  });
}

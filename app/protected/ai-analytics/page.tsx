"use client";

"use client";

import { useLayoutEffect, useRef, useState, useEffect } from "react";
import Link from "next/link";
import ChatBubble from "../chat/ChatBubble";
import { createClient } from "@/lib/supabase/client";

type Msg = { role: "user" | "assistant" | "system"; content: string };

const SYSTEM_PROMPT = `
You are the UrbanSignal Strategic Analytics Engine. Your primary function is to analyze community service request data and provide actionable, data-driven insights that align with the city's core strategic pillars. Your outputs must be strategic, concise, and tailored for internal staff use in planning and resource allocation.

Core Directive:
Always frame your analysis and recommendations through the lens of:

- Safety and Resilience: Enhancing public safety, infrastructure integrity, and community preparedness.
- Urban Sustainability: Promoting waste reduction, emissions monitoring, and sustainable resource management.
- Inclusive Urban Design: Identifying and addressing barriers to accessibility, equity, and service delivery for all residents.

When analyzing data, identify dominant trends, categorize strategically, and provide impact analyses using professional, clear, data-driven language.
`;

// Helper: Fetch full analytics summary from Supabase
async function getAnalyticsSummary() {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("requests")
    .select("community, type, state");

  if (error || !data) {
    console.error("Error fetching analytics data:", error);
    return "No analytics data could be retrieved at this time.";
  }

  // Filter valid communities
  const valid = data.filter((r) => {
    const c = (r.community ?? "").trim();
    return (
      c &&
      !/^[A-Z0-9]{1,3}$/.test(c) && // skip codes like 05D
      c.toLowerCase() !== "unknown"
    );
  });

  // Count open requests by community and type
  const communityCounts: Record<string, number> = {};
  const typeCounts: Record<string, number> = {};

  for (const row of valid) {
    const community = row.community?.trim() ?? "Unknown";
    const type = row.type?.trim() ?? "Unspecified";
    const state = row.state?.toLowerCase();

    if (state !== "closed") {
      const pretty = community
        .toLowerCase()
        .replace(/\b\w/g, (l: string) => l.toUpperCase());
      communityCounts[pretty] = (communityCounts[pretty] ?? 0) + 1;
      typeCounts[type] = (typeCounts[type] ?? 0) + 1;
    }
  }

  const communityList = Object.entries(communityCounts)
    .sort((a, b) => b[1] - a[1])
    .map(([name, count]) => `- ${name}: ${count}`)
    .join("\n");

  const typeList = Object.entries(typeCounts)
    .sort((a, b) => b[1] - a[1])
    .map(([t, c]) => `- ${t}: ${c}`)
    .join("\n");

  return `
urbanSignal Analytics Summary:
🧭 **Open Requests by Community**
${communityList || "None currently open."}

🧰 **Request Types**
${typeList || "No categorized request types found."}
  `.trim();
}

export default function AiAnalyticsPage() {
  const [messages, setMessages] = useState<Msg[]>([
    {
      role: "assistant",
      content:
        "👋 Hi there! I’m your UrbanSignal analytics assistant. Ask me about request trends, community hotspots, or emerging service patterns.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [topCommunities, setTopCommunities] = useState<
    { name: string; count: number }[]
  >([]);
  const [analyticsSummary, setAnalyticsSummary] = useState<string>("");

  const chatContainerRef = useRef<HTMLDivElement | null>(null);

  // Scroll to the latest message after updates
  useLayoutEffect(() => {
    const container = chatContainerRef.current;
    if (container) {
      requestAnimationFrame(() => {
        container.scrollTo({
          top: container.scrollHeight,
          behavior: "smooth",
        });
      });
    }
  }, [messages, loading]);

  // Load sidebar data and supporting analytics context
  useEffect(() => {
    async function loadData() {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("requests")
        .select("community, state");

      if (error) {
        console.error("Failed to fetch requests:", error);
        return;
      }

      const counts: Record<string, number> = {};
      data?.forEach((r) => {
        const community = (r.community ?? "").trim();
        const state = r.state?.toLowerCase();
        if (
          !community ||
          /^[A-Z0-9]{1,3}$/.test(community) ||
          community.toLowerCase() === "unknown"
        )
          return;
        if (state !== "closed") {
          const pretty = community
            .toLowerCase()
            .replace(/\b\w/g, (letter: string) => letter.toUpperCase());
          counts[pretty] = (counts[pretty] ?? 0) + 1;
        }
      });

      const sorted = Object.entries(counts)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 6);

      setTopCommunities(sorted);

      // Fetch full analytics for AI
      const summary = await getAnalyticsSummary();
      setAnalyticsSummary(summary);
    }

    loadData();
  }, []);

  // Send message and include analytics context
  async function sendMessage(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg: Msg = { role: "user", content: input.trim() };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setLoading(true);
    setError(null);

    try {
    const payload = {
        system: SYSTEM_PROMPT,
        temperature: 0.4,
        messages: [
          ...messages,
          userMsg,
          {
            role: "system",
            content:
              "Current 311 dataset context:\n" +
              (analyticsSummary || "No analytics data available."),
          },
        ],
      };

      const resp = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!resp.ok) {
        const text = await resp.text();
        throw new Error(text || "API error");
      }

      const data = (await resp.json()) as { reply: string };
      const assistantMsg: Msg = { role: "assistant", content: data.reply };
      setMessages((m) => [...m, assistantMsg]);
    } catch (err) {
      console.error(err);
      setError(
        err instanceof Error ? err.message : "An unexpected error occurred."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col lg:flex-row gap-8 px-6 py-1">
      {/* ===== LEFT: CHAT ===== */}
      <section className="flex-1 flex flex-col h-[85vh]">
        {/* Header */}
        <header className="flex items-start justify-between pb-1 border-b border-gray-100 flex-shrink-0">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-red-600 to-red-400 bg-clip-text text-transparent tracking-tight">
              UrbanSignal Analytics Assistant
            </h1>
            <p className="mt-1 text-gray-600 text-sm max-w-md leading-relaxed">
              Ask how requests, communities, and service trends affect our strategic pillars.
            </p>
          </div>
          <Link
            href="/protected"
            className="rounded-full bg-gray-100 border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 transition"
          >
            ← Back Home
          </Link>
        </header>

        {/* Chat Scrollable Section */}
        <div
          ref={chatContainerRef}
          className="flex-1 overflow-y-auto mt-3 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm scroll-smooth space-y-3 custom-scrollbar"
        >
          {messages.map((m, i) => (
            <ChatBubble key={i} role={m.role} content={m.content} />
          ))}
          {loading && (
            <div className="mt-3 flex items-center gap-2 text-sm text-gray-500">
              <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-gray-400" />
              Thinking…
            </div>
          )}
          {error && (
            <div className="mt-3 rounded-md bg-red-50 p-2 text-sm text-red-700 border border-red-200">
              {error}
            </div>
          )}
        </div>

        {/* Input */}
        <form
          onSubmit={sendMessage}
          className="mt-3 flex items-center gap-2 border border-gray-200 rounded-2xl bg-white p-3 shadow-sm hover:shadow-md transition flex-shrink-0"
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about community insights, request volumes, or problem areas..."
            className="flex-1 rounded-lg px-4 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-red-500"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="rounded-lg bg-red-600 px-5 py-2 font-semibold text-white hover:bg-red-700 active:scale-[0.97] transition disabled:opacity-50"
          >
            Send
          </button>
        </form>
      </section>

      <aside className="w-full lg:w-80 flex-shrink-0 rounded-2xl border border-gray-200 bg-white shadow-sm flex flex-col h-[85vh]">
        <header className="border-b border-gray-100 px-5 py-5 text-center flex-shrink-0">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gray-400">
            Hotspots
          </p>
          <h2 className="mt-1 text-lg font-semibold text-gray-900">
            Top Unresolved Communities
          </h2>
        </header>

        <div className="flex-1 p-5 space-y-3 overflow-y-auto custom-scrollbar">
          {topCommunities.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-6">
              No unresolved requests currently.
            </p>
          ) : (
            topCommunities.map((c, i) => (
              <div
                key={c.name}
                className="flex items-center justify-between rounded-xl bg-gray-50 border border-gray-100 p-3 hover:bg-gray-100 transition-all"
              >
                <div>
                  <p className="font-medium text-gray-800 leading-tight">
                    {i + 1}. {c.name}
                  </p>
                  <p className="text-xs text-gray-500">Unresolved requests</p>
                </div>
                <span className="rounded-full bg-red-600 text-white text-sm font-semibold px-3 py-1 shadow-sm">
                  {c.count}
                </span>
              </div>
            ))
          )}
        </div>

        <footer className="border-t border-gray-100 bg-gray-50 px-5 py-4 text-center flex-shrink-0">
          <Link
            href="/protected/requests"
            className="inline-flex items-center justify-center rounded-full bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-700 active:scale-[0.97] transition"
          >
            View All Requests
          </Link>
        </footer>
      </aside>
    </main>
  );
}

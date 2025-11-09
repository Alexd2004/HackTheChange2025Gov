import { createClient } from "@/lib/supabase/client";

export async function getAnalyticsSummary() {
  const supabase = createClient();

  // 1️⃣ Fetch all requests
  const { data: requests, error } = await supabase
    .from("requests")
    .select("id, community, type, state, created_at");

  if (error || !requests) {
    console.error("❌ Error fetching requests:", error);
    return "No analytics data available.";
  }

  // 2️⃣ Compute simple aggregates
  const total = requests.length;
  const open = requests.filter((r) => r.state?.toLowerCase() === "open").length;
  const closed = requests.filter((r) => r.state?.toLowerCase() === "closed").length;

  // Group by community
  const byCommunity: Record<string, number> = {};
  for (const r of requests) {
    const c = r.community || "Unknown";
    byCommunity[c] = (byCommunity[c] ?? 0) + 1;
  }

  // Group by type
  const byType: Record<string, number> = {};
  for (const r of requests) {
    const t = r.type || "Other";
    byType[t] = (byType[t] ?? 0) + 1;
  }

  const topCommunities = Object.entries(byCommunity)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([name, count]) => `${name}: ${count}`)
    .join(", ");

  const topTypes = Object.entries(byType)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([name, count]) => `${name}: ${count}`)
    .join(", ");

  // 3️⃣ Construct summary text
  return `
📊 Current 311 Analytics Summary:
- Total requests: ${total}
- Open: ${open}, Closed: ${closed}
- Top Communities: ${topCommunities}
- Top Request Types: ${topTypes}
  `;
}

import { createClient } from "@/lib/supabase/server"



// Function to fetch the userID, from the supabase tables
export async function RetrieveUserId(){
    const supabase = await createClient();

    const {
        data: { user },
      } = await supabase.auth.getUser();

      
      return(user?.id)
      
}


export async function RetrieveRecentRequests(){
  const supabase = await createClient();

  const {data, error} = await supabase 
    .from('requests')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(5)

  if(error){
    console.log('Error retreiving most recent requests')
    console.error(error)
    return []
  }

  return data


}


// export async function RetrieveRequestById(id: string) {
//   const supabase = await createClient();

//   const { data, error } = await supabase
//     .from("requests")
//     .select("*")
//     .eq("id", id)
//     .single();

//   if (error) {
//     console.log(`Error retrieving request with id ${id}`);
//     console.error(error);
//     return null;
//   }

//   return data;
// }



// export async function UpdateRequestState(id: string, newState: string) {
//   const supabase = await createClient();
//   console.log(id)

//   const { error } = await supabase
//     .from("requests")
//     .update({ state: newState })
//     .eq("id", id);

//   if (error) {
//     console.error(`Failed to update request ${id} → ${newState}:`, error);
//     return { success: false, error };
//   }

//   return { success: true };
// }
export async function getAnalyticsSummary(): Promise<string> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("requests")
    .select("community, type, state");

  if (error || !data) {
    console.error("Error fetching analytics data:", error);
    return "No analytics data could be retrieved at this time.";
  }

  // Filter valid communities (skip coded ones)
  const valid = data.filter((r) => {
    const c = (r.community ?? "").trim();
    return (
      c &&
      !/^[A-Z0-9]{1,3}$/.test(c) && // filters short codes like 05D, B0, etc.
      c.toLowerCase() !== "unknown"
    );
  });

  // Count open requests by community
  const communityCounts: Record<string, number> = {};
  const typeCounts: Record<string, number> = {};

  for (const row of valid) {
    const community = row.community?.trim() ?? "Unknown";
    const type = row.type?.trim() ?? "Unspecified";
    const state = row.state?.toLowerCase();

    if (state !== "closed") {
      const prettyCommunity = community
        .toLowerCase()
        .replace(/\b\w/g, (letter: string) => letter.toUpperCase());
      communityCounts[prettyCommunity] =
        (communityCounts[prettyCommunity] ?? 0) + 1;

      typeCounts[type] = (typeCounts[type] ?? 0) + 1;
    }
  }

  // Top 5 communities
  const topCommunities = Object.entries(communityCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([name, count]) => `- ${name}: ${count} open requests`)
    .join("\n");

  // Top 5 request types
  const topTypes = Object.entries(typeCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([type, count]) => `- ${type}: ${count}`)
    .join("\n");

  // Construct AI-readable analytics summary
  return `
City 311 Analytics Snapshot (latest data):

🧭 **Top Communities by Open Requests**
${topCommunities || "No unresolved requests currently recorded."}

🧰 **Top Request Types**
${topTypes || "No open requests by type recorded."}

These figures reflect unresolved community issues as of the latest sync.
  `.trim();
}

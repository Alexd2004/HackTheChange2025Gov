import { createClient } from "./client";

export async function RetrieveRequestById(id: string) {
  console.log(`📡 RetrieveRequestById(): Getting request ${id}`);
  const supabase = createClient();

  const { data, error } = await supabase
    .from("requests")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("❌ Supabase fetch error:", error);
    return null;
  }

  console.log("✅ Request retrieved successfully:", data);
  return data;
}

export async function UpdateRequestState(id: string, newState: string) {
  console.log(`✏️ UpdateRequestState(): Updating ${id} → ${newState}`);
  const supabase = createClient();

  const { error, status } = await supabase
    .from("requests")
    .update({ state: newState })
    .eq("id", id);

  console.log("🧾 Supabase update response status:", status);

  if (error) {
    console.error(`❌ Failed to update ${id}:`, error);
    return { success: false, error };
  }

  console.log(`✅ Successfully updated request ${id} → ${newState}`);
  return { success: true };
}


export async function CreateNotification(
    user_id: string,
    request_id: string,
    type: string,
    message: string
  ) {
    const supabase = createClient();


    console.log('userId', user_id)
    console.log('request id', request_id)
  
    const { error } = await supabase.from("notifications").insert([
      {
        user_id,
        request_id,
        type,
        message,
        is_read: false,
      },
    ]);
  
    if (error) {
      console.error("❌ Failed to create notification:", error);
      return { success: false, error };
    }
  
    console.log("✅ Notification created successfully.");
    return { success: true };
  }
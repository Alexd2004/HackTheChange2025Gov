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


export async function RetrieveRequestById(id: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("requests")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.log(`Error retrieving request with id ${id}`);
    console.error(error);
    return null;
  }

  return data;
}
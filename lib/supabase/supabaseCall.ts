import { createClient } from "@/lib/supabase/client"



// Function to fetch the userID, from the supabase tables
export async function RetrieveUserId(){
    const supabase = createClient();

    const {
        data: { user },
      } = await supabase.auth.getUser();

      
      return(user?.id)
      
}

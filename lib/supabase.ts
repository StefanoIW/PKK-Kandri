import { createClient } from "@supabase/supabase-js"

export const createServerSupabaseClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://ydqmhzcjcsrvxapaglfc.supabase.co"
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ""

  return createClient(supabaseUrl, supabaseKey)
}

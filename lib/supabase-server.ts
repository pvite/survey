import { createClient } from "@supabase/supabase-js"

const url = process.env.SUPABASE_URL!
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

// Server-side client: uses service role (do not expose to browser).
export const supabaseServer = createClient(url, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
})

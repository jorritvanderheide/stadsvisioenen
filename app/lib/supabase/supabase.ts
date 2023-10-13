// Supabase client initialization
// https://supabase.io/docs/guides/with-nextjs

import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_PROJECT_URL as string,
  process.env.NEXT_PUBLIC_SUPABASE_PROJECT_API_KEY as string
);

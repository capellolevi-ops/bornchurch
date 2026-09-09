import { createLovableClient } from "@lovable.dev/cloud-auth-js";

import { supabase } from "@/integrations/supabase/client";

/** Cliente do Lovable Cloud usado para o login social (Google). */
export const lovable = createLovableClient(
  import.meta.env["VITE_SUPABASE_URL"] as string,
  import.meta.env["VITE_SUPABASE_PUBLISHABLE_KEY"] as string,
  { supabaseClient: supabase },
);

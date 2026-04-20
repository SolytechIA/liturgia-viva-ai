// Edge function: lista usuários com email (auth.users) + dados do profile
// Apenas para admins (verificado via is_admin function)
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "No auth header" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SERVICE_ROLE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const ANON_KEY = Deno.env.get("SUPABASE_PUBLISHABLE_KEY") ?? Deno.env.get("SUPABASE_ANON_KEY")!;

    // Client with caller's JWT (to identify the caller)
    const userClient = createClient(SUPABASE_URL, ANON_KEY, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: userData, error: userError } = await userClient.auth.getUser();
    if (userError || !userData.user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Admin client (service role)
    const admin = createClient(SUPABASE_URL, SERVICE_ROLE);

    // Verify caller is admin
    const { data: isAdminData, error: isAdminErr } = await admin.rpc("is_admin", {
      _user_id: userData.user.id,
    });
    if (isAdminErr || !isAdminData) {
      return new Response(JSON.stringify({ error: "Forbidden" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Fetch all profiles
    const { data: profiles, error: profErr } = await admin
      .from("profiles")
      .select("*")
      .order("data_cadastro", { ascending: false });
    if (profErr) throw profErr;

    // Fetch auth users (paginated; first page up to 1000)
    const emailMap = new Map<string, string>();
    let page = 1;
    const perPage = 1000;
    while (true) {
      const { data: authPage, error: authErr } = await admin.auth.admin.listUsers({
        page,
        perPage,
      });
      if (authErr) throw authErr;
      authPage.users.forEach((u) => {
        if (u.email) emailMap.set(u.id, u.email);
      });
      if (authPage.users.length < perPage) break;
      page++;
      if (page > 50) break; // hard safety
    }

    const users = (profiles ?? []).map((p: any) => ({
      ...p,
      email: emailMap.get(p.id) ?? null,
    }));

    return new Response(JSON.stringify({ users }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("admin-list-users error:", e);
    return new Response(JSON.stringify({ error: String(e?.message ?? e) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ locals: { supabase, safeGetSession }}) => {
    let { session } = await safeGetSession();
    if (!session) throw redirect(302, '/');

    let { data: user, error } = await supabase.from("profiles").select("isAdmin").eq("id", session.user.id).single();
    if (error || !user?.isAdmin) throw redirect(302, '/');
};
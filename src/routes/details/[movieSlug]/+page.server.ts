import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, url, locals: { supabase, safeGetSession } }) => {
    const { session } = await safeGetSession();
    const { data:save} = await supabase
        .from('favorites')
        .select('user_id, movie_id')
        .eq('user_id', session?.user.id)
        .eq('movie_id', params.movieSlug)
        .single();
    return { url: url.origin, save };
};
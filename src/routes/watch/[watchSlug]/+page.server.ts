import type { PageServerLoad } from "../$types";

export const load: PageServerLoad = async ({ params, locals: { supabase } }) => {
    const { data: comment, error } = await supabase
        .from('comments')
        .select('id, user_id, movie_id, comment, created_at, profiles(full_name, avatar_url)')
        .eq('movie_id', params.watchSlug)

    if (error) {
        console.error('Lỗi khi lấy bình luận:', error.message);
    }

    return { 
        comment,
        slug: params.watchSlug 
    };
};
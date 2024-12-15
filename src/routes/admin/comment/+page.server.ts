import { invalidateAll } from "$app/navigation";
import type { Actions, PageServerLoad } from "./$types";
import { redirect } from "@sveltejs/kit";

export const load: PageServerLoad = async ({ locals: { supabase, safeGetSession } }) => {
    const { session } = await safeGetSession();
    if (!session) {
        throw redirect(302, '/');
    }

    const { data: profile, error } = await supabase
        .from('profiles')
        .select('isAdmin')
        .eq('id', session.user.id)
        .single()
    
    if (error || !profile?.isAdmin) {
        throw redirect(302, '/');
    }

    const { data: comments, error: commentError } = await supabase
        .from('comments')
        .select('id, user_id, movie_id, comment, ...profiles(username, full_name)')

    if (commentError) {
        console.error('Failed to fetch comments:', commentError);
        throw new Error('Failed to fetch comments');
    }

    return { comments };
};

export const actions: Actions = {
    deleteComment: async ({ request, locals: { supabase } }) => {
        const formData = await request.formData();
        const commentId = formData.get('commentId');

        if (!commentId) {
            return { success: false, message: 'Missing comment ID' }
        }

        const { error } = await supabase
            .from('comments')
            .delete()
            .eq('id', commentId);

        if (error) {
            console.error('Failed to delete comment: ', error);
            return { success: false, message: 'Failed to delete comment' };
        }

        invalidateAll();
        return { success: true };
    }
}
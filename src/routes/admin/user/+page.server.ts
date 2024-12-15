import { redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals: { supabase, safeGetSession } }) => {
	let session = await safeGetSession();
	if (!session) throw redirect(302, '/');

	let { data: user, error } = await supabase
		.from('profiles')
		.select('isAdmin')
		.eq('id', session.user.id)
		.single();
	if (error || !user?.isAdmin) throw redirect(302, '/');

	let { data: profiles, error: dberr } = await supabase
		.from('profiles')
		.select('id, full_name, username, avatar_url, isAdmin, isBanned')
		.order('isAdmin', { ascending: false })
		.order('full_name', { ascending: true });

	if (dberr || !profiles) throw redirect(302, '/');

	return { profiles };
};

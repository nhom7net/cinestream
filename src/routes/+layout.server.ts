// src/routes/+layout.server.ts
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals: { supabase, safeGetSession }, cookies }) => {
	const { session, user } = await safeGetSession();

	const { data } = await supabase
		.from('profiles')
		.select('avatar_url')
		.eq('id', session?.user.id)
		.single();

	return {
		session,
		user,
		avatar: data?.avatar_url || '',
		cookies: cookies.getAll()
	};
};

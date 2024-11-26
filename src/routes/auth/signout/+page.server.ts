import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals: { supabase, safeGetSession } }) => {
	let session = await safeGetSession();

	if (!session) {
		redirect(303, '/');
	}

	return {
		session
	};
};

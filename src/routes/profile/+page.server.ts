import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import type { AuthError } from '@supabase/supabase-js';

export const load: PageServerLoad = async ({ locals: { supabase, safeGetSession } }) => {
	const { session } = await safeGetSession();

	if (!session) {
		redirect(303, '/');
	}

	const { data: profile } = await supabase
		.from('profiles')
		.select(`username, full_name, avatar_url`)
		.eq('id', session.user.id)
		.single();

	return { session, profile };
};

export const actions: Actions = {
	profile: async ({ request, locals: { supabase, safeGetSession } }) => {
		console.info('[profile:profile] form submitted');
		const formData = await request.formData();
		const { session } = await safeGetSession();
		const full_name = formData.get('fullName') as string;
		const username = formData.get('username') as string;
		const avatar_url = formData.get('avatarUrl') as string;

		const { error } = await supabase.from('profiles').upsert({
			id: session?.user.id,
			full_name,
			username,
			avatar_url,
			updated_at: new Date()
		});

		if (error) {
			console.log(`[profile:profile] failure: ${error.message}`);
			return fail(500, {
				success: false,
				full_name,
				username,
				avatar_url,
				message: 'Có lổi xảy ra, vui lòng thử lại sau!'
			});
		}

		console.info('[profile:profile] OK!');
		return {
			sucesss: true,
			full_name,
			username,
			avatar_url
		};
	},

	account: async ({ request, locals: { supabase } }) => {
		console.info('[profile:account] form submitted');
		const formData = await request.formData();

		let email = formData.get('email') as string;
		let password = formData.get('password') as string;
		let confirm_password = formData.get('confirm-password') as string;
		let old_password = formData.get('old-password') as string;

		// verify old password first
		const response = await supabase.rpc('verify_user_password', {
			password: old_password
		});

		if (!response.data) {
			console.error('[profile:account] credential failure. User password might be incorrect.');
			return fail(400, {
				success: false,
				email,
				message: 'Không thể thay đổi thông tin, sai mật khẩu cũ!'
			});
		}

		if (old_password === password) {
			console.error('[profile:account] password is unchanged. Stop.');
			return fail(400, {
				success: false,
				email,
				message: 'Mật khẩu cũ trùng với mật khẩu mới. Không cần thay đổi.'
			});
		}

		if (confirm_password !== password) {
			console.error('[profile:account] password unmatched. Stop.');
			return fail(400, {
                success: false,
                email,
                message: 'Mật khẩu xác nhận không khớp với mật khẩu mới. Vui lòng nhập lại.'
            });
		}

		console.info('[profile:account] requesting email and password change...');
		const { error: e } = await supabase.auth.updateUser({
			password
		});

		if (e) {
			console.info(`[profile:account] failure: ${e.message}`);
			return fail(500, {
				success: false,
				email,
				message: 'Có lổi xảy ra, vui lòng thử lại sau!'
			});
		}

		console.info('[profile:account] OK!');
		return {
			success: true,
			email
		};
	}
};

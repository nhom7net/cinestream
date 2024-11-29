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
		const formData = await request.formData();
		const { session } = await safeGetSession();

		let userInfo = {
			full_name: formData.get('fullName'),
			username: formData.get('username'),
			avatar_url: formData.get('avatarUrl')
		};

		const { error } = await supabase.from('profiles').upsert({
			id: session?.user.id,
			...userInfo,
			updated_at: new Date()
		});

		if (error)
			return fail(500, {
				success: false,
				userInfo,
				message: 'Có lổi xảy ra, vui lòng thử lại sau!'
			});

		return {
			sucess: true,
			userInfo
		};
	},

	account: async ({ request, locals: { supabase } }) => {
		const formData = await request.formData();
		let error: AuthError | null;

		let accountInfo = {
			email: formData.get('email') as string,
			password: formData.get('password') as string,
			confirm_password: formData.get('confirm-password') as string,
			old_password: formData.get('old-password') as string
		};

		// verify old password first
		const response = await supabase.rpc('verify_user_password', {
			password: accountInfo.old_password
		});
		
		if (!response.data) {
			return fail(400, {
				success: false,
				accountInfo,
				message: 'Không thể thay đổi thông tin, sai mật khẩu cũ!'
			});
		}

		if (accountInfo.old_password === accountInfo.password) {
			return fail(400, {
				success: false,
				accountInfo,
				message: 'Mật khẩu cũ trùng với mật khẩu mới. Không cần thay đổi.'
			});
		}

		// if no new password provided, simply ignore password change
		if (accountInfo.password.length > 0) {
			const { error: e } = await supabase.auth.updateUser({
				email: accountInfo.email,
				password: accountInfo.password
			});

			error = e;
		} else {
			const { error: e } = await supabase.auth.updateUser({
				email: accountInfo.email
			});

			error = e;
		}

		if (error) {
			return fail(500, {
				success: false,
				accountInfo,
				message: 'Có lổi xảy ra, vui lòng thử lại sau!'
			});
		}

		return {
			success: true,
			accountInfo
		};
	}
};

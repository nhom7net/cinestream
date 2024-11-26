// src/routes/+page.server.ts
import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url, locals: { safeGetSession } }) => {
	const { session } = await safeGetSession();

	if (session) {
		redirect(303, '/');
	}

	return { url: url.origin };
};

export const actions: Actions = {
	login: async ({ url, request, locals: { supabase, safeGetSession } }) => {
		const formData = await request.formData();
		const email = formData.get('email') as string;
		const password = formData.get('password') as string;
		const validEmail = /^[\w-\.+]+@([\w-]+\.)+[\w-]{2,8}$/.test(email);

		if (!validEmail) {
			return fail(400, { errors: { email: 'Địa chỉ email không hợp lệ!' }, email });
		}

		const { error } = await supabase.auth.signInWithPassword({ email, password });

		if (error) {
			return fail(400, {
				success: false,
				email,
				message: `Đăng nhập thất bại. Email hoặc mật khẩu có thể bị sai!`
			});
		}

		return {
			success: true,
			message: 'Đăng nhập thành công!'
		};
	},

	register: async ({ url, request, locals: { supabase, safeGetSession } }) => {
		const formData = await request.formData();
		const email = formData.get('email') as string;
		const username = formData.get('username') as string;
		const displayName = formData.get('name') as string;
		const password = formData.get('password') as string;
		const confirmPassword = formData.get('password-confirm') as string;

		if (password.length < 8) {
			return fail(400, {
				success: false,
				message: 'Mật khẩu phải có ít nhất 8 ký tự!',
				email,
				username,
				displayName
			});
		}

		if (password !== confirmPassword) {
			return fail(400, {
				success: false,
				message: 'Mật khẩu không trùng khớp!',
				email,
				username,
				displayName
			});
		}

		const validEmail = /^[\w-\.+]+@([\w-]+\.)+[\w-]{2,8}$/.test(email);

		if (!validEmail) {
			return fail(400, {
				success: false,
				message: 'Địa chỉ email không hợp lệ!',
				email,
				username,
				displayName
			});
		}

		try {
			const res: any = await supabase.auth.signUp({ email, password });
			if (res.error.code === "user_already_exists") throw new Error("Email này đã được sử dụng!");

			const { session } = await safeGetSession();

			if (!session) throw new Error("Không thể đăng ký ngay bây giờ.");

			await supabase
				.from('profiles')
				.update({
					full_name: displayName,
					username
				})
				.eq('id', session.user.id);
		} catch (e: any) {
			return fail(400, {
				success: false,
				email,
				username,
				displayName,
				message: e.message
			});
		}

		return {
			success: true,
			message: 'Đăng ký thành công!'
		};
	}
};

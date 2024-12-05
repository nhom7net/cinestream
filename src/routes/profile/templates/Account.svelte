<script lang="ts">
	import type { ActionData, SubmitFunction } from '../$types';
	import { enhance } from '$app/forms';
	import type { Session } from '@supabase/supabase-js';

	export let loading: boolean;
	export let session: Session;

	const handleSubmit: SubmitFunction = () => {
		loading = true;
		return async () => {
			loading = false;
		};
	};

	// sanity checking
	let password: string;
	let passconf: string;
	let passwordError: string = '';
	let passconfError: string = '';
	let passconfStyle: string = 'max-h-0 opacity-0';

	function validation() {
		if (password.length === 0) {
			passconf = '';
			passwordError = '';
			passconfError = '';
			passconfStyle = 'max-h-0 opacity-0';
			loading = false;
			return;
		}

		passconfStyle = 'max-h-screen';

		if (password.length < 8) {
			passwordError = 'Mật khẩu phải 8 kí tự trở lên!';
			loading = true;
		} else passwordError = '';

		if (passconf.length > 0 && password !== passconf) {
			passconfError = 'Mật khẩu không trùng khớp!';
			loading = true;
		} else {
			passconfError = '';
			loading = false;
		}
	}
</script>

<h2>Thay đổi thông tin đăng nhập</h2>
<form
	action="?/account"
	method="POST"
	class="flex flex-col [&>*]:max-w-96 [&>*]:my-2"
	use:enhance={handleSubmit}
>
	<div>
		<label for="email">Email</label>
		<input
			id="email"
			name="email"
			type="text"
			value={session.user.email}
			disabled
		/>
	</div>

	<div>
		<label for="password">Mật khẩu mới</label>
		<input
			type="password"
			name="password"
			id="password"
			placeholder="••••••••"
			bind:value={password}
			on:keyup={validation}
		/>
		<p class="text-red-500">{passwordError}</p>
	</div>

	<div class="displayTab {passconfStyle}">
		<label for="confirm-password">Nhập lại mật khẩu mới</label>
		<input
			type="password"
			name="confirm-password"
			id="confirm-password"
			placeholder="••••••••"
			bind:value={passconf}
			on:keyup={validation}
		/>
		<p class="text-red-500">{passconfError}</p>
	</div>

	<hr />
	<div>
		<p>Để đảm bảo an toàn cho tài khoản của bạn, <br />hãy nhập mật khẩu cũ của bạn:</p>
		<div>
			<input type="password" name="old-password" placeholder="••••••••" required />
		</div>
	</div>

	<div>
		<input
			type="submit"
			class="btn variant-filled-primary w-full my-4"
			value="Cập nhật"
			disabled={loading}
		/>
	</div>
</form>

<style>
	.displayTab {
		transition: all 0.42s ease-in-out;
	}
</style>

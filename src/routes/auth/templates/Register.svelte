<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData, SubmitFunction } from '../$types';
	import { AtSign, LockKeyhole, User } from 'lucide-svelte';

	export let form: ActionData;
	let loading = false;

	const handleSubmit: SubmitFunction = () => {
		loading = true;
		return async ({ update }) => {
			update();
			loading = false;
		};
	};

	// sanity checking
	let password: string;
	let passconf: string;
	let passwordError: string = '';
	let passconfError: string = '';

	function validation() {
		if (password.length === 0) {
			passwordError = '';
			passconfError = '';
			loading = false;
			return;
		}

		if (password.length <= 8) {
			passwordError = 'Mật khẩu phải 8 kí tự trở lên!';
			loading = true;
		} else passwordError = '';

		if (passconf.length <= 8 || password !== passconf) {
			passconfError = 'Mật khẩu không trùng khớp!';
			loading = true;
		} else {
			passconfError = '';
			loading = false;
		}
	}
</script>

<h2 class="h2">Đăng ký</h2>
<div class="py-2" />

<div class="flex flex-col">
	<form
		class="flex flex-col flex-center [&>*]:my-1"
		action="?/register"
		method="post"
		use:enhance={handleSubmit}
	>
		<div>
			<label for="name">Tên hiển thị</label>
			<div class="s-input-group">
				<div class="input-group-shim"><User /></div>
				<input id="name" name="name" class="input" type="text" placeholder="Van An" required />
			</div>
		</div>
		<div>
			<label for="username">
				<span>Tên đăng nhập</span>
			</label>
			<div class="s-input-group">
				<div class="input-group-shim"><AtSign /></div>
				<input
					id="username"
					name="username"
					class="input"
					type="text"
					placeholder="user"
					value={form?.username ?? ''}
					required
				/>
			</div>
		</div>
		<div>
			<label for="email">Địa chỉ email</label>
			<div class="s-input-group">
				<div class="input-group-shim"><AtSign /></div>
				<input
					id="email"
					name="email"
					class="input"
					type="email"
					placeholder="user@example.com"
					value={form?.email ?? ''}
					required
				/>
			</div>
		</div>
		<div>
			<label for="password">Mật khẩu</label>
			<div class="s-input-group">
				<div class="input-group-shim"><LockKeyhole /></div>
				<input
					id="password"
					name="password"
					class="input"
					type="password"
					placeholder="••••••••"
					required
					bind:value={password}
					on:keyup={validation}
				/>
			</div>
			<p class="text-red-500">{passwordError}</p>
		</div>
		<div>
			<label for="password-confirm">Xác nhận lại mật khẩu</label>
			<div class="s-input-group">
				<div class="input-group-shim"><LockKeyhole /></div>
				<input
					id="password-confirm"
					name="password-confirm"
					class="input"
					type="password"
					placeholder="••••••••"
					required
					bind:value={passconf}
					on:keyup={validation}
				/>
			</div>
			<p class="text-red-500">{passconfError}</p>
		</div>

		<div class="my-4">
			<button class="variant-filled-primary w-full" disabled={loading}>Đăng ký</button>
		</div>
	</form>
</div>

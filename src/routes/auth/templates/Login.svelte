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
</script>

<h2 class="h2">Đăng nhập</h2>
<div class="py-2" />

<form
	class="flex flex-col flex-center w-full [&>*]:my-1"
	action="?/login"
	method="POST"
	use:enhance={handleSubmit}
>
	<div>
		<label for="email">
			<span>Địa chỉ email</span>
		</label>
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
		<label for="password">
			<span>Mật khẩu</span>
		</label>
		<div class="s-input-group">
			<div class="input-group-shim"><LockKeyhole /></div>
			<input
				id="password"
				name="password"
				class="input"
				type="password"
				placeholder="••••••••"
				required
			/>
		</div>
	</div>
	<div class="my-4">
		<button class="variant-filled-primary w-full my-2">Đăng nhập</button>
	</div>
</form>

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

<h3 class="text-center">Đăng nhập</h3>

<div class="flex flex-col">
	<form class="flex flex-center w-full" action="?/login" method="POST" use:enhance={handleSubmit}>
		<div class="col-6 form-widget">
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
				<button class="variant-filled-primary w-full">
					{loading ? 'Loading' : 'Đăng nhập'}
				</button>
			</div>
		</div>
	</form>
</div>

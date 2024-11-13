<script lang="ts">
	import { getToastStore } from '@skeletonlabs/skeleton';
	import type { ActionData } from './$types.js';

	import Login from './templates/Login.svelte';
	import Register from './templates/Register.svelte';

	const toastStore = getToastStore();
	const showToast = (success: boolean | undefined, message: string | undefined) => {
		if (!message || success == undefined) return;
		toastStore.trigger({
			message: message,
			hideDismiss: true,
			background: success ? 'variant-filled-success' : 'variant-filled-primary'
		});
	};

	export let form: ActionData;
	$: form, showToast(form?.success, form?.message);

	let registerForm: boolean = false;
</script>

<div class="flex container">
	<div>
		{#if registerForm === false}
			<Login {form} />
		{:else if registerForm === true}
			<Register {form} />
		{/if}

		<div>
			<button
				class="variant-filled-tertiary w-full"
				on:click={() => {
					registerForm = !registerForm;
				}}
			>
				{registerForm ? 'Đã có tài khoản?' : 'Đăng ký'}
			</button>
		</div>
	</div>
</div>

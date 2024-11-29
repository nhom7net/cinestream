<!-- src/routes/account/+page.svelte -->
<script lang="ts">
	import type { SubmitFunction } from '@sveltejs/kit';
	import { getToastStore, ListBox, ListBoxItem } from '@skeletonlabs/skeleton';
	import Profile from './templates/Profile.svelte';
	import Account from './templates/Account.svelte';
	import type { ActionData } from './$types';

	export let data;

	let { session, supabase, profile } = data;
	$: ({ session, supabase, profile } = data);

	const toastStore = getToastStore();

	let loading = false;
	let tabSet: string = 'profile';

	const handleSubmit: SubmitFunction = () => {
		loading = true;
		return async () => {
			loading = false;
			toastStore.trigger({
				message: '✅ Cập nhật thành công!',
				background: 'variant-filled-success',
				hideDismiss: true
			});
		};
	};

	const showToast = (success: boolean | undefined, message: string | undefined) => {
		console.log(success, message);
		if (!message || success == undefined) return;
		toastStore.trigger({
			message: message || 'Có lỗi xảy ra, hãy thử lại sau!',
			hideDismiss: true,
			background: success ? 'variant-filled-success' : 'variant-filled-primary'
		});
	};

	export let form: ActionData;
	$: form, showToast(form?.success, form?.message);
</script>

<div class="flex gap-20 m-10">
	<div class="w-60">
		<ListBox>
			<ListBoxItem bind:group={tabSet} name="medium" value="profile">Tiểu sử</ListBoxItem>
			<ListBoxItem bind:group={tabSet} name="medium" value="account">Tài khoản</ListBoxItem>
		</ListBox>
	</div>

	<div>
		{#if tabSet === 'profile'}
			<Profile {form} {supabase} {handleSubmit} {loading} {profile} />
		{:else if tabSet === 'account'}
			<Account {session} {handleSubmit} {loading} />
		{/if}
	</div>
</div>

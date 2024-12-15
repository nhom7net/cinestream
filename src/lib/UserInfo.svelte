<script lang="ts">
	import type { SupabaseClient } from '@supabase/supabase-js';
	import { LoaderCircle, TriangleAlert } from 'lucide-svelte';
	import { onMount } from 'svelte';
	import Avatar from './Avatar.svelte';
	import { getModalStore, getToastStore, type ModalSettings } from '@skeletonlabs/skeleton';

	export let supabase: SupabaseClient;
	export let userid: string;

	const modalStore = getModalStore();
	const toastStore = getToastStore();

	let loaded = false;
	let success = false;
	let why = 'placeholder-error';
	let userData: {
		full_name: any;
		username: any;
		avatar_url: any;
		isAdmin: any;
		isBanned: any;
	} | null;

	let style = 'justify-center items-center';

	onMount(async () => {
		const { data, error } = await supabase
			.from('profiles')
			.select('full_name, username, avatar_url, isAdmin, isBanned')
			.eq('id', userid)
			.single();
		loaded = true;
		if (error) {
			why = error.message;
			return;
		}
		success = true;
		style = 'justify-start';
		userData = data;
	});

	const modal: ModalSettings = {
		type: 'confirm',
		title: 'Thực hiện thao tác',
		body: 'Bạn có muốn thực hiện thao tác này?'
	};

	function userAction(e: string) {
		modal.response = async (r: boolean) => {
			if (!r) return;
			switch (e) {
				case 'avatarRemoval':
					await supabase.from('profiles').upsert({ id: userid, avatar_url: '' });
					break;
				case 'blockUser':
					await supabase.from('profiles').upsert({ id: userid, isBanned: !userData?.isBanned });
					break;
			}
			toastStore.trigger({ message: 'Thao tác thành công', hideDismiss: true });
		};
		modalStore.trigger(modal);
	}
</script>

<div class="h-full flex flex-col {style} w-full">
	{#if loaded}
		{#if success}
			<h2 class="h2">Thao tác người dùng</h2>
			<div class="flex flex-col justify-between h-full py-4">
				<div>
					<div class="flex justify-center">
						<Avatar {supabase} url={userData?.avatar_url} size="w-64" />
					</div>

					<label for="full_name">Tên hiển thị:</label>
					<input type="text" id="full_name" name="full_name" value={userData?.full_name} disabled />

					<label for="username">Username:</label>
					<input type="text" id="username" name="username" value={userData?.username} disabled />
				</div>
				<div class="[&>*]:w-full [&>*]:my-4">
					{#if !userData?.isAdmin}
						<button class="variant-filled-primary" on:click={() => userAction('avatarRemoval')}
							>Xoá ảnh đại diện</button
						>
						<button
							class={userData?.isBanned ? 'variant-filled-success' : 'variant-filled-primary'}
							on:click={() => userAction('blockUser')}
							>{userData?.isBanned ? 'Gỡ chặn' : 'Chặn người dùng'}</button
						>
					{:else}
						<p class="text-center">Bạn không thể thực hiện thao tác nào cho quản trị viên.</p>
					{/if}
				</div>
			</div>
		{:else if !success}
			<TriangleAlert size={64} />
			<p>Không thể lấy thông tin của người này!</p>
			<p>Lỗi: {why}</p>
		{/if}
	{:else}
		<LoaderCircle size={64} class="animate-spin" />
	{/if}
</div>

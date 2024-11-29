<script lang="ts">
	import { enhance } from "$app/forms";
	import type { SubmitFunction } from "../$types";
    import AvatarUpload from './AvatarUpload.svelte';
	import Avatar from '$lib/Avatar.svelte';
	import type { SupabaseClient } from "@supabase/supabase-js";

    export let form;
    export let supabase: SupabaseClient;
    export let loading: boolean;
    export let profile;
    export let handleSubmit: SubmitFunction;

    let profileForm: HTMLFormElement;
	let fullName: string = profile?.full_name ?? '';
	let username: string = profile?.username ?? '';
	let avatarUrl: string = profile?.avatar_url ?? '';

</script>

<h2>Thay đổi tiểu sử</h2>
<form
	method="post"
	action="?/profile"
	class="flex justify-between items-center gap-24"
	use:enhance={handleSubmit}
	bind:this={profileForm}
>
	<!-- profile information -->
	<div class="min-w-96 [&>*]:my-2">
		<div>
			<label for="fullName">Tên hiển thị</label>
			<input id="fullName" name="fullName" type="text" value={form?.full_name ?? fullName} />
		</div>

		<div>
			<label for="username">Tên người dùng</label>
			<input id="username" name="username" type="text" value={form?.username ?? username} />
		</div>

		<div>
			<input
				type="submit"
				class="btn variant-filled-primary w-full my-4"
				value="Cập nhật"
				disabled={loading}
			/>
		</div>
	</div>
	
	<!-- profile picture -->
	<div>
		<Avatar {supabase} bind:url={avatarUrl} size="w-64" />
		<AvatarUpload
			{supabase}
			bind:url={avatarUrl}
			on:upload={() => {
				profileForm.submit();
			}}
		/>
	</div>
</form>

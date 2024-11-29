<!-- src/routes/account/Avatar.svelte -->
<script lang="ts">
	import type { SupabaseClient } from '@supabase/supabase-js';
	import { Avatar } from '@skeletonlabs/skeleton';
	import { ImageHelper } from '$lib/SupabaseImageHelper';
	import userImage from '$lib/assets/default.png';

	export let supabase: SupabaseClient;
	export let url: string;
	export let size: string = 'w-16';

	let imageUrl: string | undefined = "";
	let imageUpload = new ImageHelper(supabase);

	async function downloadAvatar() {
		if (!url) return;
		imageUrl = await imageUpload.downloadImage(url, 'avatars');
	}

	$: downloadAvatar();
</script>

<Avatar
	src={imageUrl}
	rounded="rounded-full"
	border="border-2 border-surface-300-600-token hover:!border-primary-500"
	width={size}
	fallback={userImage}
/>

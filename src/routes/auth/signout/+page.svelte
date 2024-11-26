<script lang="ts">
	import { goto } from '$app/navigation';
	import { redirect } from '@sveltejs/kit';

	export let data;

	let { supabase, session } = data;
	$: ({ supabase, session } = data);

	supabase.auth.signOut();

    setTimeout(async () => {
        await goto("/");
    }, 420);
</script>

<p>Signing you out...</p>
<p>Đang đăng xuất...</p>

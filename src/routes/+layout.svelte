<script lang="ts">
	import '../app.postcss';
	import { AppShell, AppBar, initializeStores, Toast } from '@skeletonlabs/skeleton';
	import { computePosition, autoUpdate, flip, shift, offset, arrow } from '@floating-ui/dom';
	import { storePopup } from '@skeletonlabs/skeleton';
	import { Search, History, List, UserRound, Bookmark } from 'lucide-svelte';
	import { TabGroup, TabAnchor } from '@skeletonlabs/skeleton';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { invalidate } from '$app/navigation';

	initializeStores();

	export let data;

	let { supabase, session } = data;
	$: ({ supabase, session } = data);

	onMount(() => {
		const { data } = supabase.auth.onAuthStateChange((event, newSession) => {
			if (newSession?.expires_at !== session?.expires_at) {
				invalidate('supabase:auth');
			}
		});

		return () => data.subscription.unsubscribe();
	});

	storePopup.set({ computePosition, autoUpdate, flip, shift, offset, arrow });
</script>

<Toast position="br"/>

<AppShell>
	<svelte:fragment slot="header">
		<AppBar>
			<svelte:fragment slot="lead">
				<strong class="text-xl uppercase text-yellow-500">CINESTREAM</strong>
			</svelte:fragment>
			<TabGroup>
				<TabAnchor href="/" selected={$page.url.pathname === '/'}>Phim mới</TabAnchor>
				<TabAnchor href="/phim-le" selected={$page.url.pathname === '/phim-le'}>Phim lẻ</TabAnchor>
				<TabAnchor href="/phim-bo" selected={$page.url.pathname === '/phim-bo'}>Phim bộ</TabAnchor>
				<TabAnchor href="/tv-shows" selected={$page.url.pathname === '/tv-shows'}
					>TV Shows</TabAnchor
				>
				<TabAnchor href="/hoat-hinh" selected={$page.url.pathname === '/hoat-hinh'}
					>Hoạt hình</TabAnchor
				>
			</TabGroup>
			<svelte:fragment slot="trail">
				<a class="btn btn-sm variant-ghost-surface" href="/" target="_blank" rel="noreferrer">
					<Search />
				</a>
				<a class="btn btn-sm variant-ghost-surface" href="/" target="_blank" rel="noreferrer">
					<List />
				</a>
				<a class="btn btn-sm variant-ghost-surface" href="/" target="_blank" rel="noreferrer">
					<Bookmark />
				</a>
				<a class="btn btn-sm variant-ghost-surface" href="/" target="_blank" rel="noreferrer">
					<History />
				</a>
				<a class="btn btn-sm variant-ghost-surface" href="/auth">
					<UserRound />
				</a>
			</svelte:fragment>
		</AppBar>
	</svelte:fragment>
	<slot />
	<div class="py-10"></div>
</AppShell>

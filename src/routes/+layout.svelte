<script lang="ts">
	import '../app.postcss';
	import { AppShell, AppBar } from '@skeletonlabs/skeleton';
	import { computePosition, autoUpdate, flip, shift, offset, arrow } from '@floating-ui/dom';
	import { storePopup } from '@skeletonlabs/skeleton';
	import { Search, History, List, UserRound } from 'lucide-svelte';
	import { TabGroup, TabAnchor, Paginator } from '@skeletonlabs/skeleton';
	import { page } from '$app/stores';

	storePopup.set({ computePosition, autoUpdate, flip, shift, offset, arrow });
</script>

<AppShell>
	<svelte:fragment slot="header">
		<AppBar>
			<svelte:fragment slot="lead">
				<strong class="text-xl uppercase">CINESTREAM</strong>
			</svelte:fragment>
			<TabGroup>
				<TabAnchor href="/Home" selected={$page.url.pathname === '/Home'}>Home</TabAnchor>
				<TabAnchor href="/TVShows" selected={$page.url.pathname === '/TVShows'}>TV Shows</TabAnchor>
				<TabAnchor href="/Movies" selected={$page.url.pathname === '/Movies'}>Movies</TabAnchor>
				<TabAnchor href="/New" selected={$page.url.pathname === '/New'}>New & Popular</TabAnchor>
				<TabAnchor href="/List" selected={$page.url.pathname === '/List'}>My list</TabAnchor>
			</TabGroup>
			<svelte:fragment slot="trail">
				<a class="btn btn-sm variant-ghost-surface" href="/" target="_blank" rel="noreferrer">
					<Search />
				</a>
				<a class="btn btn-sm variant-ghost-surface" href="/" target="_blank" rel="noreferrer">
					<List />
				</a>
				<a class="btn btn-sm variant-ghost-surface" href="/" target="_blank" rel="noreferrer">
					<History />
				</a>
				<a class="btn btn-sm variant-ghost-surface" href="/" target="_blank" rel="noreferrer">
					<UserRound />
				</a>
			</svelte:fragment>
		</AppBar>
	</svelte:fragment>

	<slot />
</AppShell>

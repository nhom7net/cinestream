<script lang="ts">
	import '../app.postcss';
	import { AppShell, AppBar, initializeStores, Toast } from '@skeletonlabs/skeleton';
	import { computePosition, autoUpdate, flip, shift, offset, arrow } from '@floating-ui/dom';
	import { storePopup } from '@skeletonlabs/skeleton';
	import { Search, History, List, UserRound, Bookmark } from 'lucide-svelte';
	import { TabGroup, TabAnchor } from '@skeletonlabs/skeleton';
	import { page } from '$app/stores';
	import { writable } from 'svelte/store';
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
	const keyword = writable("");
	const searchSuggestion = writable([]);

	function debounce(func: Function, delay: number) {
		let timeout: ReturnType<typeof setTimeout>;
		return (...args: any) => {
			clearTimeout(timeout);
			timeout = setTimeout(() => func(...args), delay);
		};
	}

	const handleSearch = async (input: string) => {
		if (!input) {
			searchSuggestion.set([]);
			return;
		}
		try {
			const response = await fetch(`https://phimapi.com/v1/api/tim-kiem?keyword=${input}&limit=7`);
			const data = await response.json();
			searchSuggestion.set(data.data.items);
		} catch (err) {
			console.error("Error fetching search data:", err);
		}
	};

	const handleSearchDebounce = debounce(handleSearch, 300);
	$: handleSearchDebounce($keyword);

	// // Helper function for navigation
	// function navigateToDetail(slug: string) {
	// 	window.location.href = `/detail/${slug}`;
	// }
</script>

<Toast position="br" />

<AppShell>
	<svelte:fragment slot="header">
		<AppBar>
			<svelte:fragment slot="lead">
				<strong class="text-xl uppercase text-yellow-500">CINESTREAM</strong>
			</svelte:fragment>
			<TabGroup
				active="variant-filled-primary"
				hover="hover:variant-soft-primary"
				flex="flex-1 lg:flex-none"
				rounded=""
				border=""
				class="bg-surface-100-800-token w-full"
			>
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
				<!-- Search Input and Icon -->
				<div class="relative">
					<input
						type="text"
						class="input input-bordered"
						placeholder="Search..."
						bind:value={$keyword}
					/>
					<Search class="absolute right-2 top-2 text-gray-500" />
				</div>
				<!-- Other icons for navigation -->
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
		<!-- Search Results Dropdown -->
	{#if $searchSuggestion.length > 0}
	<div class="absolute right-10 w-120 mt-2 border bg-slate-700 rounded shadow-lg z-10">
		<ul>
			{#each $searchSuggestion as suggestion}
			<li 
				class="flex items-center p-2 space-x-2 cursor-pointer hover:bg-slate-800" 
				on:click={() => navigateToDetail(suggestion.slug)}
			>
				<!-- Movie Poster Image -->
				<img 
					src="https://phimimg.com/{suggestion.poster_url}" 
					alt="{suggestion.name}" 
					class="w-12 h-16 rounded object-cover" 
				/>
				<!-- Movie Title -->
				<span>{suggestion.name}</span>
			</li>
			{/each}
		</ul>
	</div>
	

{/if}
	<slot />
	<div class="py-10"></div>
</AppShell>

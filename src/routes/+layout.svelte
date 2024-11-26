<script lang="ts">
	import '../app.postcss';
	import {
		AppShell,
		AppBar,
		initializeStores,
		Toast,
		type PopupSettings,
		popup,
		ListBox,
		ListBoxItem
	} from '@skeletonlabs/skeleton';
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
	let keyword: string = '';
	let searchSuggestion: any[] = [];

	const searchResultPopup: PopupSettings = {
		event: 'focus-blur',
		target: 'searchResultPopup',
		placement: 'bottom'
	};

	const userDialogPopup: PopupSettings = {
		event: 'click',
		target: 'userDialogPopup',
		placement: 'bottom'
	};

	$: keyword, searchSuggestion;

	const debounce = (callback: Function, wait = 300) => {
		let timeout: ReturnType<typeof setTimeout>;

		return (...args: any[]) => {
			clearTimeout(timeout);
			timeout = setTimeout(() => callback(...args), wait);
		};
	};

	async function handleSearch() {
		if (keyword.length <= 0) {
			searchSuggestion = [];
			return;
		}

		try {
			const response = await fetch(
				`https://phimapi.com/v1/api/tim-kiem?keyword=${keyword}&limit=5`
			);
			const data = await response.json();
			searchSuggestion = data.data.items;
		} catch (err) {
			console.error('Error fetching search data:', err);
		}
	}
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
				<div class="relative" use:popup={searchResultPopup}>
					<input
						type="text"
						class="input input-bordered"
						placeholder="Search..."
						bind:value={keyword}
						on:keyup={debounce(handleSearch)}
					/>
					<Search class="absolute right-2 top-2 text-gray-500" />
				</div>
				<!-- Other icons for navigation -->
				{#if session}
					<a class="btn btn-sm variant-ghost-surface" href="/list">
						<List />
					</a>
					<a class="btn btn-sm variant-ghost-surface" href="/bookmark">
						<Bookmark />
					</a>
					<a class="btn btn-sm variant-ghost-surface" href="/history">
						<History />
					</a>
					<button class="btn-sm variant-ghost-surface" use:popup={userDialogPopup}>
						<UserRound />
					</button>
				{:else}
					<a class="btn btn-sm variant-filled-primary" href="/auth">Đăng nhập</a>
				{/if}
			</svelte:fragment>
		</AppBar>
	</svelte:fragment>
	<!-- Search Result Dialog popups-->
	<div class="z-50" data-popup="searchResultPopup">
		{#if searchSuggestion.length > 0}
			<div class="card p-4 variant-filled-surface">
				<ul class="list">
					{#each searchSuggestion as suggestion}
						<li class="p-2 space-x-2 rounded hover:variant-ghost-primary">
							<!-- TODO: Put details URL here. -->
							<a href={suggestion.url} class="flex gap-2">
								<img
									src="https://phimimg.com/{suggestion.poster_url}"
									alt={suggestion.name}
									class="w-12 h-16 rounded-xl object-cover"
								/>
								<div>
									<span>{suggestion.name}</span>
									<br />
									<span class="text-gray-500">{suggestion.year}</span>
								</div>
							</a>
						</li>
					{/each}
				</ul>
			</div>
		{/if}
	</div>

	<!-- User button dialog popup -->
	<div class="z-50 card p-4 variant-filled-surface" data-popup="userDialogPopup">
		<ul class="list [&>*]:p-2 [&>*]:space-x-2 [&>*]:rounded">
			<li class="hover:variant-ghost-primary"><a href="/profile">Trang cá nhân</a></li>
			<li class="hover:variant-ghost-primary"><a href="/auth/signout">Đăng xuất</a></li>
		</ul>
	</div>
	<slot />
	{#if !$page.url.pathname.includes('/auth')}
		<div class="py-10"></div>
	{/if}
</AppShell>

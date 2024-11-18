<script lang="ts">
	import { onMount } from 'svelte';
	import MovieCard from '../../components/MovieCard.svelte';
	import { Paginator, type PaginationSettings } from '@skeletonlabs/skeleton';

	let movieItems: any = { data: [], pagination: {} };
	let currentPage = 0;
	let mounted = false;

	export let data;

	let paginationSettings = {
		page: currentPage,
		limit: 20,
		size: 1,
		amounts: [20]
	} satisfies PaginationSettings;

	$: data, slugChanged(0);

	// Hàm gọi API
	async function fetchItems(page: number) {
		const url = data.url + page;
		try {
			const response = await fetch(url);
			if (!response.ok)
				throw new Error(`API returned: ${response.status} (${response.statusText})`);
			const data = await response.json();
			return data;
		} catch (error) {
			console.error(error);
			return null;
		}
	}

	// Hàm tải dữ liệu phim
	async function loadItems(page: number) {
		const response1 = await fetchItems(page);
		const response2 = await fetchItems(page + 1);
		paginationSettings.size = response1.data.params.pagination.totalItems;

		if (response1 && response1.data.items && response2 && response2.data.items) {
			movieItems.data.items = [...response1.data.items, ...response2.data.items];

			if (response1.data.params && response1.data.params.pagination) {
				movieItems.pagination = response1.data.params.pagination;
				currentPage = page;
			} else {
				movieItems.pagination = { totalPages: 1 };
				currentPage = 1;
			}
		} else {
			movieItems = { data: [], pagination: { totalPages: 1 } };
			currentPage = 1;
		}
	}

	onMount(() => {
		loadItems(currentPage);
		mounted = true;
	});

	// slug changed, reset everything then fetch
	function slugChanged(page: number) {
		if (!mounted) return; // don't run when the page is still being rendered on server
		currentPage = page;
		movieItems.data = [];
		movieItems.pagination = {};
		loadItems(currentPage);
	}

	// Function that calls when page number is changed.
	function pageChanged(event: CustomEvent<number>) {
		movieItems.data = [];
		loadItems(event.detail);
	}
</script>

<div class="flex flex-wrap gap-6 justify-center pt-10">
	{#if movieItems.data.items && movieItems.data.items.length > 0}
		{#each movieItems.data.items as data}
			<MovieCard {data} />
		{/each}
		<Paginator
			bind:settings={paginationSettings}
			showNumerals
			select="hidden"
			justify="justify-center"
			on:page={pageChanged}
		/>
	{:else}
		<p class="text-center text-gray-400">Đang tải dữ liệu</p>
	{/if}
</div>

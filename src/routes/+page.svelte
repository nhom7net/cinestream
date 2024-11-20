<script lang="ts">
	import { onMount } from 'svelte';
	import MovieCard from '../components/MovieCard.svelte';
	import { Paginator, type PaginationSettings } from '@skeletonlabs/skeleton';

	let movies: any = { items: [], pagination: {} };
	let currentPage = 0;

	let paginationSettings = {
		page: currentPage,
		limit: 20,
		size: 1,
		amounts: [20]
	} satisfies PaginationSettings;

	$: paginationSettings;
	import { onMount } from 'svelte';
	import MovieCard from '../components/MovieCard.svelte';
	import { Paginator, type PaginationSettings } from '@skeletonlabs/skeleton';

	let movies: any = { items: [], pagination: {} };
	let currentPage = 0;

	let paginationSettings = {
		page: currentPage,
		limit: 20,
		size: 1,
		amounts: [20]
	} satisfies PaginationSettings;

	$: paginationSettings;

	// Hàm gọi API
	async function fetchMovies(page: number) {
		const url = `https://phimapi.com/danh-sach/phim-moi-cap-nhat?page=${page + 1}`;
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
	async function loadMovies(page: number) {
		const response1 = await fetchMovies(page);
		const response2 = await fetchMovies(page + 1);
		paginationSettings.size = response1.pagination.totalItems;

		if (response1 && response1.items && response2 && response2.items) {
			movies.items = [...response1.items, ...response2.items]; // Hợp nhất kết quả
			movies.pagination = response1.pagination; // Giữ lại thông tin phân trang
			currentPage = page;
		} else {
			movies = { items: [], pagination: { totalPages: 1 } };
			currentPage = 1;
		}
	}

	// Gọi API khi component được render
	onMount(async () => {
		await loadMovies(currentPage);
	});

	// Function that calls when page number is changed.
	function pageChanged(event: CustomEvent<number>) {
		movies.data = [];
		loadMovies(event.detail);
	}
</script>

{#if movies.items && movies.items.length > 0}
	<div class="grid grid-cols-4 gap-y-6 my-6 px-24 justify-items-center justify-evenly items-center">
		{#each movies.items as data}
			<MovieCard {data} />
		{/each}
	</div>
	<Paginator
		bind:settings={paginationSettings}
		showNumerals
		select="hidden"
		justify="justify-center"
		on:page={pageChanged}
	/>
{:else}
	<div class="flex justify-center align-middle items-center h-full">
		<p class="text-center text-gray-400">Đang tải dữ liệu</p>
	</div>
{/if}

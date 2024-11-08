<script lang="ts">
	import { Paginator } from '@skeletonlabs/skeleton';
	import { fetchMovies } from './homepage';
	import type { PaginationSettings } from '@skeletonlabs/skeleton';
	import { onMount } from 'svelte';

    interface Movies {
        items: any[],
        pagination: any,
        status: boolean
    }
	let movies: Movies = { items: [], pagination: [], status: false };

	onMount(async () => {
		await loadMovies(paginationSettings.page);
	});

	let paginationSettings = {
		page: 0,
		limit: 0,
		size: 0,
		amounts: [1]
	} satisfies PaginationSettings;

	$: if (movies && movies.items) {
        paginationSettings.limit = movies.pagination.totalItemsPerPage;
        paginationSettings.size = movies.pagination.totalItems;
    }

	function pageChanges(e: CustomEvent) {
        loadMovies(paginationSettings.page);
	}

    async function loadMovies(page: number) {
        const data: any = await fetchMovies(page);
        if (data.status == true) {
            movies = data;
        }
    }
</script>

<h1>Danh Sách Phim Mới Cập Nhật</h1>

<div>
    {#if movies.items.length > 0}
        <ul>
            {#each movies.items as movie}
                <li>
                    <h2>{movie.name}</h2>
                </li>
            {/each}
        </ul>
    {:else}
        <p>Không có dữ liệu</p>
    {/if}
</div>

<Paginator bind:settings={paginationSettings} showNumerals on:page={pageChanges} />

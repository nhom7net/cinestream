<script>
// @ts-nocheck

    import { onMount } from 'svelte';
    import { fetchMovies } from '../lib/api.js';

	export let paginationSettings;

    // @ts-ignore
    let movies = [];

    // Hàm lấy dữ liệu từ API khi component được mount
    onMount(async () => {
        await loadMovies(paginationSettings.page);
    });

	// Gọi lại `loadMovies` khi `paginationSettings.page` thay đổi
    $: {
    if (paginationSettings.page) {
        loadMovies(paginationSettings.page);
    	}
	}

    // @ts-ignore
    async function loadMovies(page) {
        const data = await fetchMovies(page);
		console.log("Data from API:", data);
        if (data) {
            movies = data.movies; // Cập nhật dựa vào cấu trúc JSON của API
        } else {
			movies = [];
		}
    }
</script>

<h1>Danh Sách Phim Mới Cập Nhật</h1>

<div>
    {#if movies.length > 0}
        <ul>
            {#each movies as movie}
                <li>
                    <h2>{movie.title}</h2>
                    <p>{movie.description}</p>
                </li>
            {/each}
        </ul>
    {:else}
        <p>Không có dữ liệu</p>
    {/if}
</div>
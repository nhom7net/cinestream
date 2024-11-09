<script lang="ts">
    import { onMount } from 'svelte';
    
    let movies: any = { items: [], pagination: {} };
    let currentPage = 1;
    let totalPages = 1;

    // Hàm gọi API
    async function fetchMovies(page: number) {
        const url = `https://phimapi.com/danh-sach/phim-moi-cap-nhat?page=${page + 1}`;
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error(`API returned: ${response.status} (${response.statusText})`);
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

        if (response1 && response1.items && response2 && response2.items) {
            movies.items = [...response1.items, ...response2.items]; // Hợp nhất kết quả
            movies.pagination = response1.pagination; // Giữ lại thông tin phân trang
            currentPage = page;
            totalPages = Math.ceil(response1.pagination.totalItems / 20);
        } else {
            movies = { items: [], pagination: { totalPages : 1 } };
            currentPage = 1;
            totalPages = 1;
        }
    }

    // Gọi API khi component được render
    onMount(async () => {
        await loadMovies(currentPage);
    });

    // Hàm chuyển sang trang kế tiếp
    function nextPage() {
        if (currentPage < totalPages) {
            loadMovies(currentPage + 1);
        }
    }

    // Hàm quay lại trang trước
    function prevPage() {
        if (currentPage > 1) {
            loadMovies(currentPage - 1);
        }
    }

</script>

<h1 class="text-left text-lg font-bold mb-6 text-white pl-28 pt-10">Mới cập nhật</h1>

<div class="flex flex-wrap gap-6 justify-center">
    {#if movies.items && movies.items.length > 0}
        {#each movies.items as movie}
            <div class="w-56 mr-10 max-w-xs border border-gray-300 rounded-lg overflow-hidden text-center shadow-md transition-transform duration-200 ease-in-out transform hover:scale-105">
                <img src="{movie.poster_url}" alt="Poster of {movie.name}" class="w-full h-72 object-cover">
                <p class="text-sm font-semibold text-orange-400 my-2 text-wrap">{movie.name}</p>
                <p class="text-sm text-gray-300 mb-3 text-wrap">{movie.origin_name}</p>
            </div>
        {/each}
    {:else}
        <p class="text-center text-gray-400">Đang tải dữ liệu</p>
    {/if}
</div>

<!-- Phân trang -->
<div class="flex justify-center gap-4 mt-6">
    <button 
      class="px-4 py-2 bg-gray-700 text-white rounded" 
      on:click={prevPage} 
      disabled={currentPage === 1}>
      Trang Trước
    </button>
    <span class="text-white">{currentPage} / {totalPages}</span>
    <button 
      class="px-4 py-2 bg-gray-700 text-white rounded" 
      on:click={nextPage} 
      disabled={currentPage === totalPages}>
      Trang Sau
    </button>
</div>

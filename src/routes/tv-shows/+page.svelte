<script lang="ts">
    import { onMount } from 'svelte';
    
    let tvShows: any = { data: [], pagination: {} };
    let currentPage = 1;
    let totalPages = 1;

    // Hàm gọi API
    async function fetchtvShows(page: number) {
        const url = `https://phimapi.com/v1/api/danh-sach/tv-shows?page=${page}`;
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error(`API returned: ${response.status} (${response.statusText})`);
            const data = await response.json();
            console.log(data);
            return data;
        } catch (error) {
            console.error(error);
            return null;
        }
    }

    // Hàm tải dữ liệu phim
    async function loadtvShows(page: number) {
        const response = await fetchtvShows(page);;

        if (response && response.data.items) {
            tvShows.data.items = response.data.items; // Dữ liệu của trang hiện tại

            if (response.data.params && response.data.params.pagination) {
                tvShows.pagination = response.data.params.pagination;
                currentPage = page;
                totalPages = Math.ceil(response.data.params.pagination.totalItems / 10);
            } else {
            tvShows.pagination = { totalPages: 1 };
            currentPage = 1;
            totalPages = 1;
        }
        } else {
            tvShows = { data: [], pagination: { totalPages : 1 } };
            currentPage = 1;
            totalPages = 1;
        }
    }

    // Gọi API khi component được render
    onMount(async () => {
        await loadtvShows(currentPage);
    });

    // Hàm chuyển sang trang kế tiếp
    function nextPage() {
        if (currentPage < totalPages) {
            loadtvShows(currentPage + 1);
        }
    }

    // Hàm quay lại trang trước
    function prevPage() {
        if (currentPage > 1) {
            loadtvShows(currentPage - 1);
        }
    }
</script>

<div class="flex flex-wrap gap-6 justify-center pt-10">
    {#if tvShows.data.items && tvShows.data.items.length > 0}
        {#each tvShows.data.items as tvShow}
            <div class="w-56 mr-10 max-w-xs border border-gray-300 rounded-lg overflow-hidden text-center shadow-md transition-transform duration-200 ease-in-out transform hover:scale-105">
                <img src={"https://kkphim.com/" + tvShow.poster_url} alt="{tvShow.name}" class="w-full h-72 object-cover">
                <p class="text-sm font-semibold text-orange-400 my-2 text-wrap">{tvShow.name}</p>
                <p class="text-sm text-gray-300 mb-3 text-wrap">{tvShow.origin_name}</p>
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

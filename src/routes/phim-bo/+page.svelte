<script lang="ts">
    import { onMount } from 'svelte';
    
    let phimBoItems: any = { data: [], pagination: {} };
    let currentPage = 1;
    let totalPages = 1;

    // Hàm gọi API
    async function fetchphimBoItems(page: number) {
        const url = `https://phimapi.com/v1/api/danh-sach/phim-le?page=${page}`;
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
    async function loadphimBoItems(page: number) {
        const response1 = await fetchphimBoItems(page);
        const response2 = await fetchphimBoItems(page + 1);

        if (response1 && response1.data.items && response2 && response2.data.items) {
            phimBoItems.data.items = [...response1.data.items, ...response2.data.items];

            if (response1.data.params && response1.data.params.pagination) {
                phimBoItems.pagination = response1.data.params.pagination;
                currentPage = page;
                totalPages = Math.ceil(response1.data.params.pagination.totalItems / 20);
            } else {
                phimBoItems.pagination = { totalPages: 1 };
            currentPage = 1;
            totalPages = 1;
        }
        } else {
            phimBoItems = { data: [], pagination: { totalPages : 1 } };
            currentPage = 1;
            totalPages = 1;
        }
    }

    // Gọi API khi component được render
    onMount(async () => {
        await loadphimBoItems(currentPage);
    });

    // Hàm chuyển sang trang kế tiếp
    function nextPage() {
        if (currentPage < totalPages) {
            loadphimBoItems(currentPage + 1);
        }
    }

    // Hàm quay lại trang trước
    function prevPage() {
        if (currentPage > 1) {
            loadphimBoItems(currentPage - 1);
        }
    }
</script>

<div class="flex flex-wrap gap-6 justify-center pt-10">
    {#if phimBoItems.data.items && phimBoItems.data.items.length > 0}
        {#each phimBoItems.data.items as phimBo}
            <div class="w-56 mr-10 max-w-xs border border-gray-300 rounded-lg overflow-hidden text-center shadow-md transition-transform duration-200 ease-in-out transform hover:scale-105">
                <img src={"https://kkphim.com/" + phimBo.poster_url} alt="{phimBo.name}" class="w-full h-72 object-cover">
                <p class="text-sm font-semibold text-orange-400 my-2 text-wrap">{phimBo.name}</p>
                <p class="text-sm text-gray-300 mb-3 text-wrap">{phimBo.origin_name}</p>
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

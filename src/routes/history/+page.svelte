<script lang="ts">
    import { onMount } from 'svelte';

    // Biến lưu danh sách phim
    let movieHistory: string | any[] = [];
    let loading = true; // Trạng thái "đang tải"

    // Hàm gọi API
    async function fetchMovieHistory() {
        try {
            const response = await fetch('https://kkphim.com/'); // Gọi API lịch sử xem phim
            const data = await response.json();
            movieHistory = data.data; // Lưu dữ liệu lịch sử vào biến
        } catch (err) {
            console.error('Lỗi khi gọi API:', err);
        } finally {
            loading = false; // Tắt trạng thái "đang tải"
        }
    }
    

    // Gọi API khi trang được tải
    onMount(() => {
        fetchMovieHistory();
    });
</script>

<!-- Giao diện hiển thị lịch sử xem phim -->
<section class="py-6">
    <h2 class="text-center">Lịch sử xem phim</h2>
    {#if loading}
        <p>Đang tải dữ liệu...</p>
    {:else if movieHistory.length === 0}
        <p>Bạn chưa xem phim nào.</p>
    {:else}
        <ul>
            {#each movieHistory as movie}
                <li class="p-2 space-x-2 rounded hover:bg-gray-100 flex items-center">
                    <!-- Poster phim -->
                    <img
                        src="https://kkphim.com/{movie.poster_url}"
                        alt={movie.name}
                        class="w-12 h-16 rounded object-cover"
                    />
                    <!-- Thông tin phim -->
                    <div>
                        <p class="text-lg font-bold">{movie.name}</p>
                        <p class="text-gray-500 text-sm">
                            {new Date(movie.watched_at).toLocaleString()}
                        </p>
                    </div>
                </li>
            {/each}
        </ul>
    {/if}
</section>

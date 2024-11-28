<script lang="ts">
	export let data;
</script>

<section class="py-6">
	<h2 class="text-center text-2xl font-semibold">Lịch sử xem phim</h2>
	{#if !data.history || data.history.length === 0}
		<p class="text-center text-gray-500">Bạn chưa xem phim nào.</p>
	{:else}
		<ul class="space-y-4">
			{#each data.history as movie (movie.time)}
				<li class="p-2 space-x-2 rounded hover:bg-gray-100 flex items-center">
					<img
						src="{movie.poster}"
						alt="{movie.name} {movie.episode}"
						class="w-32 h-40 rounded object-cover"
					/>
					<div class="flex flex-col">
						<span class="text-xl font-bold text-center">{movie.name}</span>
						<span class="text-xl font-bold text-center">{movie.episode}</span>
					</div>
				</li>
			{/each}
		</ul>
	{/if}
</section>

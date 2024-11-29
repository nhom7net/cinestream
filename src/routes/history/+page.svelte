<script lang="ts">
	export let data;
</script>

<section class="py-6">
	<h2 class="left text-2xl font-semibold">Lịch sử xem phim</h2>
	{#if !data.history || data.history.length === 0}
		<p class="text-center text-gray-500">Bạn chưa xem phim nào.</p>
	{:else}
		<ul class="space-y-4">
			{#each data.history as movie (movie.time)}
				<li class="p-2 space-x-2 rounded flex items-center hover:bg-transparent">
					<a href={movie.link} class="movie-link flex justify-center items-center gap-4">
						<img src={movie.poster} alt={movie.name} class="w-48 h-64 rounded object-cover" />
						<div class="flex flex-col">
							<span class="text-2xl font-bold text-center">{movie.name}</span>
							<span class="text-2xl font-bold text-center">{movie.episode}</span>
						</div>
					</a>
				</li>
			{/each}
		</ul>
	{/if}
</section>

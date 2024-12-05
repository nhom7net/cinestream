<script lang="ts">
	export let data;
</script>

<h1 class="text-4xl font-bold mt-6 pl-10">Phim đã yêu thích</h1>

<div class="flex flex-col px-56 pt-20 mr">
	{#if data.slugMovies.length > 0}
		<ul class="grid grid-cols-2 gap-12">
			{#each data.slugMovies as movie}
				<li
					class="flex items-center gap-4 p-4 border border-gray-200 rounded-lg shadow-sm hover:bg-gray-50"
				>
					<a href="/details/{movie.slug}" class="flex-shrink-0">
						<img
							src={movie.poster_url}
							alt={movie.name}
							class="w-20 h-30 object-cover rounded-md"
						/>
					</a>
					<div class="flex-grow">
						<div class="text-xl font-semibold text-white-800">{movie.name}</div>
					</div>
				</li>
			{/each}
		</ul>
	{:else}
		<p class="text-gray-500">Loading movies...</p>
	{/if}
</div>

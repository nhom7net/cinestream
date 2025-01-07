<script lang="ts">
	export let data;
</script>
<h2 class="font-bold mt-7 pl-10">Lịch sử xem phim</h2>
<div class="flex flex-col px-56 pt-20 mr">
	{#if !data.history || data.history.length === 0}
		<p class="text-center text-gray-500">Bạn chưa xem phim nào.</p>
	{:else}
		<ul class="grid grid-cols-2 gap-12">
			{#each data.history as movie (movie.time)}
				<li class="flex items-center gap-4 p-4 border border-gray-200 rounded-lg shadow-sm hover:bg-gray-50">
					<a href={movie.link} class="movie-link flex justify-center items-center gap-4">
						<img src={movie.poster} alt={movie.name} class="w-20 h-30 object-cover rounded-md" />
						<div class="flex-grow">
							<span class="text-xl font-semibold text-white-800">{movie.name}</span>
							<span class="text-xl font-semibold text-white-800">{movie.episode}</span>
						</div>
					</a>
				</li>
			{/each}
		</ul>
	{/if}
	</div>
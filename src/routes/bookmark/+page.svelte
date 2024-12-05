<script lang="ts">
	export let data;
</script>
<!-- Display the slug-movie array -->
{#if data.slugMovies.length > 0}
	<ul>
		{#each data.slugMovies as movie}
			<li>
				<div>Name: {movie.name}</div>
				<a href="/details/{movie.slug}" class="flex gap-2"><img src="{movie.poster_url}" alt="{movie.name}" width="100" /></a>
				
			</li>
		{/each}
	</ul>
{:else}
	<p>Loading movies...</p>
{/if}

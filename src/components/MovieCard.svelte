<script lang="ts">
	export let data: any;
	let url = '';

	if (!data.poster_url.includes('https://phimimg.com')) {
		url = 'https://kkphim.com/';
	}
</script>

<div
	class="w-56 max-w-xs variant-filled-surface rounded-lg overflow-hidden text-center shadow-md transition-transform duration-200 ease-in-out transform hover:scale-105 hover:variant-soft-tertiary"
>
	<img src={url + data.poster_url} alt={data.name} class="w-full h-72 object-cover" />
	<p class="text-sm font-semibold text-orange-400 my-2 text-wrap">{data.name}</p>
	<p class="text-sm text-gray-300 mb-3 text-wrap">{data.origin_name}</p>
</div>

<script lang="ts">
<<<<<<< HEAD
	export let data;
    const supabase = data.supabase;

	async function addToFavorites(movieId: string) {
        console.log("addToFavorites");
		const user = data.session?.user.id; // Lấy thông tin người dùng hiện tại
		if (!user) {
			alert('Bạn cần đăng nhập để thêm phim vào danh sách yêu thích!');
			return;
		}
        try {
            const { data: insertedData, error } = await supabase
			.from('favorites')
			.insert([{ user_id: user, movie_id: movieId }]);
        } catch (error) {
            console.error(error);
        }
=======
	import Link_2 from 'lucide-svelte/icons/link-2';

	export let data;
	const supabase = data.supabase;

	async function saveHistory(episode: any, links: any) {
		console.log('saveHistory');
		const user = data.session?.user.id;
		if (!user) {
			return;
		}
		try {
			const { data: addData, error } = await supabase
				.from('history')
				.insert([{ user: user, movie: data.film, episodes: episode , link: links}]);

			console.log('Payload to Supabase:', {
				user: user,
				movie: data.film,
				episodes: episode,
				link: links
			});
		} catch (error) {
			console.error(error);
		}
>>>>>>> origin/main
	}
</script>

<div class="px-44">
	<h1 class="pt-10 pb-5 text-3xl font-bold text-center text-orange-400">{data.origin_name}</h1>

	<div class="mb-6 flex items-center space-x-4">
		<img src={data.poster} alt={data.name} class="w-52 h-80 rounded-md" />

		<div class="flex flex-col pl-10">
			<p class="text-xl font-bold mb-2">{data.name}</p>
			<div class="flex items-center mb-2">
				<h2 class="text-base font-bold mr-4">Thể loại:</h2>
				<div class="flex flex-wrap space-x-4">
					{#each data.category as cat}
						<p class="bg-gray-200 text-black px-2 py-1 rounded text-sm">
							{cat.name}
						</p>
					{/each}
				</div>
			</div>
			<div class="flex items-center mb-2">
				<h2 class="text-base font-bold mr-4">Quốc gia:</h2>
				<div class="flex flex-wrap space-x-4">
					{#each data.country as country}
						<p class="bg-gray-200 text-black px-2 py-1 rounded text-sm">
							{country.name}
						</p>
					{/each}
				</div>
			</div>
			<div class="flex">
				<h2 class="text-base font-bold mr-4">Trạng thái:</h2>
				<p class="font-bold mb-2 text-base">{data.episode_current}</p>
			</div>
			<div class="flex">
				<h2 class="text-base font-bold mr-4 flex">Thời lượng:</h2>
				<p class="text-base font-bold mb-2">{data.time}</p>
			</div>
			<div class="flex">
				<h2 class="text-base font-bold mr-4 flex">Chất lượng:</h2>
				<p class="text-base font-bold mb-2">{data.quality}</p>
			</div>
			<div class="flex space-x-4">
				<button class="bg-red-500 text-white rounded hover:bg-red-700 w-22 h-10">Xem phim</button>
<<<<<<< HEAD
				<button
					class="bg-yellow-500 text-white rounded hover:bg-yellow-700 w-22 h-10"
					on:click={() => addToFavorites(data.slug)}
				>
					Yêu thích
				</button>
=======
				<button class="bg-yellow-500 text-white rounded hover:bg-yellow-700 w-22 h-10"
					>Yêu thích</button
				>
>>>>>>> origin/main
			</div>
		</div>
	</div>

	<div class="flex flex-auto">
		<div class="mb-6 w-1/2">
			<h2 class="text-lg font-bold mb-4">Danh sách tập phim:</h2>
			<div class="flex flex-wrap justify-start gap-5">
				{#each data.episode as ep}
					<div class="flex w-20">
						<button
							class="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700"
<<<<<<< HEAD
							on:click={() => window.open(ep.link_embed, '_blank')}
=======
							on:click={() => {
								saveHistory(ep.name, ep.link_embed);
								window.open(ep.link_embed, '_blank');
							}}
>>>>>>> origin/main
						>
							{ep.name}
						</button>
					</div>
				{/each}
			</div>
		</div>

		<div class="heading w-1/2">
			<h4 class="text-lg font-bold mb-4">Nội dung</h4>
			<p class="text-base">{data.content}</p>
		</div>
	</div>
</div>

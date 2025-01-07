<script lang="ts">
	import { page } from '$app/stores';
	import { get } from 'svelte/store';
	import Avatar from '$lib/Avatar.svelte';

	export let data;

	let { supabase } = data;
	let comments = data.comment || [];
	let comment = '';
	let selectedEpisode: string = '';

	$: {
		const params = new URLSearchParams(get(page).url.search);
		const episode = params.get('episode');

		if (episode) {
			const selected = data.episode.find((ep: { name: string }) => ep.name === episode);
			if (selected) {
				selectedEpisode = selected.link_embed;
			}
		} else if (data.episode.length > 0) {
			selectedEpisode = data.episode[data.episode.length - 1].link_embed;
		}
	}

	function changeEpisode(episodeLink: string, epName: string) {
		selectedEpisode = episodeLink;
		history.pushState(null, '', `?episode=${epName}`);
	}

	async function addComment() {
		if (!data.session?.user.id) {
			alert('Bạn cần đăng nhập để gửi bình luận!');
			return;
		}

		if (!comment.trim()) {
			alert('Bình luận không được để trống!');
			return;
		}

		try {
			const { data: newComment, error } = await supabase
				.from('comments')
				.insert([
					{
						user_id: data.session.user.id,
						movie_id: data.slug,
						comment,
						created_at: new Date().toISOString()
					}
				])
				.select('id, user_id, movie_id, comment, created_at, profiles(full_name)')
				.single();

			if (error) {
				console.error('Error adding comment:', error.message);
				alert('Không thể gửi bình luận!');
			} else {
				alert('Bình luận của bạn đã được gửi!');
				comment = '';
				data.comment = [newComment, ...data.comment];
			}
		} catch (error) {
			console.error(error);
		}
	}

	async function reportComment(commentToReport: { id: string; user_id: string }) {
		if (!data.session?.user.id) {
			alert('Bạn cần đăng nhập để báo cáo bình luận!');
			return;
		}

		try {
			const { error } = await supabase
				.from('comments')
				.update({ report: true })
				.eq('id', commentToReport.id);

			if (error) {
				console.error('Error reporting comment:', error.message);
				alert('Không thể báo cáo bình luận!');
			} else {
				alert('Bình luận đã được báo cáo thành công!');
				comment = comments.map((c: { id: string }) =>
					c.id === commentToReport.id ? { ...c, report: true } : c
				);
			}
		} catch (error) {
			console.error('Error:', error);
		}
	}
</script>

<h1 class="text-center pt-10 pb-5 text-3xl font-bold text-orange-400">{data.name}</h1>
<div class="flex flex-col items-center">
	{#if selectedEpisode}
		<!-- svelte-ignore a11y-missing-attribute -->
		<iframe src={selectedEpisode} width="960" height="540" frameborder="0" allowfullscreen></iframe>
	{:else}
		<p>Không có tập phim nào để phát.</p>
	{/if}

	<div class="mt-3 w-full">
		<!-- Hộp chứa các tập phim có thể cuộn -->
		<div class="max-w-5xl mx-auto overflow-y-auto">
			<div class="h-auto overflow-y-auto p-4">
				<p class="text-lg font-bold pb-3 pl-5">Danh sách tập</p>
				<div class="flex flex-wrap gap-2 pl-5">
					{#each data.episode as ep}
						<div class="flex">
							<button
								class="bg-zinc-600 text-white py-2 px-4 rounded hover:bg-zinc-800 w-12 text-sm"
								class:bg-zinc-800={selectedEpisode === ep.link_embed}
								on:click={() => changeEpisode(ep.link_embed, ep.name)}
							>
								{ep.name}
							</button>
						</div>
					{/each}
				</div>
			</div>
		</div>
	</div>
	<!-- Phần bình luận -->
	<div class="mb-6 mt-3 w-2/3 mx-auto">
		<h2 class="text-lg font-bold pb-3 text-yellow-400">Bình luận</h2>
		<!-- Danh sách bình luận -->
		{#if data.comment && data.comment.length > 0}
			{#each data.comment as comment}
			<div class="mb-4 p-4 bg-zinc-800 rounded shadow flex flex-col">
				<div class="flex justify-between items-center mb-3">	
					<div class="flex items-center gap-3">
						<div class="rounded-full overflow-hidden border border-sky-500">
							<Avatar {supabase} url={comment.avatar_url} />
						</div>
						<div>
							<p class="text-base font-medium text-sky-400">
								{comment.full_name}
							</p>
							<p class="text-xs text-gray-400">
								{comment.created_at && !isNaN(Date.parse(comment.created_at))
									? new Date(comment.created_at).toLocaleDateString('vi-VN')
									: 'Ngày không xác định'}
							</p>
							<p class="text-gray-300">
								{comment.comment}
							</p>
						</div>						
					</div>
					{#if !data.session || comment.user_id !== data.session?.user.id}
						<button
							class="bg-red-500 text-white text-sm py-1 px-3 rounded hover:bg-red-600 transition focus:outline-none"
							on:click={() => reportComment(comment)}
						>
							Báo cáo
						</button>
					{/if}
				</div>
			</div>
			{/each}
		{:else}
			<p class="text-gray-500 text-center">
				Chưa có bình luận nào. Hãy là người đầu tiên bình luận!
			</p>
		{/if}

		<div class="mt-4">
			<textarea
				class="w-full p-2 border rounded mb-2 bg-zinc-700 text-white"
				placeholder="Nhập bình luận của bạn..."
				bind:value={comment}
			></textarea>
			<button
				class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-800 w-full sm:w-auto"
				on:click={() => {
					addComment();
				}}
			>
				Gửi bình luận
			</button>
		</div>
	</div>
</div>

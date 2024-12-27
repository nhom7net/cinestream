<script lang="ts">
	import { Paginator, type PaginationSettings } from '@skeletonlabs/skeleton';
	import Avatar from '$lib/Avatar.svelte';

	export let data;

	let source = [];
	$: source = data?.comments ?? [];

	let { supabase } = data;
	$: ({ supabase } = data);

    let searchUsername = '';
    let searchComment = '';
	let btnCommentReported = false;

    let filteredData = [];
    $: filteredData = source.filter((comment) => {
        const filterUsername = comment.username.toLowerCase().includes(searchUsername.toLowerCase());
        const filterComment = comment.comment.toLowerCase().includes(searchComment.toLowerCase());
		const commentReported = btnCommentReported ? comment.report === true : true;

        return filterUsername && filterComment && commentReported;
    } 
    );

	function toggleReportFilter() {
		btnCommentReported = !btnCommentReported;
	}

	let paginatedData = [];
	let paginationSettings = {
		page: 0,
		limit: 5,
		size: filteredData.length,
		amounts: [5, 10, 15, 20]
	} satisfies PaginationSettings;

	// Cập nhật lại paginationSettings khi filteredData thay đổi
	$: paginationSettings.size = filteredData.length;

	$: paginatedData = filteredData.slice(
		paginationSettings.page * paginationSettings.limit,
		(paginationSettings.page + 1) * paginationSettings.limit
	);
</script>

<h1 class="text-4xl font-bold mt-7 pl-12">Quản lý bình luận</h1>

<div class="flex mx-12 gap-6 w-full my-6">
	<!-- Search and Filter Section -->
	<div class="card variant-filled-surface p-4 h-fit sticky top-0 w-1/5">
		<form class="space-y-4">
			<p class="h4">Tìm tên/username</p>
			<input 
				type="text" 
				placeholder="Tìm theo username"
				bind:value={searchUsername}
			/>

			<p class="h4">Tìm bình luận</p>
			<input
				type="text" 
				placeholder="Tìm bình luận"
				bind:value={searchComment}
			/>

			<button type="button" class="btn bg-rose-700" on:click={toggleReportFilter}>
				{btnCommentReported ? 'Hiển thị tất cả' : 'Bị báo cáo'}
			</button>
		</form>
	</div>
	<div class="w-[75%]">
		{#if paginatedData.length > 0}
			<!-- Comments Section -->
			<ul class="list space-y-3 w-11/12 pl-6">
				{#each paginatedData as comment}
					<li class="div card p-4 variant-filled-surface flex justify-between">
						<div class="flex gap-3 w-full items-center">
							<div class="rounded-full overflow-hidden">
								<Avatar {supabase} url={comment.avatar_url} />
							</div>							
							<div>
								<p>
									<span class="h3">{comment.full_name}</span>
									<span>@{comment.username}</span>
								</p>
								<p class="text-gray-500 text-xs mt-1">Movie ID: {comment.movie_id}</p>
								<p class="mt-2">{comment.comment}</p>
							</div>
							<div class="ml-auto">
								<form method="POST" action="?/deleteComment">
									<input type="hidden" name="commentId" value={comment.id} />
									<button 
										type="submit" 
										class="bg-red-600 text-white text-sm py-1 px-3 rounded hover:bg-red-700 focus:outline-none">
										Delete
									</button>
								</form>
							</div>
						</div>
					</li>
				{/each}
				<div class="pt-2">
					<Paginator
						bind:settings={paginationSettings}
						showFirstLastButtons={true}
						showPreviousNextButtons={true}
					/>
				</div>
			</ul>
		{:else}
		<p class="text-gray-500 text-center">No comments available.</p>
		{/if}
	</div>
</div>

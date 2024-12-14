<script lang="ts">
	import { Paginator, type PaginationSettings } from '@skeletonlabs/skeleton';

	export let data;

	let source = [];
	$: source = data?.comments ?? [];

    let searchUsername = '';
    let searchComment = '';

    let filteredData = [];
    $: filteredData = source.filter((comment) => {
        const filterUsername = comment.username.toLowerCase().includes(searchUsername.toLowerCase());
        const filterComment = comment.comment.toLowerCase().includes(searchComment.toLowerCase());
        return filterUsername && filterComment;
    }
        
    );

	let paginatedData = [];
	$: paginatedData = filteredData.slice(
		paginationSettings.page * paginationSettings.limit,
		(paginationSettings.page + 1) * paginationSettings.limit
	);

	let paginationSettings = {
		page: 0,
		limit: 5,
		size: filteredData.length,
		amounts: [5, 10, 15, 20]
	} satisfies PaginationSettings;
	$: paginationSettings.size = filteredData.length;
</script>

<h1 class="text-4xl font-bold mt-7 pl-10">Quản lý bình luận</h1>

{#if paginatedData.length > 0}
	<div class="flex flex-row gap-16 pt-10">
		<!-- Search and Filter Section -->
		<section class="space-y-4 pl-10">
			<div>
				<input 
					class="input border border-gray-300 rounded-md px-3 py-2 w-full focus:outline-none focus:ring focus:ring-blue-300" 
					type="text" 
					placeholder="Search username..."
                    bind:value={searchUsername}
				/>
			</div>
            <div>
				<input 
					class="input border border-gray-300 rounded-md px-3 py-2 w-full focus:outline-none focus:ring focus:ring-blue-300" 
					type="text" 
					placeholder="Search comment..."
                    bind:value={searchComment}
				/>
			</div>
			<div class="space-y-2">
				<button type="button" class="btn bg-rose-700">Bị báo cáo</button>
			</div>
		</section>

		<!-- Comments Section -->
		<div class="space-y-4 w-full pr-10">
			{#each paginatedData as comment}
				<article class="card border border-gray-200 shadow-sm rounded-lg p-4 bg-white">
					<div class="flex flex-row justify-between">
						<div>
							<div class="flex flex-row gap-2 items-center text-sm text-amber-500">
								<p class="font-semibold">{comment.full_name}</p>
								<p class="text-gray-400">@{comment.username}</p>
							</div>
							<p class="text-gray-500 text-xs mt-1">Movie ID: {comment.movie_id}</p>
							<p class="mt-2">{comment.comment}</p>
						</div>
						<div>
							<form method="POST" action="?/deleteComment">
								<input type="hidden" name="commentId" value={comment.id} />
								<button 
									type="submit" 
									class="text-red-500 hover:text-red-700 font-medium text-sm">
									Delete
								</button>
							</form>
						</div>
					</div>
				</article>
			{/each}
            <div class="pt-2">
                <Paginator
                    bind:settings={paginationSettings}
                    showFirstLastButtons={true}
                    showPreviousNextButtons={true}
                />
            </div>
		</div>
	</div>
{:else}
	<p class="text-gray-500 text-center">No comments available.</p>
{/if}




<script lang="ts">
	import { ThumbsUp, ThumbsDown } from 'lucide-svelte';
	import { goto } from '$app/navigation';
	import Avatar from '$lib/Avatar.svelte';
	import { onMount, afterUpdate } from 'svelte';

	export let data;

	let { session, supabase } = data;
	$: ({ session, supabase } = data);

	async function addToFavorites() {
		const user = data.session?.user.id; // Lấy thông tin người dùng hiện tại
		if (!user) {
			alert('Bạn cần đăng nhập để thêm phim vào danh sách yêu thích!');
			return;
		}

		try {
			// Kiểm tra xem bộ phim đã có trong danh sách yêu thích của người dùng chưa
			const { data: existingFavorite, error: checkError } = await supabase
				.from('favorites')
				.select('user_id, movie_id')
				.eq('user_id', user)
				.eq('movie_id', data.slug) // Kiểm tra theo movie_id
				.single(); // Lấy một kết quả duy nhất

			if (existingFavorite) {
				alert('Bộ phim này đã có trong danh sách yêu thích của bạn!');
				return; // Nếu bộ phim đã có trong danh sách, không thêm lại
			}
		} catch (error) {
			console.error(error);
		}

		try {
			const { data: insertedData, error } = await supabase
				.from('favorites')
				.insert([{ user_id: user, movie_id: data.slug }]);
		} catch (error) {
			console.error(error);
		}
	}

	const goToMovie = (slug: string, episode: string = '01') => {
		goto(`/watch/${slug}?episode=${episode}`);
	};

	type Comment = {
		id: string; // id là chuỗi
		user_id: string; // user_id là chuỗi
		movie_id: string; // movie_id là chuỗi
		comment: string;
		created_at: string;
		full_name: string;
	};

	let comments: Comment[] = [];
	let comment = ''; // Khai báo biến comment

	// Thêm bình luận
	async function addComment() {
		if (!session?.user.id) {
			alert('Bạn cần đăng nhập để gửi bình luận!');
			return;
		}

		if (!comment.trim()) {
			alert('Bình luận không được để trống!');
			return;
		}

		try {
			const { error } = await supabase.from('comments').insert([
				{
					user_id: session.user.id, // user_id là chuỗi
					movie_id: data.slug, // movie_id là chuỗi
					comment,
					created_at: new Date().toISOString()
				}
			]);

			if (error) {
				console.error('Error adding comment:', error.message);
				alert('Không thể gửi bình luận!');
			} else {
				alert('Bình luận của bạn đã được gửi!');
				comment = ''; // Xóa nội dung ô nhập liệu
				await fetchComments(); // Gọi lại hàm fetchComments sau khi thêm bình luận
			}
		} catch (error) {
			console.error(error);
		}
	}

	// Hàm lấy bình luận từ Supabase
	async function fetchComments() {
		try {
			if (!data.slug) {
				console.error('Movie slug is missing!');
				return;
			}

			const { data: fetchedComments, error } = await supabase
				.from('comments')
				.select('id, user_id, movie_id, comment, created_at, ...profiles(full_name, avatar_url)')
				.eq('movie_id', data.slug);

			console.log('Fetched Comments:', fetchedComments);
			if (error) {
				console.error('Error fetching comments:', error.message);
			} else {
				comments = fetchedComments; // Gán bình luận vào biến comments
			}
		} catch (error) {
			console.error('Error:', error);
		}
	}
	onMount(() => {
		fetchComments(); // Gọi hàm khi component được render
		fetchLikes();
		fetchDisLikes();
	});
	afterUpdate(() => {
		if (data.slug) {
			fetchComments(); // Gọi lại fetchComments khi data.slug thay đổi
			fetchLikes();
			fetchDisLikes();
		}
	});

	async function reportComment(comment: Comment) {
		// Kiểm tra nếu người dùng chưa đăng nhập
		if (!session?.user.id) {
			alert('Bạn cần đăng nhập để báo cáo bình luận!');
			return;
		}

		// Kiểm tra nếu người dùng cố báo cáo bình luận của chính mình
		if (comment.user_id === session.user.id) {
			alert('Bạn không thể báo cáo bình luận của chính mình!');
			return;
		}

		try {
			// Cập nhật cột report trong bảng comments
			const { error } = await supabase
				.from('comments')
				.update({ report: true }) // Đặt giá trị report là true
				.eq('id', comment.id); // Sử dụng comment.id để xác định bình luận

			if (error) {
				console.error('Error reporting comment:', error.message);
				alert('Không thể báo cáo bình luận!');
			} else {
				alert('Bình luận đã được báo cáo thành công!');
				// Cập nhật lại danh sách bình luận
				await fetchComments();
			}
		} catch (error) {
			console.error('Error:', error);
		}
	}

	//Đánh giá
	let isLiked = false;
	let isDisLiked = false;
	let likesCount = 0;
	let dislikesCount = 0;
	let userId = session?.user.id;
	let movieId = data.slug;

	onMount(async () => {
		if (!userId) return;

		// Kiểm tra trạng thái like
		const { data: likeData, error } = await supabase
			.from('likes')
			.select('likes')
			.eq('movie_id', movieId)
			.eq('user_id', userId)
			.single();

		if (error) {
			console.error('Lỗi khi kiểm tra trạng thái like:', error.message);
		} else {
			isLiked = likeData?.likes || false; // Cập nhật trạng thái like
		}

		// Kiểm tra trạng thái dislike
		const { data: dislikeData, error: dislikeError } = await supabase
			.from('likes')
			.select('dislikes')
			.eq('movie_id', movieId)
			.eq('user_id', userId)
			.single();

		if (dislikeError) {
			console.error('Lỗi khi kiểm tra trạng thái dislike:', dislikeError.message);
		} else {
			isDisLiked = dislikeData?.dislikes || false; // Cập nhật trạng thái dislike
		}

		// Lấy số lượt like và dislike
		fetchLikes();
		fetchDisLikes();
	});

	async function clickLike() {
		if (!userId) {
			alert('Bạn cần đăng nhập để đánh giá phim!');
			return;
		}

		try {
			const { data: existingLike, error: fetchError } = await supabase
				.from('likes')
				.select('id, likes, dislikes')
				.eq('movie_id', movieId)
				.eq('user_id', userId)
				.single();

			if (fetchError && fetchError.code !== 'PGRST116') {
				console.error('Lỗi kiểm tra trạng thái:', fetchError.message);
				alert('Đã xảy ra lỗi khi kiểm tra trạng thái!');
				return;
			}

			if (existingLike) {
				const { error: updateError } = await supabase
					.from('likes')
					.update({
						likes: !existingLike.likes,
						dislikes: false // Tự động hủy dislike
					})
					.eq('id', existingLike.id);

				if (updateError) {
					console.error('Lỗi khi cập nhật like:', updateError.message);
					alert('Đã xảy ra lỗi khi cập nhật trạng thái!');
					return;
				}

				isLiked = !existingLike.likes; // Cập nhật trạng thái giao diện
				isDisLiked = false; // Tắt dislike khi like được kích hoạt
			} else {
				const { error: insertError } = await supabase
					.from('likes')
					.insert([{ movie_id: movieId, user_id: userId, likes: true, dislikes: false }]);

				if (insertError) {
					console.error('Lỗi khi thêm like:', insertError.message);
					alert('Đã xảy ra lỗi khi thêm like!');
					return;
				}

				isLiked = true; // Cập nhật trạng thái giao diện
				isDisLiked = false; // Đảm bảo dislike được hủy
			}
		} catch (error) {
			console.error('Lỗi không mong đợi:', error);
			alert('Đã xảy ra lỗi!');
		}
		fetchLikes();
		fetchDisLikes();
	}

	async function clickDisLike() {
		if (!userId) {
			alert('Bạn cần đăng nhập để đánh giá phim!');
			return;
		}

		try {
			const { data: existingLike, error: fetchError } = await supabase
				.from('likes')
				.select('id, likes, dislikes')
				.eq('movie_id', movieId)
				.eq('user_id', userId)
				.single();

			if (fetchError && fetchError.code !== 'PGRST116') {
				console.error('Lỗi kiểm tra trạng thái:', fetchError.message);
				alert('Đã xảy ra lỗi khi kiểm tra trạng thái!');
				return;
			}

			if (existingLike) {
				const { error: updateError } = await supabase
					.from('likes')
					.update({
						dislikes: !existingLike.dislikes,
						likes: false // Tự động hủy like
					})
					.eq('id', existingLike.id);

				if (updateError) {
					console.error('Lỗi khi cập nhật dislike:', updateError.message);
					alert('Đã xảy ra lỗi khi cập nhật trạng thái!');
					return;
				}

				isDisLiked = !existingLike.dislikes; // Cập nhật trạng thái giao diện
				isLiked = false; // Tắt like khi dislike được kích hoạt
			} else {
				const { error: insertError } = await supabase
					.from('likes')
					.insert([{ movie_id: movieId, user_id: userId, likes: false, dislikes: true }]);

				if (insertError) {
					console.error('Lỗi khi thêm dislike:', insertError.message);
					alert('Đã xảy ra lỗi khi thêm dislike!');
					return;
				}

				isDisLiked = true; // Cập nhật trạng thái giao diện
				isLiked = false; // Đảm bảo like được hủy
			}
		} catch (error) {
			console.error('Lỗi không mong đợi:', error);
			alert('Đã xảy ra lỗi!');
		}
		fetchLikes();
		fetchDisLikes();
	}

	// Fetch like count
	const fetchLikes = async () => {
		const { data: localData, error } = await supabase
			.from('likes')
			.select('movie_id')
			.eq('likes', true)
			.eq('movie_id', data.slug);

		if (error) {
			console.error('Error fetching likes:', error);
			return;
		}

		likesCount = localData ? localData.length : 0;
	};

	// Fetch dislike count
	const fetchDisLikes = async () => {
		try {
			const { data: localData, error } = await supabase
				.from('likes')
				.select('movie_id')
				.eq('dislikes', true)
				.eq('movie_id', data.slug);

			if (error) {
				console.error('Error fetching dislikes:', error);
				return;
			}

			dislikesCount = localData ? localData.length : 0;
		} catch (error) {
			console.error('Error fetching dislikes:', error);
		}
	};
</script>

<div class="px-44">
	<h1 class="pt-10 pb-5 text-3xl font-bold text-center text-orange-400">{data.origin_name}</h1>

	<div class="mb-6 flex items-center space-x-4">
		<img src={data.poster} alt={data.name} class="w-52 h-80 rounded-md" />

		<div class="flex flex-col pl-10 h-80">
			<p class="text-xl font-bold mb-2">{data.name}</p>
			<div class="flex items-center mb-2">
				<h2 class="text-base font-bold mr-4">Thể loại:</h2>
				<div class="flex flex-wrap space-x-4">
					{#each data.category as cat}
						<p class="bg-gray-200 text-black px-2 py-1 rounded text-sm ml-7">
							{cat.name}
						</p>
					{/each}
				</div>
			</div>
			<div class="flex items-center mb-2">
				<h2 class="text-base font-bold mr-4">Quốc gia:</h2>
				<div class="flex flex-wrap space-x-4">
					{#each data.country as country}
						<p class="bg-gray-200 text-black px-2 py-1 rounded text-sm ml-5">
							{country.name}
						</p>
					{/each}
				</div>
			</div>
			<div class="flex">
				<h2 class="text-base font-bold mr-4">Trạng thái:</h2>
				<p class="font-bold mb-2 text-base ml-3">{data.episode_current}</p>
			</div>
			<div class="flex">
				<h2 class="text-base font-bold mr-4 flex">Thời lượng:</h2>
				<p class="text-base font-bold mb-2 ml-1">{data.time}</p>
			</div>
			<div class="flex">
				<h2 class="text-base font-bold mr-4 flex">Chất lượng:</h2>
				<p class="text-base font-bold mb-2 ml-1">{data.quality}</p>
			</div>
			<div class="flex">
				<h2 class="text-base font-bold mr-4 flex">Đánh giá:</h2>
				<div class="text-base font-bold mr-4 flex">
					<button
						class="flex items-center space-x-2 h-1/2 {isLiked ? 'text-red-500' : ''}"
						on:click={clickLike}
					>
						<ThumbsUp size="24" />
						<span>{likesCount}</span>
						<span>Lượt</span>
					</button>

					<button
						class="flex items-center space-x-2 h-1/2 {isDisLiked ? 'text-red-500' : ''}"
						on:click={clickDisLike}
					>
						<ThumbsDown size="24" />
						<span>{dislikesCount}</span>
						<span>Lượt</span>
					</button>
				</div>
			</div>

			<div class="flex space-x-4">
				<button
					class="bg-red-500 text-white rounded hover:bg-red-700 w-22 h-10"
					on:click={() => goToMovie(data.slug, data.episode.name)}>Xem phim</button
				>
        
				<button
					class="bg-yellow-500 text-white rounded hover:bg-yellow-700 w-22 h-10"
					on:click={addToFavorites}
				>
					Yêu thích
				</button>
			</div>
		</div>
	</div>

	<div class="heading">
		<h4 class="text-lg font-bold mb-4">Nội dung</h4>
		<p class="text-base">{data.content}</p>
	</div>

	<div class="mb-6 mt-3 w-full">
		<!-- Hộp chứa các tập phim có thể cuộn -->
		<div class="h-auto overflow-y-auto">
			<p class="text-lg font-bold mr-4 flex pb-3">Danh sách tập</p>
			<div class="flex flex-wrap justify-start gap-2">
				{#each data.episode as ep}
					<div class="flex">
						<button
							class="bg-zinc-600 text-white py-2 px-4 rounded hover:bg-zinc-800 w-12 text-sm"
							on:click={() => {
								goToMovie(data.slug, ep.name);
							}}
						>
							{ep.name}
						</button>
					</div>
				{/each}
			</div>
		</div>
	</div>
  
	<!-- Phần bình luận -->
	<h2 class="text-lg font-bold pb-3 text-yellow-400">Bình luận</h2>
	<!-- Danh sách bình luận -->
	<div class="comments-list mb-4">
		{#if comments.length > 0}
			{#each comments as comment}
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
							<!-- Nút báo cáo -->
						{#if comment.user_id !== session?.user.id}
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
			<p class="text-gray-500 text-center">Chưa có bình luận nào. Hãy là người đầu tiên bình luận!</p>
		{/if}
	</div>

	<!-- Ô nhập liệu -->
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

<script>
	import { MessagesSquare, UsersRound } from 'lucide-svelte';
</script>

<h2 class="font-bold mt-7 pl-10">Admin Panel: Quản lý</h2>
<br />
<div
	class="bigbutton flex w-full justify-center gap-6 [&>*]:btn [&>*]:variant-filled-surface"
>
	<a href="/admin/user">
		<UsersRound size={64} />
		<p>Người dùng</p>
	</a>

	<a href="/admin/comment">
		<MessagesSquare size={64} />
		<p>Bình luận</p>
	</a>
</div>

<style>
	.bigbutton > a {
		display: flex;
        flex-direction: column;
		align-items: center;
		padding: 42px 0;
        width: 24%;
	}
</style>

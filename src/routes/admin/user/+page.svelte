<script lang="ts">
	import Avatar from '$lib/Avatar.svelte';
	import {
		getDrawerStore,
		Paginator,
		type DrawerSettings,
		type PaginationSettings
	} from '@skeletonlabs/skeleton';
	import type { PageData } from './$types';
	import { UserRoundCog } from 'lucide-svelte';

	export let data: PageData;

	let { session, supabase, profiles } = data;
	$: ({ session, supabase, profiles } = data);

	// all of the filters
	let searchQuery: string = '';
	let roles: number = 0;

	let filtered: Array<(typeof profiles)[number]> = [];
	let paginatedSource: Array<(typeof profiles)[number]> = [];

	$: filtered = profiles.filter((data) => {
		const username = data.username.toLowerCase().includes(searchQuery.toLowerCase());
		const fullName = data.full_name.toLowerCase().includes(searchQuery.toLowerCase());

		if (roles === 0) return username || fullName;
		if (roles === -1) return (username || fullName) && data.isBanned;

		let admin: boolean = false;
		switch (roles) {
			case 1:
				admin = !data.isAdmin;
				break;
			case 2:
				admin = data.isAdmin;
				break;
		}

		return (username || fullName) && admin;
	});

	let paginationSettings = {
		page: 0,
		limit: 6,
		size: filtered.length,
		amounts: [6, 10, 20, 30]
	} satisfies PaginationSettings;

	$: filtered,
		(paginatedSource = filtered.slice(
			paginationSettings.page * paginationSettings.limit,
			paginationSettings.page * paginationSettings.limit + paginationSettings.limit
		)),
		(paginationSettings.size = filtered.length);

	// drawer for user infomation
	const drawerStore = getDrawerStore();
	const drawerSettings: DrawerSettings = {
		id: 'user-info',
		width: 'w-[280px] md:w-[480px]',
		padding: 'p-4',
		rounded: 'rounded-xl',
        position: 'right',
		meta: { id: '' }
	};

	function openDialog(id: string) {
        drawerSettings.meta.id = id;
		drawerStore.open(drawerSettings);
	}
</script>

<h1 class="text-4xl font-bold mt-7 pl-10">Quản lý người dùng</h1>

<div class="flex mx-12 gap-6 w-full my-6">
	<div class="card variant-filled-surface p-4 h-fit sticky top-0">
		<form class="space-y-4">
			<p class="h4">Tìm tên/username</p>
			<input
				type="text"
				name="query"
				id="query"
				placeholder="Tìm theo tên"
				bind:value={searchQuery}
			/>

			<p class="h4">Quyền</p>
			<div class="space-y-2">
				<label class="flex items-center space-x-2">
					<input name="roles" type="radio" bind:group={roles} value={0} />
					<p>Tất cả</p>
				</label>
				<label class="flex items-center space-x-2">
					<input name="roles" type="radio" bind:group={roles} value={1} />
					<p class="badge variant-filled-tertiary">Thành viên</p>
				</label>
				<label class="flex items-center space-x-2">
					<input name="roles" type="radio" bind:group={roles} value={-1} />
					<span class="badge variant-filled-error">Bị chặn</span>
				</label>
				<label class="flex items-center space-x-2">
					<input name="roles" type="radio" bind:group={roles} value={2} />
					<p class="badge variant-filled-primary">Quản trị viên</p>
				</label>
			</div>
		</form>
	</div>
	<div class="w-[69%]">
		{#if filtered.length > 0}
			<ul class="list space-y-3 w-full">
				{#each paginatedSource as profile}
					<li class="div card p-4 variant-filled-surface flex justify-between">
						<div class="flex gap-3">
							<!-- General Info -->
							<Avatar {supabase} url={profile.avatar_url} />
							<div>
								<p>
									<span class="h3">{profile.full_name}</span>
									<span>@{profile.username}</span>
								</p>
								{#if profile.isAdmin}
									<span class="badge variant-filled-primary">Quản trị viên</span>
								{:else if profile.isBanned}
									<span class="badge variant-filled-error">Bị chặn</span>
								{:else}
									<span class="badge variant-filled-tertiary">Thành viên</span>
								{/if}
							</div>
						</div>
						<!-- Action buttons -->
						<div>
							<button class="variant-ghost-tertiary" on:click={() => openDialog(profile.id)}><UserRoundCog /></button>
						</div>
					</li>
				{/each}
			</ul>
			<br />
			<Paginator bind:settings={paginationSettings} showPreviousNextButtons={true} />
		{:else}
			<p class="text-center">Không có kết quả</p>
		{/if}
	</div>
</div>

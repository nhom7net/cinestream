<script lang="ts">
	import { getToastStore, Tab, TabGroup } from '@skeletonlabs/skeleton';
	import type { ActionData } from './$types.js';

	import Login from './templates/Login.svelte';
	import Register from './templates/Register.svelte';
	import { TvMinimalPlay } from 'lucide-svelte';
	import ArcaneLogo from '$lib/assets/arcane-logo.png';

	const toastStore = getToastStore();
	const showToast = (success: boolean | undefined, message: string | undefined) => {
		if (!message || success == undefined) return;
		toastStore.trigger({
			message: message,
			hideDismiss: true,
			background: success ? 'variant-filled-success' : 'variant-filled-primary'
		});
	};

	let tabSet: number = 0;
	export let form: ActionData;
	$: form, showToast(form?.success, form?.message);
</script>

<div class="!bg-[url($lib/assets/arcane-cover.jpg)] h-full bg-cover">
	<div class="flex flex-col justify-between w-1/3 h-full variant-filled-surface">
		<div>
			<div class="py-2" />
			<div class="flex justify-center">
				<TabGroup>
					<Tab bind:group={tabSet} name="tab2" value={0}>Đăng nhập</Tab>
					<Tab bind:group={tabSet} name="tab3" value={1}>Đăng ký</Tab>
					<svelte:fragment slot="panel">
						{#if tabSet === 0}
							<Login {form} />
						{:else if tabSet === 1}
							<Register {form} />
						{/if}
					</svelte:fragment>
				</TabGroup>
			</div>
		</div>
		<div class="bg-slate-600 m-6 p-6 rounded-xl">
			<div class="flex justify-between items-center">
				<img src={ArcaneLogo} alt="Arcane Logo" class="h-12 w-auto" />
				<div class="text-right">
					<h3 class="h3">Arcane</h3>
					<p>Ra mắt mùa 2</p>
				</div>
			</div>
			<div class="py-2"></div>
			<a
				href="/details/arcane-lien-minh-huyen-thoai-phan-2"
				class="btn variant-filled-primary w-full flex justify-evenly"
				><TvMinimalPlay />Xem ngay tại CineStream</a
			>
		</div>
	</div>
</div>

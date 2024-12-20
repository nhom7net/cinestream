<script lang="ts">
    export let data;

    let selectedEpisode: string = "";

    $: {
        if (data.episode.length > 0) {
            selectedEpisode = data.episode[data.episode.length - 1].link_embed;
        }
    }

    function changeEpisode(episodeLink: string) {
        selectedEpisode = episodeLink;
    }
</script>

<h1 class="pt-10 pb-5 text-3xl font-bold text-orange-400 pl-64">{data.name}</h1>
<div class="flex flex-col items-center">
    {#if selectedEpisode}
        <!-- svelte-ignore a11y-missing-attribute -->
        <iframe src={selectedEpisode} width="960" height="540" frameborder="0" allowfullscreen></iframe>
    {:else}
    <p>Không có tập phim nào để phát.</p>
    {/if}

    <div class="mb-6 mt-3 w-full">
        <!-- Hộp chứa các tập phim có thể cuộn -->
        <div class="w-full max-w-5xl mx-auto">
            <div class="h-auto overflow-y-auto p-4">
                <p class="text-lg font-bold mr-4 flex pb-3 pl-5">Danh sách tập</p>
                <div class="flex flex-wrap justify-start gap-2 pl-5">
                    {#each data.episode as ep}
                        <div class="flex">
                            <button
                                class="bg-zinc-600 text-white py-2 px-4 rounded hover:bg-zinc-800 w-12 text-sm"
                                class:bg-zinc-800={selectedEpisode === ep.link_embed}
                                on:click={() => changeEpisode(ep.link_embed)}
                            >
                                {ep.name}
                            </button>
                        </div>
                    {/each}
                </div>
            </div>
        </div>
    </div>    
</div>
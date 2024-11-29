<script lang="ts">
    import { ImageHelper } from '$lib/SupabaseImageHelper';
    import { getToastStore } from '@skeletonlabs/skeleton';
    import type { SupabaseClient } from '@supabase/supabase-js';
    import { createEventDispatcher } from 'svelte';

    export let supabase: SupabaseClient;
    export let url: string | undefined;

    let uploading = false;
    let files: FileList;

    let imageUpload = new ImageHelper(supabase);
    let dispatch = createEventDispatcher();
    const toastStore = getToastStore();

    async function uploadAvatar() {
        try {
            toastStore.trigger({
                message: 'Vui lòng đợi...',
                background: 'variant-filled-warning',
                hideDismiss: true
            });
            uploading = true;
            url = await imageUpload.uploadImage(files, 'avatars');
            setTimeout(() => {
                dispatch('upload');
            }, 200);
        } catch (error) {
            if (error instanceof Error) {
                alert(error.message);
            }
        } finally {
            uploading = false;
        }
    }
</script>

<input
    class="!bg-transparent"
    type="file"
    id="single"
    accept="image/*"
    bind:files
    on:change={uploadAvatar}
    disabled={uploading}
/>
<input type="hidden" name="avatarUrl" value={url} />
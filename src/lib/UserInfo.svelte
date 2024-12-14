<script lang="ts">
	import type { SupabaseClient } from "@supabase/supabase-js";

    export let supabase: SupabaseClient;
    export let userid: string;
</script>

<div class="p-2">
    <p>This panel is to manage user id {userid}</p>
</div>
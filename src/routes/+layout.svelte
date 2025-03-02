<script lang="ts">
	import { Toaster } from '$lib/components/ui/sonner/index.js';
	import { invalidate } from '$app/navigation';
	import { onMount } from 'svelte';
	import '../app.css';

	import { ModeWatcher } from 'mode-watcher';
	import PageLoader from '$lib/components/page-loader.svelte';

	let { data, children } = $props();
	let { supabase, session } = $state(data);

	$effect(() => {
		({ supabase, session } = data);
	});

	onMount(() => {
		const { data } = supabase.auth.onAuthStateChange((event, newSession) => {
			if (newSession?.expires_at !== session?.expires_at) {
				invalidate('supabase:auth');
			}
		});

		return () => data.subscription.unsubscribe();
	});
</script>

<ModeWatcher />
<Toaster richColors />

{@render children()}

<PageLoader />

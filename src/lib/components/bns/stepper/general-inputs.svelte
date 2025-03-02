<script lang="ts">
	import Input from '$lib/components/ui/input/input.svelte';
	import Label from '$lib/components/ui/label/label.svelte';
	// let { canBook = true }: { canBook?: boolean } = $props();
</script>

<div class="flex space-x-2 pb-8">
	<div class="w-full space-y-2">
		<Label for="rate">Rate/Price Range</Label>
		<Input id="rate" name="rate" type="number" placeholder="e.g., ₱0 - ₱200" />
	</div>
	<div class="w-full space-y-2">
		<Label for="basis">Basis</Label>
		<Input id="basis" name="basis" type="text" placeholder="Per Night / Hour / Person / Service" />
	</div>
</div>

<script lang="ts">
	import { selectedSubCategory } from './stepSteps.svelte';
	import { AllSubCategories } from './forms';

	let comp: any = $state(null);
	let index: number | null = $state(null);

	$effect(() => {
		try {
			if (!selectedSubCategory.value) return;
			const value = selectedSubCategory.value.replaceAll(' ', '');
			index = AllSubCategories.findIndex((v) => v.name === value);
			comp = AllSubCategories[index];
		} catch (error) {
			index = null;
		}
	});
</script>

{#if index !== null}
	<comp.component />
{/if}

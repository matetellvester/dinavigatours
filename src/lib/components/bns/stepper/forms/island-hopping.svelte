<script lang="ts">
	// import Checkbox from '$lib/components/ui/checkbox/checkbox.svelte';
	// import Input from '$lib/components/ui/input/input.svelte';
	// import Label from '$lib/components/ui/label/label.svelte';
	// import GeneralInputs from '../general-inputs.svelte';
	import GroupOptionSelector from '../group-option-selector.svelte';
	// import { makeNameAttribute } from '$lib/utils';
	// import { type AllSubCategories } from './types';
	// const type: AllSubCategories = 'IslandHopping';
	// const [name] = makeNameAttribute(type);
	// let checked = $state(false);
	// let checked2 = $state(false);
</script>

<div class="rounded-xl border bg-muted/10 p-8">
	<h1 class="mb-10 text-2xl font-bold">Add Island Hopping Details</h1>
	<GroupOptionSelector />
</div>

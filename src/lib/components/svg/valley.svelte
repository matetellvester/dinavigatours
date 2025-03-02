<script lang="ts">
	import { cn } from '$lib/utils';

	let { class: className }: { class?: string } = $props();
</script>

<svg
	class={cn(className)}
	xmlns="http://www.w3.org/2000/svg"
	viewBox="0 0 48 48"
	width="480"
	height="480"
>
	<rect width="46" height="16" x="1" y="31" fill="#4caf50" />
	<polygon fill="#8d6e63" points="47,31 47,18.65 43.222,12 38.5,21.5 36.611,18.65 30,31" />
	<path
		fill="#4fc3f7"
		d="M25,31c1,0,5.331,3.314,2,8c-2.834,3.986,3,8,3,8H17c0,0-1.506-4.697,4-8c5-3,2-8,2-8H25z"
	/>
	<polygon fill="#8d6e63" points="19,31 11.421,14.192 9.526,15.962 4.789,8 1,15.962 1,31" />
	<path fill="#ff9800" d="M25.807,3.994h9.6v9.6h-9.6V3.994z" />
	<path fill="#ff9800" d="M30.607,2.006l6.787,6.788l-6.787,6.788l-6.788-6.788L30.607,2.006z" />
	<path
		fill="#ffeb3b"
		d="M30.607,6.394c-1.325,0-2.4,1.075-2.4,2.4s1.075,2.4,2.4,2.4c1.325,0,2.4-1.075,2.4-2.4S31.933,6.394,30.607,6.394z"
	/>
</svg>

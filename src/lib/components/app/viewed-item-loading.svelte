<script lang="ts">
	import { Skeleton } from '$lib/components/ui/skeleton/index.js';
</script>

<div>
	<div class="px-5">
		<Skeleton class="h-10 w-[80%]" />
		<div class="flex items-center text-lg max-md:text-sm">
			<Skeleton class="mt-3 h-8 w-20" />
			<Skeleton class="ml-2 mt-3 h-8 w-24" />
			<Skeleton class="ml-auto mt-3 h-8 w-20 " />
		</div>
		<Skeleton class="mt-4 h-12 w-full" />
		<Skeleton class="mt-4 h-64 w-full" />

		<div class="flex items-center space-x-2">
			<Skeleton class="mt-4 h-8 w-2" />
			<Skeleton class="mt-4 h-8 w-32" />
		</div>

		<Skeleton class="mt-4 h-64 w-full ring-1" />
		<Skeleton class="mt-4 h-8 w-[80%]" />
		<Skeleton class="mt-4 h-8 w-full" />
		<Skeleton class="mt-4 h-8 w-[85%]" />
		<Skeleton class="mt-4 h-8 w-[50%]" />
	</div>

	<div class="fixed bottom-0 flex w-full border-t-2 bg-background px-5 py-4">
		<div class="flex w-full space-x-4">
			<Skeleton class="h-10 w-full rounded-md" />
			<Skeleton class="h-10 w-full rounded-md" />
		</div>
	</div>
</div>

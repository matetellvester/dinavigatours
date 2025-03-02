<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import Bed from '$lib/components/svg/bed.svelte';
	import { Images, Pencil, PhilippinePeso, Plus, Trash2, Users } from 'lucide-svelte';
	import RoomAdder from '../room-adder.svelte';
	import { getContext, tick } from 'svelte';
	import { rooms, currRoom } from '$bns-route/b/list/new/index.svelte';
	import { fade } from 'svelte/transition';
	import { getThumbnail } from '$lib/utils';

	type Room = (typeof rooms.val)[number];

	let add = $state(false);
</script>

<div class="mx-auto max-w-4xl space-y-6 rounded-xl border bg-muted/50 p-8">
	<h1 class="text-2xl font-bold">Add Rooms and Details</h1>

	{#if rooms.val.length < 1}
		<div
			in:fade
			class="flex items-center justify-center rounded-xl border-2 border-dashed bg-background py-8"
		>
			<div>
				<Bed class="size-32 place-self-center" />
				<div class="mt-4 block text-center">
					<span class=" text-center font-semibold text-muted-foreground"> Add rooms </span>
					<span class=" block text-center text-sm font-semibold text-muted-foreground">
						No rooms added yet. Click below to start.
					</span>
				</div>
			</div>
		</div>
	{/if}

	<div class="space-y-4">
		{#each rooms.val as aRoom}
			{@render room(aRoom)}
		{/each}
	</div>
	<div class="z-10 flex">
		<Button
			size="sm"
			type="button"
			class="ml-auto"
			onclick={() => {
				add = true;
			}}
		>
			<Plus />
			<span> Add Room </span>
		</Button>
	</div>
</div>

<RoomAdder bind:open={add} />

{#snippet room(room: Room)}
	<div class="group/room relative rounded-xl bg-background p-4 hover:shadow-md" in:fade>
		<!-- Buttons -->
		<div
			class="absolute bottom-0 right-0 flex items-center space-x-2 rounded-br-xl rounded-tl-xl bg-background/70 p-4 opacity-0 transition-opacity group-hover/room:opacity-100"
		>
			<button
				type="button"
				title="edit this"
				onclick={async () => {
					currRoom.room = room;
					await tick();
					add = true;
				}}
			>
				<Pencil class="size-5" />
			</button>

			<button
				onclick={() => rooms.remove(room.id)}
				type="button"
				title="remove this"
				class="text-destructive"
			>
				<Trash2 class="size-5" />
			</button>
		</div>

		<!-- Contents -->
		<div class="grid grid-cols-3 gap-4 divide-x">
			<!-- COL 1 -->
			<div>
				<div class="block font-poppins text-xl font-semibold">{room.info.name}</div>
				<div class="block font-poppins text-sm font-semibold text-muted-foreground">
					{room.info.type}
				</div>

				<!-- Capacity, Price -->
				<div class="mt-2 flex space-x-4 text-sm">
					<div class="flex items-center space-x-1">
						<Users class="size-4 text-muted-foreground" />
						<span class="font-semibold">{room.info.capacity}</span>
					</div>
					<div class="flex items-center space-x-1">
						<PhilippinePeso class="size-4 text-muted-foreground" />
						<span class="font-semibold">{room.info.price}</span>
					</div>
				</div>
			</div>

			<!-- COL 2 -->
			<div class="px-4">
				<div class="block font-poppins font-semibold">Beds</div>

				<div class="flex flex-wrap gap-1">
					{#each Object.entries(room.beds) as [key, value]}
						{#if value}
							{@render item(key)}
						{/if}
					{/each}
				</div>
			</div>

			<!-- COL 3 -->
			<div class="overflow-hidden px-4">
				<div class="block font-poppins font-semibold">Facilities</div>
				<div class="gap-1 pl-2">
					{#each room.amenities as amenity}
						<!-- {@render item(amenity)} -->

						<li class="leading-5">{amenity}</li>
					{:else}
						<i class="text-muted-foreground">No amenities added</i>
					{/each}
				</div>
			</div>
		</div>
	</div>
{/snippet}

{#snippet item(name: string)}
	<div class="w-max rounded-sm border px-1 py-0.5 text-xs capitalize">{name}</div>
{/snippet}

<script lang="ts">
	import { fade, fly, scale } from 'svelte/transition';
	import { Images, X } from 'lucide-svelte';
	import Input from '$lib/components/ui/input/input.svelte';
	import Label from '$lib/components/ui/label/label.svelte';
	import { Button } from '$lib/components/ui/button';
	import { quadInOut } from 'svelte/easing';
	import { tick } from 'svelte';
	import ButtonToggle from './button-toggle.svelte';
	// import MediaAdder_2 from './media-adder-2.svelte';
	import { rooms, currRoom } from '$bns-route/b/list/new/index.svelte';

	interface Props {
		open: boolean;
		/**
		 * Kung naay id, ang room is pa update sa store instead na e add
		 */
		id?: string | null;
	}

	let { open = $bindable(false), id = $bindable(null) }: Props = $props();

	let media: {
		src: string;
		name: string;
		copyright: string;
		desp: string;
		path: string;
		isThumbnail: boolean;
		file: File;
		type: 'image' | 'video';
	}[] = $state([]);

	let amenities: string[] = $state([]);

	let basicInfo = $state({
		name: '',
		type: '',
		capacity: '',
		price: ''
	});

	let beds = $state({
		single: false,
		double: false,
		king: false,
		queen: false
	});

	let amenityToAdd = $state('');

	function resetValues() {
		media = [];
		amenities = [];
		basicInfo = {
			name: '',
			type: '',
			capacity: '',
			price: ''
		};
		beds = {
			single: false,
			double: false,
			king: false,
			queen: false
		};
	}

	function removeAmenity(bed: string) {
		const index = amenities.indexOf(bed);

		if (index !== -1) {
			amenities.splice(index, 1);
		}
	}

	function addAmenity() {
		amenities.push(amenityToAdd);
		amenityToAdd = '';
	}

	function handleEnter(event: KeyboardEvent) {
		if (
			event.key === 'Enter' &&
			!event.shiftKey &&
			!event.ctrlKey &&
			!event.altKey &&
			!event.metaKey
		) {
			event.preventDefault();

			if (!amenityToAdd.trim()) return;

			addAmenity();
		}
	}

	async function addRoom() {
		const room = { info: basicInfo, beds, amenities, media };

		if (currRoom.room.id) {
			rooms.update(currRoom.room.id, room);
			currRoom.reset();
		} else {
			rooms.add(room);
		}

		await tick();
		open = false;

		resetValues();
	}

	$effect(() => {
		if (open) {
			tick().then(() => {
				if (currRoom.room.id) {
					amenities = currRoom.room.amenities;
					basicInfo = currRoom.room.info;
					beds = currRoom.room.beds;
				}

				document.body.style.pointerEvents = 'none';
				document.body.style.overflow = 'hidden';
			});

			return;
		}

		tick().then(() => {
			document.body.style.pointerEvents = '';
			document.body.style.overflow = '';
		});
	});
</script>

{#if open}
	<div
		transition:fade={{ duration: 200 }}
		class="pointer-events-auto fixed inset-0 z-30 h-screen overflow-hidden bg-foreground/30 backdrop-blur-sm"
	>
		<div
			class="ml-auto h-full max-w-2xl overflow-auto border-l bg-background"
			transition:fly={{ delay: 50, duration: 200, x: 500, y: 0, easing: quadInOut }}
		>
			<div class="sticky top-0 flex w-full gap-2 border-b bg-background p-2">
				<div class="my-auto ml-4 font-poppins font-semibold">
					{currRoom.room.id ? 'Update' : 'Set'} Room Information
				</div>
				<Button
					class="ml-auto"
					size="sm"
					variant="outline"
					type="button"
					onclick={() => {
						open = false;
						currRoom.reset();
						resetValues();
					}}>Discard</Button
				>
				<Button size="sm" type="button" onclick={addRoom}
					>{currRoom.room.id ? 'Update' : 'Add'}</Button
				>
			</div>

			<div class="p-6">
				<div class="mb-4 grid grid-cols-2 gap-2">
					<!-- NAME -->
					<div>
						<Label for="roomName" class="leading-8">Name</Label>
						<Input id="roomName" type="text" placeholder="Room name" bind:value={basicInfo.name} />
					</div>

					<!-- TYPE -->
					<div>
						<Label for="roomType" class="leading-8">Type</Label>
						<Input
							bind:value={basicInfo.type}
							id="roomType"
							type="text"
							placeholder="e.g., Deluxe, Standard, Superior, Suite..."
						/>
					</div>

					<!-- ROOM CAPACITY -->
					<div>
						<Label for="roomMaxCapacity" class="leading-8">Room Capacity</Label>
						<Input
							bind:value={basicInfo.capacity}
							id="roomMaxCapacity"
							type="number"
							placeholder="e.g., 2, 4, 8..."
						/>
					</div>

					<!-- ROOM PRICE -->
					<div>
						<Label for="roomPrice" class="leading-8">Room Price</Label>
						<Input
							bind:value={basicInfo.price}
							id="roomPrice"
							type="number"
							placeholder="e.g., 500, 1000, 1500"
							min="1"
						/>
					</div>
				</div>

				<div class="rounded-xl border p-4">
					<div class="inline-flex space-x-2 font-semibold">Select available bed for this room</div>

					<div class="mt-2">
						<div class="flex space-x-2">
							<ButtonToggle title="Single Bed" name="" bind:pressed={beds.single} />
							<ButtonToggle title="Double Bed" name="" bind:pressed={beds.double} />
							<ButtonToggle title="King Bed" name="" class="ml-2" bind:pressed={beds.king} />
							<ButtonToggle title="Queen Bed" name="" class="ml-2" bind:pressed={beds.queen} />
						</div>
					</div>
				</div>

				<div class="mt-4 rounded-xl border p-4">
					<div class="inline-flex space-x-2 font-semibold">Facilities</div>

					<div class="flex items-center space-x-2">
						<Input
							placeholder="Type here to add, hit enter or click button when you're done. e.g., tv, breakfast, toilet..."
							bind:value={amenityToAdd}
							onkeydown={handleEnter}
						/>
						<Button
							type="button"
							variant="outline"
							disabled={!amenityToAdd.trim()}
							onclick={addAmenity}>Add</Button
						>
					</div>

					<div class="mt-2 flex flex-wrap gap-2">
						{#each amenities as amenity_, i}
							{@render amenity(amenity_, i)}
						{/each}
					</div>
				</div>
				<!-- <div class="mt-4 p-4">
					<div class="mb-4 inline-flex space-x-2 font-semibold">
						<Images /> <span>Add Media</span>
					</div>
					<MediaAdder_2 bind:previewUrls={media} />
				</div> -->
			</div>
		</div>
	</div>
{/if}

{#snippet amenity(name: string, index: number)}
	<div
		in:scale={{ duration: 200 }}
		data-added-bed-index={index + 1}
		class=" flex h-8 w-max items-center rounded-md border text-sm font-semibold hover:border-primary"
	>
		<span class="ml-2 min-w-8">
			{name}
		</span>

		<button
			onclick={() => removeAmenity(name)}
			type="button"
			title="remove this"
			class="ml-1 h-full grow rounded-e-md bg-muted px-1 [&:not(:hover)]:text-foreground/50"
		>
			<X class="size-4" />
		</button>
	</div>
{/snippet}

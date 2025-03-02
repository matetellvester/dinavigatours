<script lang="ts">
	import { Button, buttonVariants } from '$lib/components/ui/button/index.js';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import * as Drawer from '$lib/components/ui/drawer/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import { Loader } from 'lucide-svelte';

	import { isDesktop } from '$lib/hooks/is-mobile.svelte';
	import { Star } from 'lucide-svelte';
	import { toast } from 'svelte-sonner';
	import Textarea from './ui/textarea/textarea.svelte';

	let {
		open = $bindable(false),
		data,
		onDone
	}: {
		open: boolean;
		data: { lstng_id: number | null; booking_id: number | null };
		onDone?: (id: number, rating: number | null) => void;
	} = $props();

	let commentValue: string | null = $state(null);
	let saving = $state(false);
	let rating = $state(0); // Current rating set by the user
	let tempRating = $state(0); // Temporary rating used during hover or drag
	let isDragging = $state(false); // Flag to check if the user is dragging

	function setRating(newRating: number) {
		// Set rating when interaction ends
		rating = newRating;
		tempRating = newRating;
	}

	async function submitRating(e: Event) {
		e.preventDefault;

		if (!data.lstng_id || !data.booking_id) {
			console.error('Walay lstng_id or booking_id');
			return;
		}

		const position = isDesktop.current ? 'bottom-right' : 'top-right';
		try {
			saving = true;

			const res = await fetch('/api/ratings', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					lstng_id: data.lstng_id,
					rating: tempRating,
					booking_id: data.booking_id,
					rating_content: commentValue
				})
			});

			if (!res.ok) {
				console.error('Naay error sa pag save sa rating');
				toast.error(`There was an error while submitting your rating`, {
					position
				});
			}

			if (await saveNewComment()) {
				toast.success('Thank you for your feedback', { position });
				onDone?.(data.booking_id, tempRating);
				commentValue = null;
				open = false;
				tempRating = 0;
				rating = 0;
			} else {
				console.error('Naay error sa pag save sa comment');
				toast.error(`There was an error while submitting your rating`, {
					position
				});
			}
		} catch (error) {
			console.error(error);
			toast.error(`There was an error while submitting your rating`, {
				position
			});
		} finally {
			saving = false;
		}
	}

	async function saveNewComment(): Promise<boolean> {
		try {
			const res = await fetch('api/comment', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ content: commentValue, lstng_id: data.lstng_id })
			});

			if (!res.ok) {
				console.error('Naay error sa mag save og comment');
				return false;
			}

			return true;
		} catch (error) {
			console.error(error);
			return false;
		}
	}
</script>

{#if isDesktop.current}
	<Dialog.Root bind:open>
		<Dialog.Content>
			<form>
				<Dialog.Header>
					<Dialog.Title>How is your experience?</Dialog.Title>
					<Dialog.Description>Please take a moment to rate and review</Dialog.Description>
				</Dialog.Header>
				<div class="grid gap-4 py-4">
					<div
						class="relative col-span-full flex items-center space-x-2 place-self-center"
						onpointerdown={() => (isDragging = true)}
						onpointerup={() => (isDragging = false)}
						onpointerleave={() => isDragging && (tempRating = rating)}
					>
						<input
							value={tempRating < 1 ? null : tempRating}
							required
							type="number"
							class="pointer-events-none absolute inset-0 -z-10 select-none opacity-0 outline-none"
							tabindex="-1"
						/>
						{#each Array.from({ length: 5 }) as _, index}
							<div
								class="cursor-pointer"
								onpointerover={() => (tempRating = index + 1)}
								onpointermove={() => isDragging && (tempRating = index + 1)}
								onpointerup={() => setRating(index + 1)}
							>
								<div
									class={`flex items-center justify-center ${
										index < tempRating
											? 'text-yellow-400 [&>svg]:fill-yellow-400'
											: 'text-muted-foreground'
									}`}
								>
									<Star class="size-8 " />
								</div>
							</div>
						{/each}
					</div>

					<div class="mt-4 grid grid-cols-4 items-center gap-4">
						<Label for="comment" class="sr-only text-right">Review</Label>
						<Textarea
							required
							id="comment"
							bind:value={commentValue}
							class="col-span-full"
							placeholder="Share your thoughts or feedback..."
						/>
					</div>
				</div>
				<Dialog.Footer>
					<Dialog.Close
						type="button"
						disabled={saving}
						class={buttonVariants({ variant: 'outline' })}
					>
						Cancel
					</Dialog.Close>
					<Button
						type="submit"
						disabled={saving || tempRating < 1}
						onclick={(e) => submitRating(e)}
					>
						{#if saving}
							<Loader class="size-4 animate-spin" />
						{/if}
						Submit Rating
					</Button>
				</Dialog.Footer>
			</form>
		</Dialog.Content>
	</Dialog.Root>
{:else}
	<Drawer.Root bind:open>
		<Drawer.Content>
			<form>
				<Drawer.Header class="text-left">
					<Drawer.Title>How is your experience?</Drawer.Title>
					<Drawer.Description>Please take a moment to rate and review</Drawer.Description>
				</Drawer.Header>
				<div class="grid gap-4 px-4 py-4">
					<div
						class="relative col-span-full flex items-center space-x-2 place-self-center"
						onpointerdown={() => (isDragging = true)}
						onpointerup={() => (isDragging = false)}
						onpointerleave={() => isDragging && (tempRating = rating)}
					>
						<input
							value={tempRating < 1 ? null : tempRating}
							required
							type="number"
							class="pointer-events-none absolute inset-0 -z-10 select-none opacity-0 outline-none"
							tabindex="-1"
						/>
						{#each Array.from({ length: 5 }) as _, index}
							<div
								class="cursor-pointer"
								onpointerover={() => (tempRating = index + 1)}
								onpointermove={() => isDragging && (tempRating = index + 1)}
								onpointerup={() => setRating(index + 1)}
							>
								<div
									class={`flex items-center justify-center ${
										index < tempRating
											? 'text-yellow-400 [&>svg]:fill-yellow-400'
											: 'text-muted-foreground'
									}`}
								>
									<Star class="size-8 " />
								</div>
							</div>
						{/each}
					</div>

					<div class="mt-4 grid grid-cols-4 items-center gap-4">
						<Label for="comment" class="sr-only text-right">Review</Label>
						<Textarea
							required
							id="comment"
							bind:value={commentValue}
							class="col-span-full"
							placeholder="Share your thoughts or feedback..."
						/>
					</div>
				</div>
				<Drawer.Footer class="flex flex-row pt-2">
					<Drawer.Close
						disabled={saving}
						class={buttonVariants({ variant: 'outline', className: 'w-full' })}
					>
						Cancel
					</Drawer.Close>
					<Button
						type="submit"
						class="w-full"
						disabled={saving || tempRating < 1}
						onclick={(e) => submitRating(e)}
					>
						{#if saving}
							<Loader class="size-4 animate-spin" />
						{/if}
						<span>Submit Rating</span>
					</Button>
				</Drawer.Footer>
			</form>
		</Drawer.Content>
	</Drawer.Root>
{/if}

<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import * as Avatar from '$lib/components/ui/avatar/index.js';
	import { Skeleton } from '$lib/components/ui/skeleton/index.js';
	import { Textarea } from '$lib/components/ui/textarea/index.js';
	import { getFallbackAvatar, handleLoginRedirect } from '$lib/utils';
	import { format, parseISO } from 'date-fns';
	import { ExternalLink, Loader, MapPin, MessageSquare, Send, Star } from 'lucide-svelte';
	import { onMount, tick } from 'svelte';
	import { fade } from 'svelte/transition';
	import { userLogin } from '../../../routes/(app)/global.app.svelte';
	import FormRenderer from '../form-booking/form-renderer.svelte';
	import ManWithLike from '../svg/man-with-like.svelte';
	import { Button } from '../ui/button';
	import BookingDialog from './booking-dialog.svelte';
	import ViewedCarousel from './viewed-carousel.svelte';
	import ViewedItemLoading from './viewed-item-loading.svelte';
	import ExploreItemContacts from './explore-item-contacts.svelte';
	import ExplorePortInfo from './explore-port-info.svelte';

	type Comment = {
		id: number;
		lstng_id: number;
		user_id: string;
		content: string;
		created_at: string;
		user: {
			last_name: string;
			first_name: string;
		};
	};

	type Rating = {
		id: number;
		user_id: string;
		lstng_id: number;
		rating: number;
		created_at: string;
		booking_id: number;
	};

	type ReturnBasicInfo = Omit<ExploreItem, 'rating' | 'media'> & {
		can_book: boolean;
		branch: string;
	};

	let commentValue = $state('');
	let open = $state(false);

	let commentSubmtting = $state(false);
	let id: null | number = $state(null);
	let basicInfoData: Promise<ReturnBasicInfo> = $state(Promise.resolve({} as ReturnBasicInfo));

	let comments: Comment[] = $state([]);

	$effect(() => {
		open = !!$page.url.searchParams.get('view') && !!$page.url.searchParams.get('book');
	});

	async function clickBookBtn() {
		if (!userLogin.value) {
			return await goto(handleLoginRedirect($page.url, { param: [{ key: 'book', value: true }] }));
		}

		await goto($page.url.href + '&book=true', { replaceState: true });
	}

	onMount(() => {
		const theId = $page.url.searchParams.get('view');
		if (!isNaN(Number(theId))) {
			id = Number(theId);
			// Assign the promise after ensuring `id` is valid
			basicInfoData = fetchBasicInfo();
		}
	});

	function formatTimestamp(timestamp: string): string {
		const date = parseISO(timestamp);
		return format(date, "MMM d, yyyy 'at' hh:mm a");
	}

	function calculateAverageRating(ratings: Rating[]): number {
		const total = ratings.reduce((sum, rating) => sum + rating.rating, 0);
		const average = Math.round(total / ratings.length); // Round to the nearest whole number
		return average;
	}

	async function fetchBasicInfo() {
		const res = await fetch(
			`/api/ltsng-basic-info/${id}?columns=id,name,rate,description,branch,municipality,purok,bgry,map_link,can_book,portInfo,contacts`
		);

		if (!res.ok) {
			throw new Error(await res.text());
		}

		const result = await res.json();

		if (result.success) {
			return result.data as ReturnBasicInfo;
		} else {
			throw new Error(result.error || 'Unknown error occurred');
		}
	}

	async function checkBooking(
		lstng_id: number
	): Promise<{ hasBooking: boolean; convoId: number | null }> {
		// Mo CHECK PUD NI SIABOUT SA COMMENT
		try {
			const response = await fetch(`/api/booking-info?method=checkBooking&listingId=${lstng_id}`);

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.message || 'An error occurred');
			}

			const data = await response.json();

			return {
				hasBooking: data.hasBooking as boolean,
				convoId: data.convoId as number | null
			}; // true or false based on the booking status
		} catch (error) {
			console.error('Error checking booking:', error);
			return {
				hasBooking: false,
				convoId: null
			}; // In case of any error, return false
		}
	}

	async function getComments(lstng_id: number) {
		try {
			const response = await fetch(`/api/comment/listing/${lstng_id}`);

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.message || 'An error occurred');
			}

			const data = await response.json();

			comments = data.data as Comment[];
			return data; // true or false based on the booking status
		} catch (error) {
			console.error('Error checking booking:', error);
			return false; // In case of any error, return false
		}
	}

	async function submitNewComment(lstng_id: number) {
		try {
			commentSubmtting = true;

			const res = await fetch('api/comment', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ content: commentValue, lstng_id })
			});

			if (!res.ok) {
				console.error('Naay error sa mag save og comment');
			}

			const newComment = (await res.json()) as any;

			comments.push(newComment.data as Comment);
			commentValue = '';

			await tick();

			// Scroll to the bottom
			const element = document.querySelector('[data-sheet-scroll-section]');
			if (element) {
				element.scrollTo({
					top: element.scrollHeight, // Scroll to the bottom
					behavior: 'smooth' // Smooth scrolling
				});
			}
		} catch (error) {
			console.error(error);
		} finally {
			commentSubmtting = false;
		}
	}

	async function getRatings(lstng_id: number): Promise<Rating[]> {
		const res = await fetch(`/api/ratings/listing/${lstng_id}`);

		if (!res.ok) {
			throw new Error(await res.text());
		}

		const result = await res.json();

		// console.log(result.data);
		if (result.success) {
			return result.data as Rating[];
		} else {
			throw new Error(result.error || 'Unknown error occurred');
		}
	}
</script>

{#await basicInfoData}
	<div>
		<ViewedItemLoading />
	</div>
{:then data}
	<ViewedCarousel id={data.id} />

	<div class="pb-14">
		<div class="mt-4 px-5 text-start">
			<div>
				<div class="flex">
					<div class="flex flex-col">
						<h1 class="font-poppins text-3xl font-bold leading-10 text-foreground">{data.name}</h1>
						{@render rating(data.id)}
					</div>

					<div class="flex flex-1 items-end">
						{#if data.rate}
							{@render price(data.rate)}
						{/if}
					</div>
				</div>

				{@render location(data)}
				{@render description(data.description)}

				{#if data.can_book}
					{@render formBooking(data.id)}
				{/if}

				<!-- {@render portInfo(data.portInfo)} -->
				<ExplorePortInfo info={data.portInfo} link={data.map_link} />

				<ExploreItemContacts contacts={data.contacts} />
			</div>
		</div>

		{#if data.can_book}
			{@render commentSection(data.id)}

			{@render footer(data)}
		{/if}
	</div>
{/await}

{#snippet location(item: Omit<ExploreItem, 'rating' | 'media'>)}
	<div class="relative my-3 block h-14 w-full overflow-hidden rounded-xl">
		<div
			class="absolute inset-0 flex items-center overflow-hidden rounded-xl bg-gradient-to-r from-muted from-50% to-background/60 to-100% shadow-md"
		>
			<div class="flex h-full w-full rounded-xl p-4 text-foreground">
				<span class="flex flex-1 items-center space-x-2 rounded-xl text-lg">
					<MapPin class="size-5" />
					<span class="capitalize"
						>{item.municipality + ', ' + item.bgry} {item.purok ? item.purok : ''}</span
					>
				</span>
			</div>
		</div>
		<img
			src="/images/map.jpg"
			alt="Dinavigatours Background"
			class="h-auto w-full rounded-xl object-cover"
		/>
	</div>
{/snippet}

{#snippet star(count: number)}
	<div class="flex space-x-1 max-md:space-x-0.5">
		{#each Array.from({ length: 5 }) as _, i}
			{#if i + 1 <= count}
				<Star class="fill-yellow-500 stroke-yellow-500 max-md:size-4" />
			{:else}
				<Star class="max-md:size-4" />
			{/if}
		{/each}
	</div>
{/snippet}

{#snippet rating(id: number)}
	{#await getRatings(id)}
		<div class="flex items-center text-lg max-md:text-sm">
			<Skeleton class="mt-3 h-8 w-20" />
			<Skeleton class="ml-2 mt-3 h-8 w-24" />
		</div>
	{:then data}
		{@const length = data.length}
		{#if length > 0}
			{@const count = calculateAverageRating(data)}
			<div class="my-2">
				<div class="flex items-center space-x-2 text-lg max-md:text-sm">
					<span
						class="rounded-bl-sm rounded-br-xl rounded-tl-xl rounded-tr-sm bg-muted-foreground/80 px-3 py-1 font-bold text-background"
					>
						{count}/5 &lpar;{length}&rpar;
					</span>
					<div>
						{@render star(count)}
					</div>
				</div>
			</div>
		{/if}
	{/await}
{/snippet}

{#snippet price(price: number)}
	<div class="ml-auto text-lg font-bold">
		<span>From: &#8369;{price.toFixed(2)}</span>
	</div>
{/snippet}

{#snippet description(description: string)}
	<h2 class="rounded-t-lg bg-foreground/5 px-4 pb-2 pt-3 text-lg font-bold text-foreground">
		Description
	</h2>
	<p class="rounded-b-lg bg-foreground/5 px-4 pb-4 pt-2 text-lg leading-5">
		{description}
	</p>
{/snippet}

{#snippet commnentFallback()}
	<div class="flex w-full flex-col items-center justify-center p-4 pb-10">
		<ManWithLike class="size-28" />
		<span>No comments yet</span>
	</div>
{/snippet}

{#snippet comment(comment: Comment)}
	{@const { first_name, last_name } = comment.user}
	<div class="grid grid-cols-1">
		<div class="flex p-2">
			<div class="px-1 pt-3">
				<Avatar.Root>
					<Avatar.Image src={getFallbackAvatar()} alt="user profile" />
					<Avatar.Fallback>CN</Avatar.Fallback>
				</Avatar.Root>
			</div>
			<div class="p-1 text-left">
				<div class="mb-4 flex w-full flex-col items-start text-lg font-medium text-foreground">
					<span>{first_name + ' ' + last_name}</span>

					<span class="text-sm text-muted-foreground">{formatTimestamp(comment.created_at)}</span>

					<!-- <Button variant="ghost" size="icon" class="ml-auto opacity-0"><EllipsisVertical /></Button
					> -->
				</div>
				<div class="text-foreground">
					{comment.content}
				</div>
			</div>
		</div>
	</div>
{/snippet}

{#snippet formBooking(id: number)}
	<FormRenderer {id} onClick={clickBookBtn} />
{/snippet}

{#snippet commentSection(id: number)}
	<div class="mb-8 mt-6 px-5">
		{#await getComments(id)}
			<div>
				<div class="p-1">
					<div class="flex">
						<Skeleton class="h-8 w-32 rounded-md" />
						<Skeleton class="ml-2 h-8 w-40 rounded-md" />
					</div>
					<Skeleton class="mt-1 h-8 w-full rounded-md" />
				</div>
				<div class="p-1">
					<div class="flex">
						<Skeleton class="h-8 w-32 rounded-md" />
						<Skeleton class="ml-2 h-8 w-40 rounded-md" />
					</div>
					<Skeleton class="mt-1 h-8 w-full rounded-md" />
				</div>
			</div>
		{:then _}
			<h2
				class="rounded-t-lg border-b-2 bg-foreground/5 px-4 py-4 text-left text-lg font-bold text-foreground"
			>
				{#if comments.length > 0}
					{comments.length} {comments.length > 1 ? 'Comments' : 'Comment'}
				{:else}
					No comments
				{/if}
			</h2>
			<div class="divide-y rounded-b-lg border-background bg-foreground/5 py-2">
				{#if comments.length > 0}
					{#each comments as theComment}
						{@render comment(theComment)}
					{/each}
				{:else}
					{@render commnentFallback()}
				{/if}
			</div>
		{/await}
	</div>
{/snippet}

{#snippet footer(data: ReturnBasicInfo)}
	<div class="fixed bottom-0 flex w-full max-w-5xl border-t-2 bg-background px-5 py-4">
		{#await checkBooking(data.id)}
			<div class="flex w-full space-x-4">
				<Skeleton class="h-10 w-full rounded-md" />
				<Skeleton class="h-10 w-full rounded-md" />
			</div>
		{:then bookingData}
			{@const chatLink = bookingData.convoId
				? `/chats/${bookingData.convoId}`
				: `/chats/${data.id}?new=${data.name}`}

			{#if bookingData.hasBooking}
				<div class="flex w-full justify-end space-x-2" in:fade={{ duration: 150 }}>
					<Textarea
						placeholder="Leave a comment..."
						bind:value={commentValue}
						rows={1}
						class="ml-2 min-h-10 resize-y sm:w-auto"
					/>
					<Button
						disabled={commentSubmtting}
						class="ml-auto mt-auto"
						variant="secondary"
						title="Send"
						onclick={() => submitNewComment(data.id)}
					>
						{#if commentSubmtting}
							<Loader class="size-4 animate-spin" />
						{:else}
							<Send />
						{/if}
						<span class="max-sm:hidden">Send</span>
					</Button>
					<Button variant="secondary" href={chatLink} title="chat">
						<MessageSquare />
						<span class="max-sm:hidden">Chat</span>
					</Button>
				</div>
			{:else}
				{@const hasRooms =
					data.branch.toLowerCase() === 'hotels' || data.branch.toLowerCase() === 'resorts'}
				<div
					class="flex w-full justify-around space-x-4 md:justify-end"
					in:fade={{ duration: 150 }}
				>
					<Button class="max-md:w-full" variant="secondary" href={chatLink}>
						<MessageSquare />
						Chat
					</Button>
					{#if !hasRooms}
						<Button class="max-md:w-full" onclick={clickBookBtn}>Book now</Button>
					{/if}
				</div>
			{/if}
		{/await}
	</div>
{/snippet}

<BookingDialog bind:open lstng_id={$page.url.searchParams.get('view')} />

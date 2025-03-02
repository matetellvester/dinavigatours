<script lang="ts">
	import EventsList from '$lib/components/app/events-list.svelte';
	import Explore from '$lib/components/app/explore.svelte';
	import CategoryDrawer from '$lib/components/app/explore/category-drawer.svelte';
	import Footer from '$lib/components/app/footer.svelte';
	import Highlights from '$lib/components/app/highlights.svelte';
	import { Button } from '$lib/components/ui/button/index.js';
	import { goto } from '$app/navigation';
	import Testimonial from '$lib/components/app/testimonial.svelte';
	import Ports from '$lib/components/app/ports.svelte';

	import {
		AsianHat,
		BeachTree,
		BeachUmbrella,
		Camera,
		Condo,
		JetSki,
		Path,
		Pickup
	} from '$lib/components/svg';

	let { data } = $props();

	let open = $state(false);

	const categs = [
		{
			title: 'Tours',
			href: '/explore?filter=IslandHopping,DayTrips,BoatTours',
			icon: Path
		},
		{
			title: 'Attractions',
			href: '/explore?attraction=all',
			icon: Camera
		},
		{
			title: 'Hotels',
			href: '/explore?filter=Hotels,Resorts',
			icon: Condo
		},
		{
			title: 'Transport',
			href: '/explore?filter=CarRentals,MotorcycleRentals,BusServices',
			icon: Pickup
		}
	];

	const dinagatHighlights = [
		{
			title: 'Discover Hidden Gems',
			description:
				"Explore pristine white sand beaches, crystal-clear waters, and stunning limestone rock formations. Dinagat is a nature lover's paradise.",
			icon: BeachTree
		},
		{
			title: 'Enjoy Tranquility & Beauty',
			description:
				'Relax in peaceful surroundings, experience vibrant marine life, and soak in breathtaking coastal views.',
			icon: BeachUmbrella
		},
		{
			title: 'Adventure Made Accessible',
			description:
				"Plan island hopping, explore mystical caves, or trek lush green trails. Travel with ease to Dinagat's must-see destinations.",
			icon: JetSki
		},
		{
			title: 'Culture You Can Feel',
			description:
				'Discover warm hospitality, rich traditions, and unique local stories that make Dinagat a special place to visit.',
			icon: AsianHat
		}
	];
</script>

<svelte:head>
	<title>Home</title>
</svelte:head>

<div class="flex flex-1 flex-col gap-4">
	<div class="relative flex h-[232px] flex-col md:h-[300px]">
		<img
			src="/bitaog-beach.png"
			alt="Dinavigatours Background"
			class="absolute left-0 top-0 h-full w-full object-cover"
		/>
		<div
			class="absolute left-0 top-0 h-full w-full bg-gradient-to-r from-red-900/30 to-blue-900/50"
		></div>
		<div
			class="absolute left-0 top-0 h-full w-full from-background from-10% via-transparent via-50% to-90% max-sm:bg-gradient-to-t"
		></div>

		<div
			class="absolute left-0 z-10 h-5 w-full bg-[url('/love-phil.jpg')] bg-cover bg-no-repeat max-sm:top-0 max-sm:opacity-50 sm:-bottom-[20px]"
			role="img"
			aria-label="Dinavigatours Background"
		></div>

		<!-- <img
			src="/love-phil.jpg"
			alt="Dinavigatours Background"
			class="absolute left-0 z-10 h-5 w-full object-cover max-sm:top-0 max-sm:opacity-50 sm:-bottom-[20px]"
		/> -->

		<div class="content h-full w-full text-white">
			<div class="flex h-full w-full flex-col items-center justify-center max-sm:hidden">
				<h1 class="relative text-center text-[3.5rem] font-bold leading-none shadow-sm">
					<span class="absolute -top-[10px] left-0 translate-x-1 text-[1rem]">Discover</span>
					Dinagat Islands
				</h1>
				<p class="relative text-center leading-loose">Mystical Island Province of Love</p>
			</div>

			<div
				class="relative z-20 flex w-full max-sm:h-full max-sm:p-4 sm:absolute sm:-bottom-28 sm:mt-4 md:-bottom-20"
			>
				<div
					class="relative mx-auto flex flex-col rounded-3xl bg-background bg-center p-6 text-foreground shadow-xl max-sm:w-full max-sm:bg-background/70 max-sm:backdrop-blur-sm"
				>
					<div
						class=" absolute inset-0 -z-[2] rounded-3xl bg-[url('/aura-bg.png')] bg-[size:100%] opacity-50 dark:invert sm:hidden"
					></div>

					<div
						class="my-auto flex w-full items-center justify-center space-x-2 px-10 font-poppins text-sm font-medium sm:space-x-4"
					>
						{#each categs as { icon: Icon, title, href }}
							<a {href} class="flex flex-col items-center max-sm:tracking-tighter">
								<Icon class="size-10 sm:size-10" />
								<span>{title}</span>
							</a>
						{/each}
					</div>
					<Button class="mt-auto w-full sm:mt-4" onclick={() => (open = true)} variant="outline">
						All Categories
					</Button>
				</div>
			</div>
		</div>
	</div>

	<div class="flex flex-col justify-center">
		<Highlights />

		{@render highlightsDesp()}
		<Ports s={data.supabase} />
		<EventsList />

		<Testimonial />

		<Explore items={data.exploreItems} showExploreMore />
	</div>
</div>
<Footer />

{#snippet highlightsDesp()}
	<div class="relative mb-8 mt-8 pb-2">
		<h2 class="mb-4 px-5 font-poppins text-2xl font-bold tracking-tighter sm:text-2xl">
			Why Visit Dinagat Islands?
		</h2>
		<div class=" grid grid-cols-2 gap-5 px-5 md:grid-cols-4">
			{#each dinagatHighlights as { icon: Icon, title, description: desp }}
				<div class="">
					<div class="block">
						<Icon class="size-10 md:size-14" />
					</div>
					<span class="mb-2 inline-block font-poppins font-semibold leading-5 tracking-tighter"
						>{title}</span
					>
					<br />
					<div class="text-sm leading-4 text-muted-foreground">{desp}</div>
				</div>
			{/each}
		</div>

		<div
			class="absolute bottom-0 left-0 right-0 -z-10 h-1/2 w-full bg-[url('/wave_seamless.png')] bg-contain bg-bottom bg-repeat-x opacity-30 dark:invert"
			role="img"
		></div>
		<div
			class="absolute left-0 right-0 top-0 -z-10 h-1/2 w-full bg-[url('/hanging_party_flag.png')] bg-contain bg-right bg-no-repeat opacity-30 dark:invert"
			role="img"
		></div>
	</div>
{/snippet}

<CategoryDrawer
	bind:open
	onClick={(val) => {
		goto('/explore?filter=' + val);
	}}
/>

<script lang="ts">
	import * as Sheet from '$lib/components/ui/sheet/index.js';
	import type { SupabaseClient } from '@supabase/supabase-js';
	import { ExternalLink } from 'lucide-svelte';
	import { fade } from 'svelte/transition';

	interface Props {
		s: SupabaseClient<any, 'public', any>;
	}

	interface Port {
		name: string;
		src: string;
		href: string;
		vesels: Vessel[];
	}

	let { s }: Props = $props();
	const ports: Port[] = [
		{
			name: 'Loreto',
			src: '/ports/loreto-port.jpg',
			href: 'https://maps.app.goo.gl/FfM2Cu2yvhkaaN6J6',
			vesels: []
		},
		{
			name: 'Tubajon',
			src: '/ports/tubajon-port.jpg',
			href: 'https://maps.app.goo.gl/BE1aVQTkEDTQhjfW6',
			vesels: []
		},
		{
			name: 'Libjo',
			src: '/ports/libjo-port.jpg',
			href: 'https://maps.app.goo.gl/41u7ZnpjKfAd89wC8',
			vesels: []
		},
		{
			name: 'Basilisa',
			src: '/ports/basilisa-port.jpg',
			href: 'https://maps.app.goo.gl/xQsfVFs91vGYFkgZ6',
			vesels: []
		},
		{
			name: 'San Jose',
			src: '/ports/san-jose-port.jpg',
			href: 'https://maps.app.goo.gl/Kqiz7zCTAkgcgj5g7',
			vesels: []
		},
		{
			name: 'Cagdianao',
			src: '/ports/cagdianao-port.jpg',
			href: 'https://maps.app.goo.gl/r4Sogj7AWwWqU8zq8',
			vesels: []
		},
		{
			name: 'Dinagat',
			src: '/ports/dinagat-port.jpg',
			href: 'https://maps.app.goo.gl/XD3CcgZDx5fdLvCj7',
			vesels: []
		}
	];

	let open = $state(false);

	let openPort: null | Port = $state(null);

	function openSheet(port: (typeof ports)[0]) {
		openPort = port;
		open = true;
	}

	async function getVessel(name: string) {
		const { data, error } = await s
			.from('vessels')
			.select('id, name, departure, arrival')
			.eq('municipal', name.toLowerCase().replace(/\s+/g, ''));

		if (error) {
			console.error(`Naay error sa pagkuha sa vessel with name ${name}: `, error);
			throw error;
		}

		return data as Vessel[];
	}
</script>

<div class="relative mb-20 mt-20">
	<div class="h-[400px] w-full overflow-auto object-cover">
		<img
			src="/boat.png"
			alt=""
			class="h-full min-h-[250px] object-cover object-[-25px_100%] md:object-left-bottom"
		/>

		<div
			class="absolute bottom-0 right-0 top-0 flex h-full min-w-[70%] flex-col bg-background/50 p-4 pr-0"
		>
			<p class="block font-poppins text-2xl font-bold tracking-tighter sm:text-2xl">
				Want to go here?
			</p>

			<div class="block font-semibold text-muted-foreground">
				Check out these port locations to start your route
			</div>

			<div class="my-auto grid max-w-[600px] grid-cols-4 gap-4 overflow-hidden p-2">
				{#each ports as port}
					{#await getVessel(port.name) then vesels}
						{#if vesels.length > 0}
							<button
								in:fade
								onclick={() => openSheet({ ...port, vesels })}
								class="group relative flex min-h-[90px] gap-2 rounded-xl bg-background text-left shadow transition-all hover:scale-105"
							>
								<img
									src={port.src}
									alt=""
									class="absolute inset-0 size-full rounded-xl object-cover"
								/>
								<div
									class="z-10 flex-1 rounded-xl bg-gradient-to-b from-background to-background/10 to-80% px-3 py-2 font-semibold"
								>
									<span class="font-bold">
										{port.name}
									</span>
								</div>
							</button>
						{/if}
					{/await}
				{/each}
			</div>
		</div>
	</div>
</div>

<Sheet.Root bind:open>
	<Sheet.Content class="border-none p-0">
		<Sheet.Header>
			<Sheet.Title>
				<div class="relative h-[250px]">
					{#if openPort}
						<img src={openPort.src} alt="" class="absolute inset-0 size-full object-cover" />
					{/if}
					<div
						class="absolute inset-0 block size-full flex-1 bg-gradient-to-t from-background via-background/80 via-30% to-transparent to-80% py-3 font-poppins font-bold"
					>
						<span class="px-4 text-5xl opacity-25">{openPort?.name || ''}</span>
					</div>

					{#if openPort}
						<a
							target="_blank"
							href={openPort.href}
							class="absolute bottom-12 right-5 opacity-50 transition-opacity hover:opacity-100"
						>
							<ExternalLink class="size-8" />
						</a>
					{/if}
				</div>
			</Sheet.Title>
		</Sheet.Header>
		<div class="-translate-y-6 px-4">
			<span class="px-2 font-bold">Surigao to Dinagat Islands</span>
			<div class="grid grid-cols-[1fr_90px_90px]">
				<div class="block border-b px-2 py-1 font-semibold">Vessel</div>
				<div class="block border-b px-2 py-1 font-semibold">Departure</div>
				<div class="block border-b px-2 py-1 font-semibold">Arrival</div>

				{#if openPort}
					{#each openPort.vesels as { name, departure, arrival }}
						<div class="block border-b px-2 py-1 text-sm">{name}</div>
						<div class="block border-b px-2 py-1 text-sm">{departure}</div>
						<div class="block border-b px-2 py-1 text-sm">{arrival}</div>
					{/each}
				{/if}
			</div>
		</div>
	</Sheet.Content>
</Sheet.Root>

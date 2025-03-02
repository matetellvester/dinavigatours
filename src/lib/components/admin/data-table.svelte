<script lang="ts" generics="TData, TValue">
	import {
		type ColumnDef,
		type PaginationState,
		type SortingState,
		getCoreRowModel,
		getPaginationRowModel
	} from '@tanstack/table-core';

	import { createSvelteTable, FlexRender } from '$lib/components/ui/data-table/index.js';
	import * as Table from '$lib/components/ui/table/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { ChevronRight, ChevronLeft, CirclePlus } from 'lucide-svelte';

	type DataTableProps<TData, TValue> = {
		add?: {
			href: string;
			text?: string;
		};
		data: TData[] | null;
		columns: ColumnDef<TData, TValue>[];
	};

	let { data, columns, add }: DataTableProps<TData, TValue> = $props();

	let pagination = $state<PaginationState>({ pageIndex: 0, pageSize: 10 });
	let sorting = $state<SortingState>([]);

	const table = createSvelteTable({
		get data() {
			return data ?? [];
		},

		columns,
		state: {
			get pagination() {
				return pagination;
			},
			get sorting() {
				return sorting;
			}
		},
		onPaginationChange: (updater) => {
			if (typeof updater === 'function') {
				pagination = updater(pagination);
			} else {
				pagination = updater;
			}
		},
		onSortingChange: (updater) => {
			if (typeof updater === 'function') {
				sorting = updater(sorting);
			} else {
				sorting = updater;
			}
		},
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel()
	});
</script>

<div>
	{#if add}
		<div class="mb-4 inline-flex w-full space-x-2">
			<Button variant="outline" href={add.href} class="border-dashed">
				<CirclePlus />
				<span>{add.text ?? 'Add'}</span>
			</Button>
		</div>
	{/if}

	<div class="rounded-md border">
		<Table.Root>
			<Table.Header class="bg-primary/10">
				{#each table.getHeaderGroups() as headerGroup (headerGroup.id)}
					<Table.Row>
						{#each headerGroup.headers as header (header.id)}
							<Table.Head class="px-3">
								{#if !header.isPlaceholder}
									<FlexRender
										content={header.column.columnDef.header}
										context={header.getContext()}
									/>
								{/if}
							</Table.Head>
						{/each}
					</Table.Row>
				{/each}
			</Table.Header>
			<Table.Body>
				{#each table.getRowModel().rows as row (row.id)}
					<Table.Row data-state={row.getIsSelected() && 'selected'} class="even:bg-primary/5">
						{#each row.getVisibleCells() as cell (cell.id)}
							<Table.Cell class="px-3 py-2">
								<FlexRender content={cell.column.columnDef.cell} context={cell.getContext()} />
							</Table.Cell>
						{/each}
					</Table.Row>
				{:else}
					{#if data === null}
						<Table.Row>
							<Table.Cell colspan={columns.length} class="h-24 text-center ">
								<div class="w-full flex space-x-2 items-center justify-center">
									<p>
										Getting data
										<span class="dot-animate">.</span>
										<span class="dot-animate">.</span>
										<span class="dot-animate">.</span>
									</p>
								</div>
							</Table.Cell>
						</Table.Row>
					{:else}
						<Table.Row>
							<Table.Cell colspan={columns.length} class="h-24 text-center">No results.</Table.Cell>
						</Table.Row>
					{/if}
				{/each}
			</Table.Body>
		</Table.Root>
	</div>

	<div class="flex items-center justify-end space-x-2 py-4">
		<Button
			variant="outline"
			size="sm"
			onclick={() => table.previousPage()}
			disabled={!table.getCanPreviousPage()}
		>
			<ChevronLeft />
		</Button>
		<Button
			variant="outline"
			size="sm"
			onclick={() => table.nextPage()}
			disabled={!table.getCanNextPage()}
		>
			<ChevronRight />
		</Button>
	</div>
</div>

<style>
	@keyframes dot-blink {
		0%,
		20% {
			opacity: 0;
		}
		40% {
			opacity: 1;
		}
	}

	.dot-animate:nth-child(1) {
		margin-right: 0.05rem;
		animation: dot-blink 0.6s infinite;
	}

	.dot-animate:nth-child(2) {
		margin-right: 0.05rem;
		animation: dot-blink 0.6s infinite 0.2s;
	}

	.dot-animate:nth-child(3) {
		animation: dot-blink 0.6s infinite 0.4s;
	}
</style>

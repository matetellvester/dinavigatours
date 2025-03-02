import type { BusinessList } from '$bns-comps';
import type { ColumnDef } from '@tanstack/table-core';
import DataTableCategoryButton from './business-list/data-table-category-button.svelte';
import DataTableBookStatus from './booking/data-table-book-status.svelte';
import { renderComponent, renderSnippet } from '$lib/components/ui/data-table/index.js';
import DataTableActions from './table-actions/data-table-actions.svelte';
import { Category } from '$lib/constant/category';
import DataTableName from './business-list/data-table-name.svelte';
import { createRawSnippet } from 'svelte';
import { cn, getLocation, toProperCase } from '$lib/utils';
import { render } from 'svelte/server';
import { format, parseISO } from 'date-fns';
import DataTableBookActions from './table-actions/data-table-book-actions.svelte';

export const bnsListColumns: ColumnDef<{
	id: number;
	name: string;
	category: string;
	is_approved: boolean | null;
	municipality: string;
	bgry: string;
}>[] = [
	{
		accessorKey: 'name',
		header: 'Name',
		enableHiding: false,

		cell: ({ row }) => {
			return renderComponent(DataTableName, {
				name: row.original.name,
				isApproved: row.original.is_approved
			});
		}
	},
	{
		accessorKey: 'category',
		enableHiding: false,
		header: ({ column }) =>
			renderComponent(DataTableCategoryButton, {
				name: 'Category',
				onclick: () => column.toggleSorting(column.getIsSorted() === 'asc')
			}),
		cell: ({ row }) => {
			const categ = row.original.category as keyof typeof Category;
			return toProperCase(Category[categ]);
		}
	},
	{
		accessorKey: 'location',
		header: 'Location',
		cell: ({ row }) => {
			const className = cn('capitalize');

			const amountHeaderSnippet = createRawSnippet(() => ({
				render: () =>
					`<div class="${className}">${getLocation({ municipality: row.original.municipality, bgry: row.original.bgry })}</div>`
			}));
			return renderSnippet(amountHeaderSnippet, '');
		}
	},
	{
		id: 'actions',
		enableHiding: false,

		cell: ({ row }) => {
			return renderComponent(DataTableActions, {
				id: row.original.id,
				status: row.original.is_approved
			});
		}
	}
];

type BookingDetail = {
	id: number;
	created_at: string;
	user_id: string;
	first_name: string;
	last_name: string;
	contact_info: string;
	booking_date: string;
	checkin: string;
	checkout: string;
	status: BookingStatus;
	lstng_id: number;
	remarks: string;
	down_payment: number | null;
	full_payment: number | null;
	ltsng_basic_info: {
		name: string;
		branch: string;
		category: string;
	};
	user: { last_name: string; first_name: string; contact_info: string };
};

export const bnsBookingColumns: ColumnDef<BookingDetail>[] = [
	{
		accessorKey: 'Customer Name',
		header: 'Customer Name',
		cell: ({ row }) => {
			const className = cn('capitalize');

			const nameHeader = createRawSnippet(() => ({
				render: () =>
					`<div class="${className}">${row.original.user.last_name + ', ' + row.original.user.first_name}</div>`
			}));
			return renderSnippet(nameHeader, '');
		}
	},
	{
		accessorKey: 'Check-in',
		header: 'Check-in',
		cell: ({ row }) => {
			return renderComponent(DataTableBookStatus, {
				status: row.original.status,
				created_at: row.original.checkin
			});
		}
	},
	{
		accessorKey: 'Check-out',
		header: 'Check-out',
		cell: ({ row }) => {
			return format(parseISO(row.original.checkout), 'MMM dd, yyyy');
		}
	},
	{
		accessorKey: 'Service',
		header: 'Service',
		cell: ({ row }) => {
			return row.original.ltsng_basic_info.name;
		}
	},
	{
		id: 'actions',
		enableHiding: false,
		cell: ({ row }) => {
			return renderComponent(DataTableBookActions, {
				id: row.original.id,
				user_id: row.original.user_id,
				status: row.original.status,
				contactNo: row.original.user.contact_info,
				name: row.original.ltsng_basic_info.name,
				first_name: row.original.user.first_name,
				last_name: row.original.user.last_name,
				checkin: format(parseISO(row.original.checkin), 'MMM dd, yyyy'),
				checkout: format(parseISO(row.original.checkout), 'MMM dd, yyyy'),
				remarks: row.original.remarks,
				down_payment: row.original.down_payment,
				full_payment: row.original.full_payment
			});
		}
	}
];

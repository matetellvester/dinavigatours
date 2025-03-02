import DataTableName from '$bns-comps/table/business-list/data-table-name.svelte';
import { renderComponent, renderSnippet } from '$lib/components/ui/data-table/index.js';
import { Category } from '$lib/constant/category';
import { cn } from '$lib/utils';
import type { ColumnDef } from '@tanstack/table-core';
import { createRawSnippet } from 'svelte';
import EventDateTimeView from './events/event-date-time-view.svelte';
import EventLocationView from './events/event-location-view.svelte';
import EventNameView from './events/event-name-view.svelte';
import {
	AdmTableAttractActions,
	AdmTableEventsActions,
	AdmTableListingActions
} from './table-actions';

export type Users = {
	id: string;
	firstname: string;
	lastname: string;
	role: number;
};

function getUser(userType: string | number): string {
	switch (userType) {
		case 1:
			return 'admin';
		case 2:
			return 'tour operatour';
		case 3:
			return 'tourist';
		default:
			return '--';
	}
}

function addSpacesToCamelCase(word: string): string {
	return word.replace(/([a-z])([A-Z])/g, '$1 $2');
}

export const adminUsersTableColumns: ColumnDef<Users, unknown>[] = [
	{
		accessorKey: 'first_name',
		header: 'First Name'
	},
	{
		accessorKey: 'last_name',
		header: 'Last Name'
	},
	{
		accessorKey: 'role',
		header: 'Role',
		cell: ({ row }) => {
			const snippet = createRawSnippet(() => ({
				render: () =>
					`<div class="${cn('capitalize text-nowrap')}">${getUser(row.getValue('role') as number)}</div>`
			}));
			return renderSnippet(snippet, '');
		}
	}
];

export const adminBusinessTableColumns: ColumnDef<{
	id: number;
	name: string;
	category: string;
	is_approved: boolean | null;
	municipality: string;
	bgry: string;
	user: { last_name: string; first_name: string };
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
		header: 'Category',
		cell: ({ row }) => {
			const categ = row.original.category as keyof typeof Category;
			return Category[categ];
		}
	},
	{
		accessorKey: 'location',
		header: 'Location',
		cell: ({ row }) => {
			const className = cn('capitalize');
			const amountHeaderSnippet = createRawSnippet(() => ({
				render: () =>
					`<div class="${className}">${row.original.municipality + ', ' + row.original.bgry}</div>`
			}));
			return renderSnippet(amountHeaderSnippet, '');
		}
	},
	{
		accessorKey: 'user',
		header: 'Business Owner',
		cell: ({ row }) => {
			const className = cn('capitalize');
			const amountHeaderSnippet = createRawSnippet(() => ({
				render: () =>
					`<div class="${className}">${row.original.user.last_name + ', ' + row.original.user.first_name}</div>`
			}));
			return renderSnippet(amountHeaderSnippet, '');
		}
	},

	{
		id: 'actions',
		enableHiding: false,
		cell: ({ row }) => {
			return renderComponent(AdmTableListingActions, {
				id: row.original.id,
				status: row.original.is_approved,
				businessName: row.original.name
			});
		}
	}
];

export const admAttractionsCols: ColumnDef<
	Omit<ExploreItem, 'rating' | 'media' | 'map_link'> & {
		purok: number;
		mapLink: string;
		category: string;
		branch: string;
	},
	unknown
>[] = [
	{
		accessorKey: 'name',
		header: 'Name'
	},
	{
		accessorKey: 'category',
		header: 'Category',
		enableHiding: false,
		cell: ({ row }) => {
			const categ = row.original.category;
			return addSpacesToCamelCase(categ);
		}
	},
	{
		accessorKey: 'location',
		header: 'Location',
		cell: ({ row }) => {
			const bgry = (v: string | null) => (v ? `, ${v}` : '');
			const amountHeaderSnippet = createRawSnippet(() => ({
				render: () =>
					`<div style="text-transform: capitalize;">${row.original.municipality + bgry(row.original.bgry)}</div>`
			}));
			return renderSnippet(amountHeaderSnippet, '');
		}
	},
	{
		id: 'actions',
		enableHiding: false,

		cell: ({ row }) => {
			return renderComponent(AdmTableAttractActions, {
				item: row.original
			});
		}
	}
];
export const admEventsCols: ColumnDef<Event, unknown>[] = [
	{
		enableHiding: false,
		accessorKey: 'name',
		header: 'Name',
		cell: ({ row }) => {
			return renderComponent(EventNameView, {
				type: row.original.type,
				name: row.original.name,
				expired: row.original.expired
			});
		}
	},
	{
		accessorKey: 'location',
		header: 'Location',
		cell: ({ row }) => {
			return renderComponent(EventLocationView, {
				municical: row.original.municipality,
				bgry: row.original.bgry
			});
		}
	},
	{
		accessorKey: 'start_datetime',
		header: 'Date & Time',
		cell: ({ row }) => {
			return renderComponent(EventDateTimeView, {
				event: row.original
			});
		}
	},
	{
		id: 'actions',
		enableHiding: false,
		cell: ({ row }) => {
			return renderComponent(AdmTableEventsActions, {
				id: row.original.id
			});
		}
	}
];

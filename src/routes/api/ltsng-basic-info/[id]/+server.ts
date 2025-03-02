import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

const VALID_COLUMNS = [
	'id',
	'created_at',
	'user_id',
	'name',
	'category',
	'branch',
	'branch_info',
	'is_approved',
	'rate',
	'description',
	'municipality',
	'bgry',
	'purok',
	'map_link',
	'can_book',
	'rooms',
	'portInfo',
	'contacts'
];

export const GET: RequestHandler = async ({ url, locals, params }) => {
	try {
		const { id } = params;

		const columnsParam = url.searchParams.get('columns');

		const withMedia = url.searchParams.get('withMedia') ? ', media: ltsng_media(*)' : '';

		const columns = columnsParam ? columnsParam.split(',') : VALID_COLUMNS;

		const sanitizedColumns = columns.filter((col) => VALID_COLUMNS.includes(col));

		if (sanitizedColumns.length === 0) {
			return json({ success: false, error: 'No valid columns requested' }, { status: 400 });
		}

		// Fetch the data with the validated columns
		const { data, error } = await locals.supabase
			.from('ltsng_basic_info')
			.select(sanitizedColumns.join(',') + withMedia)
			.eq('id', id);

		if (error) {
			console.error(error);

			throw new Error(error.message);
		}

		return json({ success: true, data: data[0] });
	} catch (error) {
		return json({ success: false, error }, { status: 500 });
	}
};

export const PATCH: RequestHandler = async ({ request, locals, params }) => {
	const { id } = params;
	const updates = await request.json(); // Get the data from the request body

	if (!id || Object.keys(updates).length === 0) {
		throw error(400, 'Invalid request');
	}

	try {
		// Perform the update in Supabase
		const { data, error: updateError } = await locals.supabase
			.from('ltsng_basic_info')
			.update(updates)
			.eq('id', id);

		if (updateError) {
			throw error(500, updateError.message);
		}
		const action = updates.is_approved ? 'Approved' : 'Declined';
		return json({ success: true, message: action + ' Successfully!', data });
	} catch (err) {
		throw error(500, 'Internal Server Error');
	}
};

export const DELETE: RequestHandler = async ({ locals, params }) => {
	const { id } = params;

	if (!id) {
		throw error(400, 'Invalid request');
	}

	try {
		const { data, error: updateError } = await locals.supabase
			.from('ltsng_basic_info')
			.delete()
			.eq('id', id);

		if (updateError) {
			throw error(500, updateError.message);
		}

		return json({ success: true, message: 'Successfully!', data });
	} catch (err) {
		console.error('Naay error sa pag delete: ' + JSON.stringify(err, null, 2));
		throw error(500, 'Internal Server Error');
	}
};

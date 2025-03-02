import type { RequestHandler } from './$types';
import { json, error } from '@sveltejs/kit';

const VALID_COLUMNS = [
	'id',
	'lstng_id',
	'src',
	'type',
	'description',
	'copyright_link',
	'isThumbnail'
];

export const GET: RequestHandler = async ({ url, locals, params }) => {
	try {
		const { id } = params;

		const column = url.searchParams.get('lstng_id') ? 'lstng_id' : 'id';

		const columnsParam = url.searchParams.get('columns');

		const columns = columnsParam ? columnsParam.split(',') : VALID_COLUMNS;

		const sanitizedColumns = columns.filter((col) => VALID_COLUMNS.includes(col));

		if (sanitizedColumns.length === 0) {
			return json({ success: false, error: 'No valid columns requested' }, { status: 400 });
		}

		const { data, error } = await locals.supabase
			.from('ltsng_media')
			.select(sanitizedColumns.join(','))
			.eq(column, id);

		if (error) {
			throw new Error(error.message);
		}

		return json({ success: true, data: data });
	} catch (error) {
		return json({ success: false, error }, { status: 500 });
	}
};

import { json } from '@sveltejs/kit';
import qs from 'qs';
import type { RequestHandler } from './$types';

function getFileName(parentName: string) {
	return (index: number, key: string) => `${parentName}[${index}][${key}]`;
}

export const GET: RequestHandler = async ({ locals, url }) => {
	const getMedia = url.searchParams.get('getMedia')
		? ' ,media: events_media(src, type, description, isThumbnail)'
		: '';

	const { data: events, error: eventsError } = await locals.supabase.from('events').select(`
      id,
      name,
      description,
      start_datetime,
      end_datetime,
      start_time,
      end_time,
      municipality,
      bgry,
      purok,
      type,
      month,
      day_range,
      expired,
      time_type,
      map_link ${getMedia}
    `);

	if (eventsError) {
		console.error('ERROR Fetching events:', JSON.stringify(eventsError, null, 2));
		return json(
			{
				success: false,
				message: 'Error fetching events'
			},
			{ status: 500 }
		);
	}

	return json({ success: true, data: events });
};

export const POST: RequestHandler = async ({ request, locals }) => {
	const user = locals.user ?? (await locals.safeGetSession());

	if (!user) {
		return json({ success: false, message: 'No user' });
	}

	const formData = await request.formData();

	const pd = qs.parse(
		Object.fromEntries(
			Array.from(formData.entries()).map(([key, value]) => [key, value.toString()])
		)
	);

	// EVENTS TABLE
	const eventsTblRes = await insertingToBasicInfo(locals, pd);

	if (!eventsTblRes.success) return json(eventsTblRes);

	// NEW LISTING ID
	const newRowId = eventsTblRes.id as number;

	// UPLOADING MEDIA
	const mediaRes = await uploadMedia(newRowId, locals, pd, formData);

	if (!mediaRes) {
		return json(
			{
				success: false,
				table: 'media',
				message: `Error while uploading media`
			},
			{ status: 400 }
		);
	}

	const { error: mediaTableError } = await locals.supabase.from('events_media').insert(mediaRes);

	if (mediaTableError) {
		console.error(
			'ERROR Inserting to events_media table:',
			JSON.stringify(mediaTableError, null, 2)
		);

		return json(
			{
				success: false,
				table: 'media',
				message: `Error while inserting to events_media table`
			},
			{ status: 400 }
		);
	}

	return json({ success: true, pd });
};

async function insertingToBasicInfo(locals: App.Locals, pd: { [key: string]: unknown }) {
	const dataToSave = {
		// @ts-ignore
		...pd.data,
		municipality: pd.municipality,
		bgry: pd.bgry,
		purok: Number(pd.purok),
		map_link: (pd.map_link as string).trim() || null
	};

	const { data: eventsTblResponse, error: eventsTblTable } = await locals.supabase
		.from('events')
		.insert([dataToSave])
		.select();

	if (eventsTblTable) {
		console.error('ERROR Inserting to events table:', JSON.stringify(eventsTblTable, null, 2));
		return {
			success: false,
			table: 'info',
			message: `Unable to save, please try again`
		};
	}

	const newRowId = eventsTblResponse[0].id as number;

	return {
		success: true,
		id: newRowId
	};
}

async function uploadMedia(
	event_id: number,
	locals: App.Locals,
	pd: { [key: string]: unknown },
	formData: FormData
) {
	type AllMedia = {
		src: string;
		type: string;
		event_id: number;
		description: string;
		copyright_link: string;
		isThumbnail: boolean;
	};

	const name = getFileName('media');

	const media = pd.media as {
		file: File;
		type: string;
		desp: string;
		copyright: string;
		isThumbnail: 'true' | 'false';
	}[];

	if (!media || !media.length) {
		return json(
			{
				success: false,
				table: 'bucket',
				message: `There is an error while uploading media about the size of the media`
			},
			{ status: 400 }
		);
	}

	const allMedia: AllMedia[] = [];

	for (let i = 0; i < media.length; i++) {
		const file = formData.get(name(i, 'file')) as File;

		if (!file) {
			console.error(`File missing for media index ${i}`);
			continue;
		}

		const fileExtension = file.name.split('.').pop(); // Get the file extension

		const uniqueFileName = `${Date.now()}-${Math.random() // Generate a unique file name using a timestamp and a random string
			.toString(36)
			.substring(2, 15)}.${fileExtension}`;

		const { data: imageResponse, error: imageError } = await locals.supabase.storage
			.from('media')
			.upload(uniqueFileName, file, {
				upsert: true
			});

		if (imageError) {
			return json(
				{
					success: false,
					table: 'bucket',
					message: `There is an error while uploading media`
				},
				{ status: 400 }
			);
		}

		const currentMedia = media[i];

		allMedia.push({
			src: imageResponse.fullPath,
			type: formData.get(name(i, 'type')) as string,
			event_id,
			description: currentMedia.desp,
			copyright_link: currentMedia.copyright,
			isThumbnail: currentMedia.isThumbnail === 'true'
		});
	}

	return allMedia;
}

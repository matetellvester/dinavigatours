import type { User } from '@supabase/supabase-js';
import { formatDate } from '$lib/utils';
import type { Actions } from './$types';
import qs from 'qs';
import { fail } from '@sveltejs/kit';
import { getFormData } from '$bns-comps/stepper/forms/forrmDataGetter';
import type { AllSubCategoryiesType } from '$bns-comps/stepper/forms/types';

function getFileName(parentName: string) {
	return (index: number, key: string) => `${parentName}[${index}][${key}]`;
}

export const actions: Actions = {
	default: async ({ request, locals }) => {
		const { user } = await locals.safeGetSession();

		if (!user) {
			return {
				success: false,
				table: 'No user',
				message: `Unable to save, please try again`
			};
		}

		const formData = await request.formData();

		const pd = qs.parse(
			Object.fromEntries(
				Array.from(formData.entries()).map(([key, value]) => [key, value.toString()])
			)
		);

		const branchInfo = (formData.get('sub_categ') as string).replaceAll(
			/ /g,
			''
		) as keyof AllSubCategoryiesType;

		// BASIC INFO TABLE
		const basicInfoRes = await insertingToBasicInfo(
			locals,
			user.id,
			getFormData(formData, branchInfo),
			pd
		);

		if (!basicInfoRes.success) return basicInfoRes;

		// NEW LISTING ID
		const newRowId = basicInfoRes.id;

		// UPLOADING MEDIA
		const mediaRes = await uploadMedia(newRowId, locals, pd, formData);

		if (!mediaRes)
			return {
				success: false,
				table: 'media',
				message: `Nag error sa pag upload sa media`
			};

		const { error: mediaTableError } = await locals.supabase.from('ltsng_media').insert(mediaRes);

		if (mediaTableError)
			return {
				success: false,
				table: 'media',
				message: `Unable to save, please try again`
			};

		await newNotif(locals, pd.businessName);

		return {
			success: true,
			table: '',
			message: ``
		};
		// cookies.set('userDataAdded', '1', { path: '/b/list', maxAge: 300 });
		// throw redirect(303, '/b/list');
	}
};

async function newNotif(locals: App.Locals, name: any) {
	const { error } = await locals.supabase.from('notification').insert([
		{
			user_id: null,
			title: 'New Listing Pending Approval',
			content: `A new listing, '${name}', is awaiting your approval.`
		}
	]);

	if (error) {
		console.error('Naay error sa pag insert og new notif');
	}
}

async function insertingToBasicInfo(
	locals: App.Locals,
	user_id: User['id'],
	branch_info: any,
	pd: { [key: string]: unknown }
): Promise<
	| {
			success: false;
			table: string;
			message: string;
	  }
	| {
			success: true;
			id: number;
	  }
> {
	const loc = pd.location as any;

	// const hasPortInfo = String(pd.port).trim() === '' && String(pd.portDesp).trim() === '';
	const hasPortInfo = String(pd.portDesp).trim() === '';

	const dataToSave = {
		user_id,
		name: pd.businessName,
		category: (pd.main_categ as string).replaceAll(/ /g, ''),
		branch: (pd.sub_categ as string).replaceAll(/ /g, ''),
		branch_info,
		is_approved: null,
		rate: Number(pd.rate),
		description: pd.businessDescription,
		municipality: loc.municipality,
		bgry: loc.baranggay,
		purok: loc.purok,
		map_link: loc.map_link,
		rooms: pd.room ? pd.room : null,
		portInfo: hasPortInfo ? pd.portDesp : null,
		contacts: pd.social_media
	};

	const { data: infoTableResponse, error: infoTableError } = await locals.supabase
		.from('ltsng_basic_info')
		.insert([dataToSave])
		.select();

	if (infoTableError) {
		console.error('ERROR Inserting to info table:', JSON.stringify(infoTableError, null, 2));
		return {
			success: false,
			table: 'info',
			message: `Unable to save, please try again`
		};
	}

	const newRowId = infoTableResponse[0].id as number;
	return {
		success: true,
		id: newRowId
	};
}

async function uploadMedia(
	lstng_id: number,
	locals: App.Locals,
	pd: { [key: string]: unknown },
	formData: FormData
) {
	type AllMedia = {
		src: string;
		type: string;
		lstng_id: number;
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
			return fail(400, {
				success: false,
				table: 'bucket',
				message: `There is an error while uploading media`
			});
		}

		const currentMedia = media[i];

		allMedia.push({
			src: imageResponse.fullPath,
			type: formData.get(name(i, 'type')) as string,
			lstng_id,
			description: currentMedia.desp,
			copyright_link: currentMedia.copyright,
			isThumbnail: currentMedia.isThumbnail === 'true'
		});
	}

	return allMedia;
}

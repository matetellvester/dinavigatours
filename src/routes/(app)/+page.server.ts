import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const role = locals.role;
	if (role) {
		if (role == 1) {
			redirect(303, '/adm');
		}
		if (role == 2) {
			redirect(303, '/b');
		}
	}

	const { data, error } = await locals.supabase
		.from('ltsng_basic_info')
		.select(
			`id, name, rate, description, municipality, bgry, purok, map_link, can_book, media:ltsng_media(src, type, isThumbnail), ratings(rating)`
		)
		.eq('is_approved', true)
		.limit(6);

	return {
		//@ts-ignore
		exploreItems: transformData(data) as (ExploreItem & { can_book: boolean })[]
	};
};

function calculateAverageRating(ratings: { rating: number }[]): number {
	const total = ratings.reduce((sum, rating) => sum + rating.rating, 0);
	const average = Math.round(total / ratings.length); // Round to the nearest whole number
	return average;
}

function transformData(
	data: {
		id: number;
		name: string;
		rate: number;
		description: string;
		municipality: string;
		bgry: string;
		purok: number | null;
		map_link: string;
		can_book: boolean;
		ratings: { rating: number }[];
		media: { src: any; type: any; isThumbnail: any }[];
	}[]
): (ExploreItem & { can_book: boolean })[] {
	if (!data) {
		return [];
	}
	return data.map((item) => {
		const averageRating =
			item.ratings.length > 0 ? calculateAverageRating(item.ratings) : undefined;

		return {
			id: item.id,
			name: item.name,
			rate: item.rate,
			description: item.description,
			municipality: item.municipality,
			bgry: item.bgry,
			purok: item.purok,
			map_link: item.map_link,
			can_book: item.can_book,
			rating:
				averageRating !== undefined
					? { average: averageRating, count: item.ratings.length }
					: undefined,
			media: item.media.map(({ src, type, isThumbnail }) => ({
				src,
				type,
				isThumbnail
			}))
		};
	});
}

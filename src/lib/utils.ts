import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { RequestEvent } from '../routes/$types';
import { format, parseISO } from 'date-fns';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function getUserValue(
	userType: string | number
): UserType | UserRole | undefined | 'Unknown' {
	if (typeof userType === 'string') {
		switch (userType.toLowerCase()) {
			case 'admin':
				return 1;
			case 'business owner':
				return 2;
			case 'Tourist':
				return 3;
			default:
				return undefined;
		}
	}

	switch (userType) {
		case 1:
			return 'admin';
		case 2:
			return 'business owner';
		case 3:
			return 'tourist';
		default:
			return 'Unknown';
	}
}

type Field = {
	mode: 'objectsInObject' | 'objectsInArray';
	name?: string;
};

export function makeNameAttribute(parentField: string, field?: Field) {
	if (field) {
		if (field.mode == 'objectsInArray') {
			return [(entity: string, index?: number) => `${parentField}[${index}][${entity}]`] as const;
		}

		return [(entity: string) => `${parentField}[${field.name}][${entity}]`] as const;
	}
	return [(entity: string) => `${parentField}[${entity}]`] as const;
}

const DIVISIONS = [
	{ amount: 60, name: 'seconds' },
	{ amount: 60, name: 'minutes' },
	{ amount: 24, name: 'hours' },
	{ amount: 7, name: 'days' },
	{ amount: 4.34524, name: 'weeks' },
	{ amount: 12, name: 'months' },
	{ amount: Number.POSITIVE_INFINITY, name: 'years' }
] as const;

const formatter = new Intl.RelativeTimeFormat(undefined, {
	numeric: 'auto'
});

export function formatTimeAgo(date: Date) {
	let duration = (date.getTime() - new Date().getTime()) / 1000;

	for (let i = 0; i <= DIVISIONS.length; i++) {
		const division = DIVISIONS[i];
		if (Math.abs(duration) < division.amount) {
			return formatter.format(Math.round(duration), division.name);
		}
		duration /= division.amount;
	}
}

/**
 * Makuha ug default nga avatar base sa gender o random kung wala gi-specify.
 *
 * @param {('male' | 'female')=} type - Offical na gender nga basihan sa avatar (male o female).
 * @returns {string} - File path sa napili nga avatar.
 */
export function getFallbackAvatar(type?: 'male' | 'female'): string {
	const user = ['/femaleuser.png', '/maleuser.png'] as const;
	if (type) {
		return type === 'male' ? user[0] : user[1];
	}
	return user[Math.floor(Math.random() * user.length)];
}

/**
 * Mukuha og first letter sa unang word sa duha ka strings.
 *
 * @param str1 - Ang una nga string (e-trim ang spaces).
 * @param str2 - Ang ikaduha nga string (e-trim ang spaces).
 * @returns Ang first letter sa unang word sa matag string.
 *
 * Example:
 * ```typescript
 * getFirstLetters("Hello World", "  Typescript  "); // "HT"
 * ```
 */
export function getFirstLetters(str1: string, str2: string): string {
	// E-trim ang strings para tanggal ang extra nga spaces
	const trimmed1 = str1.trim();
	const trimmed2 = str2.trim();

	// Kuhaon ang first letter sa unang word
	const firstLetter1 = trimmed1.charAt(0);
	const firstLetter2 = trimmed2.charAt(0);

	// I-combine ang first letters
	return firstLetter1 + firstLetter2;
}

type Excludes =
	| {
			bgry: boolean | undefined;
			purok: boolean | undefined;
	  }
	| boolean
	| undefined;
/**
 * Mo hatag og proper way na pag display sa location
 */
export function getLocation(
	location: { bgry: string | null; purok?: string; municipality: string } | any,
	excludes: Excludes = {
		bgry: false,
		purok: false
	}
) {
	if (typeof excludes === 'boolean' && excludes === true) {
		return location.municipality;
	}

	const bgry = location.bgry?.trim()
		? typeof excludes !== 'boolean' && excludes?.bgry
			? ''
			: `, ${location.bgry}`
		: '';

	const purok = location.purok
		? typeof excludes !== 'boolean' && excludes?.purok
			? ''
			: ` ${location.purok}`
		: '';

	return location.municipality + bgry + purok;
}

export function getThumbnail<T extends Omit<Media, 'description' | 'copyright_link'>[]>(
	media: T,
	origSrc: boolean = false
): string {
	// Find the item where isThumbnail is true and type is "image"
	const thumbnail = media.find((item) => item.type === 'image' && item.isThumbnail);

	if (thumbnail) {
		// return thumbnail.src;
		return origSrc ? thumbnail.src : getMediaSrc(thumbnail.src);
	}

	// If no isThumbnail is true, return the first item with type "image"
	const firstImage = media.find((item) => item.type === 'image');

	return origSrc
		? firstImage
			? firstImage.src
			: '/fallback_broken_image_link.png'
		: getMediaSrc(firstImage?.src);
}

export function getMediaSrc(src: string | undefined | null, fallbackSrc: boolean = true) {
	if (!src && fallbackSrc) {
		return '/fallback_broken_image_link.png';
	}

	if (!fallbackSrc) {
		return '';
	}

	return 'https://kbbbgnhqlxvswspelkmu.supabase.co/storage/v1/object/public/' + src;
}

type Option = {
	message?: string;
	param?: { key: string; value: any }[];
};

/**
 * Nag-handle sa login redirection pinaagi sa paghimo ug URL nga adunay kasamtangang path ug search parameters.
 *
 * Ang function makadawat either `RequestEvent` o `URL` nga object ug maghimo ug login redirect URL
 * nga adunay `redirectTo` query parameter.
 *
 * @param {RequestEvent | URL} input - Ang event o URL nga kuhaan sa pathname ug search parameters.
 * @returns {string} Ang login redirect URL nga adunay `redirectTo` query parameter.
 */
export function handleLoginRedirect(input: RequestEvent | URL, option?: Option): string {
	let redirectTo: string;

	if ('url' in input) {
		// If input is a RequestEvent
		redirectTo = input.url.pathname + input.url.search;
	} else {
		// If input is a URL
		redirectTo = input.pathname + input.search;
	}

	// Default message if option is not provided
	const message = option?.message || 'You must login first';

	// Build additional query params from option.param
	let extraParams = '';
	if (option?.param) {
		extraParams = option.param
			.map((p) => `${encodeURIComponent(p.key)}=${encodeURIComponent(p.value)}`)
			.join('&');
	}

	// If there are extraParams, append them to the redirectTo
	if (extraParams) {
		redirectTo = `${redirectTo}${redirectTo.includes('?') ? '&' : '?'}${extraParams}`;
	}

	// Encode the entire redirectTo URL
	const encodedRedirectTo = encodeURIComponent(redirectTo);

	// Combine the base redirectTo with extra params and message
	return `/login?redirectTo=${encodedRedirectTo}&message=${encodeURIComponent(message)}`;
}

/**
 * Formats a date string into a readable format.
 *
 * @param {string} dateString - A date string in various formats (e.g., "YYYY-MM-DD", "YYYY-MM-DDTHH:mm:ss.sssZ").
 * @param {boolean} [shortFormat=false] - Whether to use a shorter format (e.g., "Oct 9, 2024").
 * @returns {string} - The formatted date.
 *
 * @example
 * formatDate("2024-10-09"); // Returns "October 9, 2024"
 * formatDate("2024-12-09T13:59:07.323938+00:00", true); // Returns "Dec 9, 2024"
 */
export function formatDate(dateString: string, shortFormat: boolean = false): string {
	let date: Date;

	// Try to parse the date string
	try {
		date = new Date(dateString);
		if (isNaN(date.getTime())) {
			// Fallback to parseISO if Date fails
			date = parseISO(dateString);
		}
	} catch {
		throw new Error(`Invalid date format: ${dateString}`);
	}

	// Determine format
	const dateFormat = shortFormat ? 'MMM d, yyyy' : 'MMMM d, yyyy';

	// Return formatted date
	return format(date, dateFormat);
}

export const statusClass = {
	decline: 'bg-destructive/20 text-destructive hover:bg-destructive/30 rounded-md pb-1 capitalize',
	canceled: 'bg-destructive/20 text-destructive hover:bg-destructive/30 rounded-md pb-1 capitalize',
	approved: 'bg-green-600/20 text-green-600 hover:bg-green-600/30 rounded-md pb-1 capitalize',
	pending: 'bg-yellow-500/20 text-yellow-500 hover:bg-yellow-500/30 rounded-md pb-1 capitalize',
	'check-in': 'bg-primary/20 text-primary hover:bg-primary/30 rounded-md pb-1 capitalize',
	complete: 'bg-border/80 text-secondary-foreground hover:bg-borde rounded-md pb-1 capitalize'
};

export function formatOneTimeEvent(startDate: string, endDate: string): string {
	// Parse the dates into JavaScript Date objects
	const start = new Date(startDate);
	const end = new Date(endDate);

	// Define options for formatting dates
	const monthDayOptions: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' };
	const fullDateOptions: Intl.DateTimeFormatOptions = {
		month: 'short',
		day: 'numeric',
		year: 'numeric'
	};

	// Format the date range
	if (start.getFullYear() === end.getFullYear()) {
		// Same year: e.g., "Aug 14 – Sep 20, 2024"
		return `${start.toLocaleDateString(undefined, monthDayOptions)} – ${end.toLocaleDateString(undefined, fullDateOptions)}`;
	} else {
		// Different years: e.g., "Dec 25, 2024 – Jan 5, 2025"
		return `${start.toLocaleDateString(undefined, fullDateOptions)} – ${end.toLocaleDateString(undefined, fullDateOptions)}`;
	}
}

export function formatMonthlyEvent(month: string, days: string): string {
	// Parse the month number to get the full month name
	const monthIndex = parseInt(month, 10) - 1; // Convert to zero-based index

	const monthName = new Date(0, monthIndex).toLocaleString(undefined, { month: 'long' });

	// Check if days contain a range (dash-separated)
	if (days.includes('-')) {
		const [startDay, endDay] = days.split('-').map((day) => parseInt(day, 10));
		return `${monthName} ${startDay} – ${endDay}`; // Format as "March 3–5"
	}

	// Handle single day
	const singleDay = parseInt(days, 10);
	return `${monthName} ${singleDay}`; // Format as "March 3"
}

export function formatYearlyEvent(monthRange: string, days: string): string {
	// Function to get month names for given month number(s)
	const getMonthNames = (monthRange: string): string[] => {
		const months: string[] = [];
		// Check if monthRange is a range (contains "-")
		if (monthRange.includes('-')) {
			const [startMonth, endMonth] = monthRange.split('-').map((m) => parseInt(m, 10));
			for (let i = startMonth; i <= endMonth; i++) {
				const monthName = new Date(0, i - 1).toLocaleString(undefined, { month: 'long' });
				months.push(monthName);
			}
		} else {
			const monthName = new Date(0, parseInt(monthRange, 10) - 1).toLocaleString(undefined, {
				month: 'long'
			});
			months.push(monthName);
		}
		return months;
	};

	// Handle if monthRange is a range
	if (monthRange.includes('-')) {
		// Days should be a range too if month is a range
		const months = getMonthNames(monthRange);
		const [startDay, endDay] = days.split('-').map((d) => parseInt(d, 10));
		return `${months[0]} ${startDay} - ${months[months.length - 1]} ${endDay}`;
	}

	// If monthRange is not a range (single month), handle day(s)
	const monthName = getMonthNames(monthRange)[0];
	if (days.includes('-')) {
		// Days is a range
		const [startDay, endDay] = days.split('-').map((d) => parseInt(d, 10));
		return `${monthName} ${startDay}-${endDay}`;
	}

	// If days is a single day
	const singleDay = parseInt(days, 10);
	return `${monthName} ${singleDay}`;
}

export function formatTimeRangeEvent(
	time_type: 'default' | 'whole_day' | '24_Hour',
	start_time: string | null,
	end_time: string | null
): string {
	// Helper function to format time to 12-hour format with AM/PM
	const formatTo12Hour = (time: string): string => {
		const [hours, minutes] = time.split(':').map(Number);
		const ampm = hours >= 12 ? 'PM' : 'AM';
		const formattedHours = hours % 12 || 12;
		const formattedMinutes = minutes.toString().padStart(2, '0');
		return `${formattedHours}:${formattedMinutes} ${ampm}`;
	};

	// If the time type is "default"
	if (time_type === 'default') {
		// If start and end time are provided, return a range in 12-hour format with AM/PM
		if (start_time && end_time) {
			return `${formatTo12Hour(start_time)} - ${formatTo12Hour(end_time)}`;
		}

		// If only one time is provided, format it with "starts at"
		if (start_time) {
			return `Starts at: ${formatTo12Hour(start_time)}`;
		}
	}

	// If the time type is "whole_day"
	if (time_type === 'whole_day') {
		return 'Starts at: 12:00 AM';
	}

	// If the time type is "24_Hour"
	if (time_type === '24_Hour') {
		if (start_time && end_time) {
			return `Starts at: ${start_time} - ${end_time}`;
		}
		if (start_time) {
			return `Starts at: ${start_time}`;
		}
	}

	return '';
}

/**
 * Extracts the `src` attribute value from an iframe HTML code string.
 *
 * @param iframeCode - Ang HTML code string nga nagrepresentar sa usa ka iframe.
 * @returns Ang value sa `src` attribute kung kini makita, o `null` kung wala.
 */
export function getIframeLink(iframeCode: string): string | null {
	const srcRegex = /src=["']\s*([^"'\s]*)\s*["']/;
	const match = `${iframeCode}`.match(srcRegex);

	return match && match[1] ? match[1] : null;
}

export function toProperCase(str: string) {
	if (!str) return '';
	return str.charAt(0).toUpperCase() + str.slice(1);
}

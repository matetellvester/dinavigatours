import qs from 'qs';
import type { AllSubCategoryiesType } from './types';

export function getFormData(form: FormData, type: keyof AllSubCategoryiesType) {
	const pd = qs.parse(
		Object.fromEntries(Array.from(form.entries()).map(([key, value]) => [key, value.toString()]))
	);

	if (['IslandHopping', 'BoatTours', 'DayTrips'].includes(type)) {
		return {
			joinin: (pd.joinin as string).trim() || null,
			private: (pd.private as string).trim() || null,
			departureTime: pd.departureTime,
			returnTime: pd.returnTime,
			placeOrder: pd.placeOrder,
			included: pd.included,
			excluded: pd.excluded
		};
	}

	if (['CarRentals', 'MotorcycleRentals', 'BusServices'].includes(type)) {
		return {
			rate: pd.rate,
			basis: pd.basis,
			maximumCapacity: pd.maximumCapacity,
			overdueCharge: pd.overdueCharge
		};
	}

	if (['Hotels', 'Resorts'].includes(type)) {
		return {
			rate: pd.rate,
			from: pd.from,
			to: pd.to,
			roomTypes: pd.roomTypes,
			bedTypes: pd.bedTypes,
			amenities: pd.amenities
		};
	}

	if (type === 'Gyms') {
		return {
			rate: pd.rate,
			basis: pd.basis,
			operationDays: pd.operationDays,
			startTime: pd.startTime,
			endTime: pd.endTime,
			typeOfEquip: pd.typeOfEquip,
			additionalAmenities: pd.additionalAmenities
		};
	}

	if (type === 'MassageTherapy') {
		return {
			rate: pd.rate,
			basis: pd.basis,
			operationDays: pd.operationDays,
			startTime: pd.startTime,
			endTime: pd.endTime,
			typeOfMassage: pd.typeOfMassage
		};
	}

	return {};
}

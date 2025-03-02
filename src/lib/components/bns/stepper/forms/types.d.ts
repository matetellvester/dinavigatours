import { AllSubCategories } from '.';

export type AllSubCategories = (typeof AllSubCategories)[number]['name'];

interface FormSubCategoryName {
	name: string;
	canBcook: boolean;
}

export type Beach = FormSubCategoryName & {
	accommodationType: string;
	details: string;
	capacity: number;
	amenities: string;
	availability: string;
	specialFeatures: string;
	overnightStay: boolean;
	entranceFee: string;
};

export type BusServices = FormSubCategoryName & {
	routeMap: string;
	scheduleTimes: string;
	onboardFacilities: string;
	reservationSystem: string;
};

export type CarRentals = FormSubCategoryName & {
	vehicleTypes: string;
	rentalDuration: string;
	licenseRequirements: string;
	fuelPolicy: string;
};
export type Catering = FormSubCategoryName & {
	cuisineTypes: string;
	menuCustomization: string;
	minOrderQty: number;
	dietaryAccommodations: string;
};
export type Diving = FormSubCategoryName & {
	diveCertification: string;
	diveSites: string;
	equipmentRental: number;
	safetyProtocols: string;
};
export type EventPlanning = FormSubCategoryName & {
	eventTypes: string;
	vendorConnections: string;
	servicePackages: string;
	budgetManagement: number;
};
export type Guesthouses = FormSubCategoryName & {
	roomType: string;
	kitchenAccess: number;
	communityActivities: string;
	longTermStay: string;
};
export type HeritageSites = FormSubCategoryName & {
	historicalSignificance: string;
	guidedTour: boolean;
	entryFee: string;
	visitorRules: string;
};
export type Hiking = FormSubCategoryName & {
	difficultyLevel: string;
	trailLength: string;
	guideRequired: boolean;
	equipmentRecommendations: string;
};
export type Homestays = FormSubCategoryName & {
	hostAvailability: string;
	sharedSpaces: number;
	petPolicy: string;
	culturalExperience: string;
};
export type Hotels = FormSubCategoryName & {
	roomTypes: string;
	amenities: string;
	checkInPolicy: string;
	parkingAvailable: number;
};
export type IslandHopping = FormSubCategoryName & {
	islandsCovered: number;
	boatType: string;
	capacity: number;
	snorkelingGear: number;
	foodProvided: number;
};
export type MassageTherapy = FormSubCategoryName & {
	massageTypes: string;
	appointmentDuration: string;
	licensedTherapist: number;
	genderPreference: string;
};
export type MotorcycleRentals = FormSubCategoryName & {
	motorcycleTypes: string;
	helmetIncluded: number;
	safetyGear: string;
	insurancePolicy: string;
};
export type Photography = FormSubCategoryName & {
	serviceType: string;
	equipmentProvided: string;
	packageOptions: string;
	editingIncluded: number;
};
export type Resorts = FormSubCategoryName & {
	villaTypes: string;
	onSiteActivities: string;
	exclusiveAccess: string;
	familyFriendly: number;
};
export type Restaurants = FormSubCategoryName & {
	cuisineType: string;
	menuUpload: File | null;
	avgPricePerMeal: string;
	reservationRequired: number;
};
export type Saunas = FormSubCategoryName & {
	saunaType: string;
	capacity: number;
	additionalServices: string;
	reservationRequired: number;
};
export type ShuttleServices = FormSubCategoryName & {
	routesDestinations: string;
	shuttleType: string;
	scheduleTimes: string;
	groupDiscount: string;
};
export type TherapeuticServices = FormSubCategoryName & {
	serviceTypes: string;
	licensedPractitioner: boolean;
	appointmentDuration: string;
	insuranceAccepted: boolean;
};
export type TourGuides = FormSubCategoryName & {
	languagesSpoken: string;
	certifications: string;
	specializedAreas: string;
	groupCapacity: number;
};
export type TourPackages = FormSubCategoryName & {
	packageComponents: string;
	totalDuration: string;
	transportationIncluded: boolean;
	groupDiscount: string;
};
export type Tricycles = FormSubCategoryName & {
	serviceArea: string;
	capacity: number;
	operatingHours: string;
	fareInfo: string;
};
export type VacationRentals = FormSubCategoryName & {
	propertyType: string;
	minimumStay: string;
	securityDeposit: string;
	cleaningFee: string;
};
export type Videography = FormSubCategoryName & {
	videoTypes: string;
	droneService: boolean;
	videoEditing: boolean;
	commercialLicensing: boolean;
};
export type WaterSports = FormSubCategoryName & {
	equipmentProvided: boolean;
	safetyCertifications: string;
	activityType: string;
	weatherRestrictions: string;
};
export type Yoga = FormSubCategoryName & {
	classTypes: string;
	classSchedule: string;
	maxClassSize: number;
	matRental: boolean;
};

export type BasicTours = FormSubCategoryName & {
	joinin: string | null;
	private: string | null;
	departureTime: string;
	returnTime: string;
	placeOrder: string[];
	included: string[];
	excluded: string[];
};

export type AllSubCategoryiesType = {
	Beach: Beach;
	BusServices: BusServices;
	BoatTours: BasicTours;
	CarRentals: CarRentals;
	Catering: Catering;
	Diving: Diving;
	DayTrips: BasicTour;
	EventPlanning: EventPlanning;
	Guesthouses: Guesthouses;
	HeritageSites: HeritageSites;
	Hiking: Hiking;
	Homestays: Homestays;
	Hotels: Hotels;
	IslandHopping: BasicTour;
	Gyms: { [key: string]: unknown };
	MassageTherapy: MassageTherapy;
	MotorcycleRentals: MotorcycleRentals;
	Photography: Photography;
	Resorts: Resorts;
	Restaurants: Restaurants;
	Saunas: Saunas;
	ShuttleServices: ShuttleServices;
	TherapeuticServices: TherapeuticServices;
	TourGuides: TourGuides;
	TourPackages: TourPackages;
	Tricycles: Tricycles;
	VacationRentals: VacationRentals;
	Videography: Videography;
	WaterSports: WaterSports;
	Yoga: Yoga;
};

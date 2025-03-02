import {
	Bay,
	BeachTree,
	BeachUmbrella,
	Bonsai,
	Cave,
	Cliff,
	Coral,
	Creek,
	Farm,
	HotSpring,
	Lake,
	OakTree,
	ScubaMask,
	Statue,
	Valley,
	Waterfall
} from '$lib/components/svg';
import type { Component } from 'svelte';

export enum AllAttractions {
	NaturalWaterAttractions = 'Natural Water Attractions',
	GeologicalFeatures = 'Geological Features',
	FloraAndFauna = 'Flora And Fauna',
	AgriculturalAndRuralAttractions = 'Agricultural And Rural Attractions',
	CulturalAndHistoricalSites = 'Cultural And Historical Sites'
}

export const AllAttractionsArrs: Record<keyof typeof AllAttractions, string[]> = {
	NaturalWaterAttractions: [
		'Beach',
		'Coral Reefs',
		'Falls',
		'Lake',
		'River',
		'Spring',
		'Cove',
		'Dive Site'
	],
	GeologicalFeatures: ['Rock Formation', 'Cave', 'Islet', 'Bonsai Forest', 'Mountain'],
	FloraAndFauna: ['Mongrove Area', 'Botanical'],
	AgriculturalAndRuralAttractions: ['Farm', ' Watershed'],
	CulturalAndHistoricalSites: ['Monument', 'Cultural Heritage', 'Religious Sites']
};

export function getAllSubCategAttraction(key: keyof typeof AllAttractions) {
	return [...AllAttractionsArrs[key]];
}

const ConstAllAttractions = [
	'Beach',
	'CoralReefs',
	'Falls',
	'Lake',
	'River',
	'Spring',
	'Cove',
	'DiveSite',
	'RockFormation',
	'Cave',
	'Islet',
	'BonsaiForest',
	'MongroveArea',
	'Botanical',
	'Farm',
	'Watershed',
	'Monument'
] as const;

type AttractionKeys = (typeof ConstAllAttractions)[number];

type AttractionObject = {
	[Key in AttractionKeys]: {
		name: string;
		icon: Component;
	};
};

export const AllAttractionWithIcon: AttractionObject = {
	Beach: { name: 'Beach', icon: BeachUmbrella },
	CoralReefs: { name: 'Coral Reefs', icon: Coral },
	Falls: { name: 'Falls', icon: Waterfall },
	Lake: { name: 'Lake', icon: Lake },
	River: { name: 'River', icon: Creek },
	Spring: { name: 'Spring', icon: HotSpring },
	Cove: { name: 'Cove', icon: Bay },
	DiveSite: { name: 'Dive Site', icon: ScubaMask },
	RockFormation: { name: 'Rock Formation', icon: Cliff },
	Islet: { name: 'Islet', icon: BeachTree },
	Cave: { name: 'Cave', icon: Cave },
	BonsaiForest: { name: 'Bonsai Forest', icon: Farm },
	MongroveArea: { name: 'Mongrove Area', icon: OakTree },
	Botanical: { name: 'Botanical', icon: Bonsai },
	Farm: { name: 'Farm', icon: Farm },
	Watershed: { name: 'Watershed', icon: Valley },
	Monument: { name: 'Monument', icon: Statue }
};

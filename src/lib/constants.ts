export const MUNICIPALITIES = [
	'loreto',
	'tubajon',
	'libjo',
	'basilisa',
	'san jose',
	'dinagat',
	'cagdianao'
] as const;

export const LORETO_OBJ: Bgry[] = [
	{ name: 'carmen', poblacion: true },
	{ name: 'esperanza' },
	{ name: 'ferdinand' },
	{ name: 'helen' },
	{ name: 'liberty' },
	{ name: 'magsaysay' },
	{ name: 'panamaon' },
	{ name: 'san jaun', poblacion: true },
	{ name: 'santa cruz', poblacion: true },
	{ name: 'santiago', poblacion: true }
];

export const TUBAJON_OBJ: Bgry[] = [
	{ name: 'diaz', colloquial: 'Romualdez' },
	{ name: 'imelda' },
	{ name: 'mabini' },
	{ name: 'malinao' },
	{ name: 'navarro' },
	{ name: 'roxas' },
	{ name: 'san roque', poblacion: true },
	{ name: 'san vicente', poblacion: true },
	{ name: 'santa cruz', poblacion: true }
];

export const LIBJO_OBJ: Bgry[] = [
	{ name: 'albor', poblacion: true },
	{ name: 'arellano' },
	{ name: 'bayanihan' },
	{ name: 'doña helen' },
	{ name: 'garcia' },
	{ name: 'general aguinaldo', colloquial: 'Bolod-Bolod' },
	{ name: 'kanihaan' },
	{ name: 'llamera' },
	{ name: 'magsaysay' },
	{ name: 'osmeña' },
	{ name: 'plaridel' },
	{ name: 'quezon' },
	{ name: 'rosita' },
	{ name: 'san antonio', poblacion: true },
	{ name: 'san jose' },
	{ name: 'santo niño' }
];

export const BASILISA_OBJ: Bgry[] = [
	{ name: 'benglen' },
	{ name: 'catadman' },
	{ name: 'columbos' },
	{ name: 'coring' },
	{ name: 'cortes' },
	{ name: 'diegas' },
	{ name: 'doña helene' },
	{ name: 'edera' },
	{ name: 'ferdinand' },
	{ name: 'geotina' },
	{ name: 'imee', colloquial: 'Bactasan' },
	{ name: 'melgar' },
	{ name: 'montag' },
	{ name: 'navarro' },
	{ name: 'new nazareth' },
	{ name: 'rizal' },
	{ name: 'puerto princesa' },
	{ name: 'rita glenda' },
	{ name: 'roma' },
	{ name: 'roxas' },
	{ name: 'santa monica' },
	{ name: 'tag-abaca' },
	{ name: 'santo niño' },
	{ name: 'sering' },
	{ name: 'sombrado' },
	{ name: 'villa ecleo' },
	{ name: 'villa pantinople' }
];

export const SANJOSE_OBJ: Bgry[] = [
	{ name: 'aurelio' },
	{ name: 'cuarinta' },
	{ name: 'don ruben ecleo', colloquial: 'Baltazar' },
	{ name: 'jacquez ' },
	{ name: 'justiniana edera' },
	{ name: 'luna' },
	{ name: 'mahayahay' },
	{ name: 'matingbe' },
	{ name: 'san jose', poblacion: true },
	{ name: 'san juan' },
	{ name: 'santa cruz' },
	{ name: 'wilson' }
];

export const DINAGAT_OBJ: Bgry[] = [
	{ name: 'bagumbayan' },
	{ name: 'cab-ilan' },
	{ name: 'cabayawan' },
	{ name: 'cayetano' },
	{ name: 'escota', poblacion: true },
	{ name: 'gomez' },
	{ name: 'magsaysay' },
	{ name: 'mauswagon', poblacion: true },
	{ name: 'new mabuhay' },
	{ name: 'wadas' },
	{ name: 'white beach', poblacion: true }
];

export const CAGDIANAO_OBJ: Bgry[] = [
	{ name: 'boa' },
	{ name: 'cabunga-an' },
	{ name: 'del pilar' },
	{ name: 'laguna' },
	{ name: 'legaspi' },
	{ name: 'ma-atas' },
	{ name: 'mabini', colloquial: 'Borja' },
	{ name: 'nueva estrella' },
	{ name: 'poblacion' },
	{ name: 'r. ecleo' },
	{ name: 'san jose' },
	{ name: 'santa rita' },
	{ name: 'tigbao' },
	{ name: 'valencia' }
];

export const MUNICIPALITY_OBJS = {
	LORETO_OBJ,
	TUBAJON_OBJ,
	LIBJO_OBJ,
	BASILISA_OBJ,
	SANJOSE_OBJ,
	DINAGAT_OBJ,
	CAGDIANAO_OBJ
};

export const idTypes = [
	{ value: 'philsys', label: 'PhilSys' },
	{ value: 'sss', label: 'SSS' },
	{ value: 'gsis', label: 'GSIS' },
	{ value: 'drivers_license', label: "Driver's License" },
	{ value: 'prc', label: 'PRC' },
	{ value: 'voters_id', label: "Voter's ID" },
	{ value: 'senior_citizen', label: 'Senior Citizen' },
	{ value: 'pwd', label: 'PWD' },
	{ value: 'nbi', label: 'NBI' },
	{ value: 'philhealth', label: 'PhilHealth' }
];

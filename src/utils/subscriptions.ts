import lightStreamInstance from '@/classes/Lightstream';

export const subscribeDatetime = () => {
	return lightStreamInstance.subscribe({
		mode: 'MERGE',
		items: ['time'],
		fields: ['tsetime'],
		snapshot: false,
		dataAdapter: 'RamandRLCDData',
	});
};

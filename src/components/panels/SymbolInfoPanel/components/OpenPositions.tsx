import { useMemo } from 'react';
import Section, { type ITabIem } from '../common/Section';

const OpenPositions = () => {
	const tabs: ITabIem[] = useMemo(
		() => [
			{
				id: 'open_positions',
				title: 'موقعیت‌های باز',
			},
		],
		[],
	);

	return (
		<Section defaultActiveTab='open_positions' tabs={tabs}>
			<div className='px-8 py-16' />
		</Section>
	);
};

export default OpenPositions;

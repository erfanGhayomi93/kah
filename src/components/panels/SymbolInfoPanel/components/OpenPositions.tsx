import { useMemo } from 'react';
import NoData from '../common/NoData';
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
			<NoData />
		</Section>
	);
};

export default OpenPositions;

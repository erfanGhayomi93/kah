import { useMemo } from 'react';
import Section, { type ITabIem } from '../common/Section';

const IndividualAndLegal = () => {
	const tabs: ITabIem[] = useMemo(
		() => [
			{
				id: 'individual_and_legal',
				title: 'حقیقی و حقوقی',
			},
		],
		[],
	);

	return (
		<Section defaultActiveTab='individual_and_legal' tabs={tabs}>
			<div className='px-8 py-16' />
		</Section>
	);
};

export default IndividualAndLegal;

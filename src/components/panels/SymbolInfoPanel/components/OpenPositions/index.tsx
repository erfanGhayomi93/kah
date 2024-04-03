import { useTranslations } from 'next-intl';
import { useMemo } from 'react';
import Section, { type ITabIem } from '../../common/Section';
import UserOpenPositions from './UserOpenPositions';

interface OpenPositionsProps {
	symbolISIN: string;
}

const OpenPositions = ({ symbolISIN }: OpenPositionsProps) => {
	const t = useTranslations();

	const tabs: ITabIem[] = useMemo(
		() => [
			{
				id: 'user_open_positions',
				title: t('symbol_info_panel.user_open_positions'),
			},
		],
		[],
	);

	return (
		<Section defaultActiveTab='user_open_positions' tabs={tabs}>
			<UserOpenPositions />
		</Section>
	);
};

export default OpenPositions;

import { useTranslations } from 'next-intl';
import { useMemo } from 'react';
import Section, { type ITabIem } from '../../common/Section';
import Contracts from './Contracts';

interface ContractsProps {
	symbolISIN: string;
}

const SymbolContracts = ({ symbolISIN }: ContractsProps) => {
	const t = useTranslations();

	const tabs: ITabIem[] = useMemo(
		() => [
			{
				id: 'contracts',
				title: t('symbol_info_panel.contracts'),
			},
		],
		[],
	);

	return (
		<Section defaultActiveTab='contracts' tabs={tabs}>
			<Contracts symbolISIN={symbolISIN} />
		</Section>
	);
};

export default SymbolContracts;

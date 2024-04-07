import { useTranslations } from 'next-intl';
import { useMemo } from 'react';
import Section, { type ITabIem } from '../../common/Section';
import Symbols from './Symbols';

interface SameSectorSymbolProps {
	symbolISIN: string;
}

const SameSectorSymbol = ({ symbolISIN }: SameSectorSymbolProps) => {
	const t = useTranslations();

	const tabs: ITabIem[] = useMemo(
		() => [
			{
				id: 'same_sector',
				title: t('symbol_info_panel.same_sector'),
			},
		],
		[],
	);

	return (
		<Section name='same_sector_symbols' defaultActiveTab='same_sector' tabs={tabs}>
			<Symbols symbolISIN={symbolISIN} />
		</Section>
	);
};

export default SameSectorSymbol;

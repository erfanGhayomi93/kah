import { useTranslations } from 'next-intl';
import NoData from './common/NoData';
import Section from './common/Section';

interface SymbolContractsProps {
	selectedSymbol: null | Option.SymbolSearch;
}

const SymbolContracts = ({ selectedSymbol }: SymbolContractsProps) => {
	const t = useTranslations();

	if (!selectedSymbol)
		return (
			<Section style={{ flex: '1.8 1 76rem' }} className='flex-justify-center'>
				<NoData text={t('option_chain.select_symbol_from_top_list')} />
			</Section>
		);

	return <Section style={{ flex: '1.8 1 76rem' }} />;
};

export default SymbolContracts;

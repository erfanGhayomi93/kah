import { useBaseSettlementDaysQuery } from '@/api/queries/optionQueries';
import Loading from '@/components/common/Loading';
import { useTranslations } from 'next-intl';
import NoData from './common/NoData';
import Section from './common/Section';

interface SymbolContractsProps {
	selectedSymbol: null | Option.SymbolSearch;
}

const SymbolContracts = ({ selectedSymbol }: SymbolContractsProps) => {
	const t = useTranslations();

	const { data: settlementDays, isFetching } = useBaseSettlementDaysQuery({
		queryKey: ['baseSettlementDaysQuery', selectedSymbol?.symbolISIN ?? null],
	});

	if (!selectedSymbol)
		return (
			<Section style={{ flex: '1.8 1 40rem' }} className='relative flex-justify-center'>
				<NoData text={t('option_chain.select_symbol_from_top_list')} />
			</Section>
		);

	if (isFetching)
		return (
			<div style={{ flex: '1.8 1 40rem' }} className='relative flex flex-column'>
				<Loading />
			</div>
		);

	if (Array.isArray(settlementDays) && settlementDays.length === 0)
		return (
			<Section style={{ flex: '1.8 1 40rem' }} className='relative flex-justify-center'>
				<NoData text={t('option_chain.no_contract_found')} />
			</Section>
		);

	return <div style={{ flex: '1.8 1 40rem' }} className='flex-column'></div>;
};

export default SymbolContracts;

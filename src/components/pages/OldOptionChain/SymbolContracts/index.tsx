import { useBaseSettlementDaysQuery } from '@/api/queries/optionQueries';
import Loading from '@/components/common/Loading';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import NoData from '../common/NoData';
import Contract from './Contract';

interface SymbolContractsProps {
	selectedSymbol: null | string;
}

const SymbolContracts = ({ selectedSymbol }: SymbolContractsProps) => {
	const t = useTranslations();

	const { data: settlementDays, isFetching } = useBaseSettlementDaysQuery({
		queryKey: ['baseSettlementDaysQuery', selectedSymbol ?? null],
	});

	const [expandedContract, setExpandedContract] = useState<null | Option.BaseSettlementDays>(null);

	if (!selectedSymbol) return <NoData text={t('old_option_chain.select_symbol_from_top_list')} />;

	if (isFetching) return <Loading />;

	if (!settlementDays || (Array.isArray(settlementDays) && settlementDays.length === 0))
		return <NoData text={t('old_option_chain.no_contract_found')} />;

	return settlementDays.map((item, index) => (
		<Contract
			key={index}
			expand={item.contractEndDate === expandedContract?.contractEndDate}
			onToggle={() =>
				setExpandedContract(item.contractEndDate === expandedContract?.contractEndDate ? null : item)
			}
			{...item}
		/>
	));
};

export default SymbolContracts;

import { useBaseSettlementDaysQuery, useWatchlistBySettlementDateQuery } from '@/api/queries/optionQueries';
import Select from '@/components/common/Inputs/Select';
import dayjs from '@/libs/dayjs';
import { useTranslations } from 'next-intl';
import ContractSearch from './ContractSearch';
import SymbolSearch from './SymbolSearch';

interface SelectSymbolProps {
	inputs: IBlackScholesModalStates;
	setInputValue: <T extends keyof IBlackScholesModalStates>(field: T, value: IBlackScholesModalStates[T]) => void;
}

const SelectSymbol = ({ inputs, setInputValue }: SelectSymbolProps) => {
	const t = useTranslations();

	const baseSymbolISINIsSelected = Boolean(inputs.baseSymbol?.symbolISIN);

	const contractEndDateIsSelected = Boolean(inputs.contractEndDate?.contractEndDate);

	const { data: settlementDays, isFetching: isFetchingSettlementDays } = useBaseSettlementDaysQuery({
		queryKey: ['baseSettlementDaysQuery', inputs.baseSymbol?.symbolISIN ?? null],
		enabled: baseSymbolISINIsSelected,
	});

	const { data: watchlistData, isLoading: isLoadingWatchlistData } = useWatchlistBySettlementDateQuery({
		queryKey: [
			'watchlistBySettlementDateQuery',
			inputs.baseSymbol?.symbolISIN && inputs.contractEndDate?.contractEndDate
				? {
						baseSymbolISIN: inputs.baseSymbol.symbolISIN,
						settlementDate: inputs.contractEndDate.contractEndDate,
					}
				: null,
		],
		enabled: baseSymbolISINIsSelected && contractEndDateIsSelected,
	});

	const dateFormatter = (d: string) => {
		return dayjs(d ?? '')
			.calendar('jalali')
			.format('YYYY/MM/DD');
	};

	return (
		<div className='flex gap-8 border-b border-b-gray-500 py-24'>
			<div className='flex-1'>
				<SymbolSearch value={inputs.baseSymbol} onChange={(value) => setInputValue('baseSymbol', value)} />
			</div>

			<div className='flex-1'>
				{inputs.baseSymbol && (
					<Select<IBlackScholesModalStates['contractEndDate']>
						options={settlementDays ?? []}
						value={inputs.contractEndDate}
						loading={isFetchingSettlementDays}
						placeholder={t('black_scholes_modal.contract_end_date')}
						getOptionId={(option) => option!.contractEndDate}
						getOptionTitle={(option) => dateFormatter(option!.contractEndDate)}
						onChange={(value) => setInputValue('contractEndDate', value)}
						classes={{
							root: '!h-48',
						}}
					/>
				)}
			</div>

			<div className='flex-1'>
				{inputs.baseSymbol && (
					<ContractSearch
						isLoading={isLoadingWatchlistData}
						options={watchlistData ?? []}
						value={inputs.contract}
						onChange={(value) => setInputValue('contract', value)}
					/>
				)}
			</div>
		</div>
	);
};

export default SelectSymbol;

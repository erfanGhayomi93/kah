import { useBaseSettlementDaysQuery, useWatchlistBySettlementDateQuery } from '@/api/queries/optionQueries';
import Select from '@/components/common/Inputs/Select';
import BaseSymbolSearch from '@/components/common/Symbol/BaseSymbolSearch';
import dayjs from '@/libs/dayjs';
import { useTranslations } from 'next-intl';
import ContractSearch from './ContractSearch';

interface SelectSymbolProps {
	basis: 'base' | 'contract';
	inputs: IBlackScholesModalStates;
	setInputValue: <T extends keyof IBlackScholesModalStates>(field: T, value: IBlackScholesModalStates[T]) => void;
}

const SelectSymbol = ({ basis, inputs, setInputValue }: SelectSymbolProps) => {
	const t = useTranslations();

	const baseSymbolISINIsSelected = Boolean(inputs.baseSymbol?.symbolISIN);

	const contractEndDateIsSelected = Boolean(inputs.contractEndDate?.contractEndDate);

	const { data: settlementDays, isFetching: isFetchingSettlementDays } = useBaseSettlementDaysQuery({
		queryKey: ['baseSettlementDaysQuery', inputs.baseSymbol?.symbolISIN ?? null],
		enabled: basis === 'base' && baseSymbolISINIsSelected,
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
		enabled: basis === 'base' && baseSymbolISINIsSelected && contractEndDateIsSelected,
	});

	const dateFormatter = (d: string) => {
		return dayjs(d ?? '')
			.calendar('jalali')
			.format('YYYY/MM/DD');
	};

	return (
		<div className='flex gap-8 border-b border-b-gray-500 pb-24'>
			{basis === 'base' && (
				<>
					<div className='flex-1'>
						<BaseSymbolSearch
							value={inputs.baseSymbol}
							onChange={(value) => setInputValue('baseSymbol', value)}
							classes={{
								root: '!h-48',
							}}
						/>
					</div>

					<div className='flex-1'>
						<Select<IBlackScholesModalStates['contractEndDate']>
							options={settlementDays ?? []}
							value={inputs.contractEndDate}
							loading={isFetchingSettlementDays}
							placeholder={t('black_scholes_modal.contract_end_date')}
							getOptionId={(option) => option!.contractEndDate}
							getOptionTitle={(option) => dateFormatter(option!.contractEndDate)}
							onChange={(value) => setInputValue('contractEndDate', value)}
							disabled={!inputs.baseSymbol}
							classes={{
								root: '!h-48',
							}}
						/>
					</div>
				</>
			)}

			<ContractSearch
				basis={basis}
				isLoading={isLoadingWatchlistData}
				disabled={!inputs.baseSymbol || !inputs.contractEndDate}
				options={watchlistData ?? []}
				value={inputs.contract}
				onChange={(value) => setInputValue('contract', value)}
			/>
		</div>
	);
};

export default SelectSymbol;

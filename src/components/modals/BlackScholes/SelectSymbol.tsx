import { useBaseSettlementDaysQuery } from '@/api/queries/optionQueries';
import Select from '@/components/common/Inputs/Select';
import dayjs from '@/libs/dayjs';
import { useTranslations } from 'next-intl';
import SymbolSearch from './SymbolSearch';

interface SelectSymbolProps {
	inputs: IBlackScholesModalStates;
	setInputValue: <T extends keyof IBlackScholesModalStates>(field: T, value: IBlackScholesModalStates[T]) => void;
}

const SelectSymbol = ({ inputs, setInputValue }: SelectSymbolProps) => {
	const t = useTranslations();

	const { data: settlementDays, isFetching: isFetchingSettlementDays } = useBaseSettlementDaysQuery({
		queryKey: ['baseSettlementDaysQuery', inputs.baseSymbol?.symbolISIN ?? null],
		enabled: Boolean(inputs.baseSymbol?.symbolISIN),
	});

	const dateFormatter = (d: string) => {
		return dayjs(d ?? '')
			.calendar('jalali')
			.format('YYYY/MM/DD');
	};

	return (
		<div className='flex gap-8 border-b border-b-gray-500 py-24'>
			<div className='flex-1'>
				<SymbolSearch
					value={inputs.baseSymbol}
					placeholder={t('black_scholes_modal.base_symbol')}
					onChange={(value) => setInputValue('baseSymbol', value)}
				/>
			</div>

			<div className='flex-1'>
				{inputs.baseSymbol && (
					<Select<IBlackScholesModalStates['contract']>
						options={settlementDays ?? []}
						value={inputs.contract}
						loading={isFetchingSettlementDays}
						placeholder={t('black_scholes_modal.contract_end_date')}
						getOptionId={(option) => option!.baseSymbolISIN}
						getOptionTitle={(option) => dateFormatter(option!.contractEndDate)}
						onChange={(value) => setInputValue('contract', value)}
						classes={{
							root: '!h-48',
						}}
					/>
				)}
			</div>

			<div className='flex-1'>
				{inputs.baseSymbol && (
					<Select<IBlackScholesModalStates['selectedStrikePrice']>
						options={[]}
						value={inputs.selectedStrikePrice}
						placeholder={t('black_scholes_modal.strike_price')}
						getOptionId={(price) => price ?? ''}
						getOptionTitle={(price) => price ?? ''}
						onChange={(value) => setInputValue('selectedStrikePrice', value)}
						classes={{
							root: '!h-48',
						}}
					/>
				)}
			</div>
		</div>
	);
};

export default SelectSymbol;

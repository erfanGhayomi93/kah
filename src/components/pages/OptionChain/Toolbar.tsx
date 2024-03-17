import { useBaseSettlementDaysQuery } from '@/api/queries/optionQueries';
import BaseSymbolSearch from '@/components/common/Symbol/BaseSymbolSearch';
import OptionWatchlistManagerSVG from '@/components/icons/OptionWatchlistManagerSVG';
import dayjs from '@/libs/dayjs';
import { sepNumbers } from '@/utils/helpers';
import clsx from 'clsx';
import { useTranslations } from 'next-intl';

interface ToolbarProps {
	inputs: OptionChainFilters;
	setInputValue: <T extends keyof OptionChainFilters>(name: T, value: OptionChainFilters[T]) => void;
}

const Toolbar = ({ inputs, setInputValue }: ToolbarProps) => {
	const t = useTranslations();

	const { data: settlementDays, isFetching } = useBaseSettlementDaysQuery({
		queryKey: ['baseSettlementDaysQuery', inputs.baseSymbol?.symbolISIN ?? null],
		enabled: Boolean(inputs.baseSymbol),
	});

	const dateFormatter = (v: string) => {
		const d = dayjs(v).calendar('jalali');
		if (!d.isValid()) return '−';

		return d.locale('fa').format('DD MMMM');
	};

	return (
		<div style={{ flex: '0 0 5.6rem' }} className='flex-1 rounded bg-white px-16 flex-justify-between'>
			<div className='gap-24 flex-items-center'>
				<div style={{ flex: '0 0 25.6rem' }}>
					<BaseSymbolSearch
						value={inputs.baseSymbol}
						onChange={(value) => setInputValue('baseSymbol', value)}
					/>
				</div>

				<div className='gap-8 flex-items-center'>
					{isFetching ? (
						<>
							<div className='skeleton h-40 w-80 rounded' />
							<div className='skeleton h-40 w-80 rounded' />
						</>
					) : (
						<ul className='flex gap-8'>
							{settlementDays?.map((item) => (
								<li key={item.contractEndDate}>
									<button
										onClick={() => setInputValue('settlementDay', item)}
										type='button'
										className={clsx(
											'h-40 w-80 rounded border transition-colors',
											inputs.settlementDay?.contractEndDate === item.contractEndDate
												? 'font-medium btn-primary-100'
												: 'border-gray-500 text-gray-900 hover:border-primary-100 hover:bg-primary-100',
										)}
									>
										{dateFormatter(item.contractEndDate)}
									</button>
								</li>
							))}
						</ul>
					)}
				</div>
			</div>

			<div className='gap-8 flex-items-center'>
				{inputs.baseSymbol && (
					<div className='h-40 rounded bg-gray-200 px-8 flex-items-center'>
						<span className='gap-4 text-base text-gray-900 flex-items-center'>
							{t('option_chain.total_open_contracts')}:
							<span className='font-medium text-gray-1000'>{sepNumbers('312754')}</span>
						</span>
					</div>
				)}

				<button type='button' className='btn-info-outline h-40 rounded px-16'>
					{t('option_chain.base_symbol_info')}
				</button>

				<OptionWatchlistManagerSVG
					className='size-40 rounded border border-gray-500 bg-transparent transition-colors flex-justify-center hover:border-primary-400 hover:bg-primary-400'
					type='button'
				/>
			</div>
		</div>
	);
};

export default Toolbar;

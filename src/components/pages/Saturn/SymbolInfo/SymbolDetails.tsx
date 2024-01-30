import SymbolState from '@/components/common/SymbolState';
import { GrowDownSVG, GrowUpSVG, InfoSVG } from '@/components/icons';
import dayjs from '@/libs/dayjs';
import { numFormatter, sepNumbers } from '@/utils/helpers';
import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import { useMemo } from 'react';

type TValue = string | React.ReactNode;

interface Item {
	id: string;
	title: string;
	valueFormatter: (() => TValue) | TValue;
}

const ListItem = ({ title, valueFormatter }: Item) => (
	<div className='w-1/2 px-8 flex-justify-between'>
		<span className='text-gray-900 whitespace-nowrap text-base'>{title}</span>
		<span className='text-gray-1000 text-base font-medium ltr'>
			{typeof valueFormatter === 'function' ? valueFormatter() : valueFormatter}
		</span>
	</div>
);

interface IProgressBar {
	side: 'buy' | 'sell';
	legalVolume: number;
	individualVolume: number;
}

const ProgressBar = ({ side, individualVolume, legalVolume }: IProgressBar) => {
	const t = useTranslations();

	const bgColor = side === 'buy' ? 'bg-success-100' : 'bg-error-100';
	const bgAlphaColor = side === 'buy' ? 'bg-success-100/10' : 'bg-error-100/10';

	const percent = (individualVolume / (individualVolume + legalVolume)) * 100;

	return (
		<div className='flex-1 gap-4 flex-column'>
			<div className='gap-16 flex-justify-center'>
				<div className='gap-4 flex-items-center'>
					<span style={{ width: '6px', height: '6px' }} className={`rounded-circle ${bgColor}`} />
					<span className='text-gray-1000 text-base'>
						{t('saturn.individual')}
						<span className='text-tiny ltr'> {percent.toFixed(2)}%</span>
					</span>
				</div>

				<div className='gap-4 flex-items-center'>
					<span style={{ width: '6px', height: '6px' }} className={`rounded-circle ${bgAlphaColor}`} />
					<span className='text-gray-1000 text-base'>
						{t('saturn.legal')}
						<span className='text-tiny ltr'> {(100 - percent).toFixed(2)}%</span>
					</span>
				</div>
			</div>

			<div className={`min-h-8 flex-1 overflow-hidden rounded-oval rtl ${bgAlphaColor}`}>
				<div style={{ width: `${percent}%` }} className={`min-h-8 ${bgColor}`} />
			</div>
		</div>
	);
};

interface SymbolDetailsProps {
	symbol: Symbol.Info;
}

const SymbolDetails = ({ symbol }: SymbolDetailsProps) => {
	const t = useTranslations();

	const symbolDetails = useMemo<Array<[Item, Item]>>(() => {
		try {
			const {
				tradeVolume,
				oneMonthAvgVolume,
				closingPrice,
				closingPriceVarReferencePrice,
				closingPriceVarReferencePricePercent,
				tradeValue,
				tradeCount,
				lastTradeDate,
				avgIV,
				hv,
			} = symbol;

			return [
				[
					{
						id: 'tradeVolume',
						title: t('option_chain.trade_volume'),
						valueFormatter: numFormatter(tradeVolume),
					},
					{
						id: 'closingPrice',
						title: t('option_chain.closing_price'),
						valueFormatter: (
							<span
								className={clsx(
									'gap-4 flex-items-center',
									closingPriceVarReferencePricePercent >= 0 ? 'text-success-200' : 'text-error-200',
								)}
							>
								{sepNumbers(String(closingPrice))}
								<span className='text-tiny ltr'>
									{closingPriceVarReferencePrice} (
									{(closingPriceVarReferencePricePercent ?? 0).toFixed(2)} %)
								</span>
							</span>
						),
					},
				],
				[
					{
						id: 'tradeValue',
						title: t('option_chain.trade_value'),
						valueFormatter: numFormatter(tradeValue),
					},
					{
						id: 'tradeCount',
						title: t('option_chain.trade_count'),
						valueFormatter: sepNumbers(String(tradeCount)),
					},
				],
				[
					{
						id: 'avg30',
						title: t('option_chain.avg_volume', { days: 30 }),
						valueFormatter: oneMonthAvgVolume ?? '−',
					},
					{
						id: 'lastTradeDate',
						title: t('option_chain.last_trade_date'),
						valueFormatter: dayjs(lastTradeDate).calendar('jalali').format('HH:mm:ss'),
					},
				],
				[
					{
						id: 'avgIV',
						title: t('option_chain.avg_iv'),
						valueFormatter: () => {
							const valueAsNumber = Number(avgIV);
							if (isNaN(valueAsNumber)) return '−';

							return sepNumbers(valueAsNumber.toFixed(2));
						},
					},
					{
						id: 'hv',
						title: t('option_chain.hv'),
						valueFormatter: sepNumbers(hv?.toFixed(2)),
					},
				],
			];
		} catch (error) {
			return [];
		}
	}, [symbol]);

	const {
		closingPriceVarReferencePrice,
		symbolTradeState,
		symbolTitle,
		closingPrice,
		lastTradedPrice,
		companyName,
		individualBuyVolume,
		individualSellVolume,
		legalBuyVolume,
		legalSellVolume,
	} = symbol;

	return (
		<div style={{ flex: '0 0 calc(50% - 1.8rem)' }} className='gap-40 flex-column'>
			<div className='flex-column'>
				<div style={{ gap: '7.8rem' }} className='flex-items-center'>
					<div style={{ gap: '1rem' }} className='flex-items-center'>
						<SymbolState state={symbolTradeState} />
						<h1 className='text-gray-1000 text-3xl font-medium'>{symbolTitle}</h1>
					</div>

					<div className='gap-8 flex-items-center'>
						<span
							className={clsx(
								'gap-4 flex-items-center',
								closingPriceVarReferencePrice >= 0 ? 'text-success-100' : 'text-error-100',
							)}
						>
							<span className='flex items-center text-tiny ltr'>
								({(closingPriceVarReferencePrice ?? 0).toFixed(2)} %)
								{closingPriceVarReferencePrice >= 0 ? (
									<GrowUpSVG width='1rem' height='1rem' />
								) : (
									<GrowDownSVG width='1rem' height='1rem' />
								)}
							</span>
							{sepNumbers(String(closingPrice))}
						</span>

						<span
							className={clsx(
								'flex items-center gap-4 text-4xl font-bold',
								closingPriceVarReferencePrice >= 0 ? 'text-success-200' : 'text-error-200',
							)}
						>
							{sepNumbers(String(lastTradedPrice))}
							<span className='text-gray-900 text-base font-normal'>{t('common.rial')}</span>
						</span>
					</div>
				</div>

				<h4 className='text-gray-1000 whitespace-nowrap pr-20 text-tiny'>{companyName}</h4>
			</div>

			<ul className='flex flex-column'>
				{symbolDetails.map(([firstItem, secondItem], i) => (
					<li key={firstItem.id} className={clsx('h-32 gap-16 flex-justify-between', i % 2 && 'bg-gray-200')}>
						<ListItem {...firstItem} />
						<ListItem {...secondItem} />
					</li>
				))}
			</ul>

			<div className='w-full items-center gap-32 flex-justify-between'>
				<ProgressBar side='buy' individualVolume={individualBuyVolume} legalVolume={legalBuyVolume} />
				<div className='pt-16'>
					<button
						type='button'
						style={{ minWidth: '2.4rem', minHeight: '2.4rem' }}
						className='text-gray-1000 rounded-sm border border-gray-500 bg-gray-200 flex-justify-center'
					>
						<InfoSVG width='1.6rem' height='1.6rem' />
					</button>
				</div>
				<ProgressBar side='sell' individualVolume={individualSellVolume} legalVolume={legalSellVolume} />
			</div>
		</div>
	);
};

export default SymbolDetails;

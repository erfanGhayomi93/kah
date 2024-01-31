import SymbolSummary, { type ListItemProps } from '@/components/common/Symbol/SymbolSummary';
import SymbolState from '@/components/common/SymbolState';
import { GrowDownSVG, GrowUpSVG, InfoSVG } from '@/components/icons';
import dayjs from '@/libs/dayjs';
import { numFormatter, sepNumbers } from '@/utils/helpers';
import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import { useMemo } from 'react';

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
					<span className='text-base text-gray-1000'>
						{t('saturn_page.individual')}
						<span className='text-tiny ltr'> {percent.toFixed(2)}%</span>
					</span>
				</div>

				<div className='gap-4 flex-items-center'>
					<span style={{ width: '6px', height: '6px' }} className={`rounded-circle ${bgAlphaColor}`} />
					<span className='text-base text-gray-1000'>
						{t('saturn_page.legal')}
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

	const symbolDetails = useMemo<Array<[ListItemProps, ListItemProps]>>(() => {
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
				<div style={{ gap: '7.8rem' }} className='pl-8 flex-justify-between'>
					<div style={{ gap: '1rem' }} className='flex-items-center'>
						<SymbolState state={symbolTradeState} />
						<h1 className='text-3xl font-medium text-gray-1000'>{symbolTitle}</h1>
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
							<span className='text-base font-normal text-gray-900'>{t('common.rial')}</span>
						</span>
					</div>
				</div>

				<h4 className='whitespace-nowrap pr-20 text-tiny text-gray-1000'>{companyName}</h4>
			</div>

			<SymbolSummary data={symbolDetails} />

			<div style={{ gap: '8.8rem' }} className='relative w-full items-center flex-justify-between'>
				<ProgressBar side='buy' individualVolume={individualBuyVolume} legalVolume={legalBuyVolume} />
				<div className='absolute left-1/2 -translate-x-1/2 transform pt-24'>
					<button
						type='button'
						style={{ minWidth: '2.4rem', minHeight: '2.4rem' }}
						className='rounded-sm border border-gray-500 bg-gray-200 text-gray-1000 flex-justify-center'
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

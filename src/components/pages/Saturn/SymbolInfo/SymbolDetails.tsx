import { type ItemUpdate } from '@/classes/Subscribe';
import SymbolSummary, { type ListItemProps } from '@/components/common/Symbol/SymbolSummary';
import SymbolPriceSlider from '@/components/common/SymbolPriceSlider';
import { GrowDownSVG, GrowUpSVG } from '@/components/icons';
import { useTradingFeatures } from '@/hooks';
import useSubscription from '@/hooks/useSubscription';
import { cn, dateFormatter, getColorBasedOnPercent, numFormatter, sepNumbers } from '@/utils/helpers';
import { subscribeSymbolInfo } from '@/utils/subscriptions';
import { useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { useEffect, useMemo } from 'react';
import SymbolContextMenu from '../../../common/Symbol/SymbolContextMenu';
import SymbolSearchToggler from './SymbolSearchToggler';

interface SymbolDetailsProps {
	symbol: Symbol.Info;
}

const SymbolDetails = ({ symbol }: SymbolDetailsProps) => {
	const t = useTranslations();

	const queryClient = useQueryClient();

	const { subscribe } = useSubscription();

	const { addBuySellModal } = useTradingFeatures();

	const onSymbolUpdate = (updateInfo: ItemUpdate) => {
		const queryKey = ['symbolInfoQuery', symbol === null ? null : symbol.symbolISIN];
		const visualData = JSON.parse(JSON.stringify(queryClient.getQueryData(queryKey))) as Symbol.Info;

		updateInfo.forEachChangedField((fieldName, _b, value) => {
			try {
				if (value && fieldName in symbol) {
					const valueAsNumber = Number(value);

					// @ts-expect-error: Lightstream returns the wrong data type
					visualData[fieldName as keyof Symbol.Info] = isNaN(valueAsNumber) ? value : valueAsNumber;
				}
			} catch (e) {
				//
			}
		});

		queryClient.setQueryData(queryKey, visualData);
	};

	const addBsModal = (side: TBsSides) => {
		if (!symbol) return;

		const { symbolISIN, symbolTitle } = symbol;

		addBuySellModal({
			side,
			mode: 'create',
			symbolISIN,
			symbolTitle,
		});
	};

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
						title: t('old_option_chain.trade_volume'),
						valueFormatter: numFormatter(tradeVolume),
					},
					{
						id: 'closingPrice',
						title: t('old_option_chain.closing_price'),
						valueFormatter: (
							<span
								className={cn(
									'gap-4 flex-items-center',
									getColorBasedOnPercent(closingPriceVarReferencePricePercent),
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
						title: t('old_option_chain.trade_value'),
						valueFormatter: numFormatter(tradeValue),
					},
					{
						id: 'tradeCount',
						title: t('old_option_chain.trade_count'),
						valueFormatter: sepNumbers(String(tradeCount)),
					},
				],
				[
					{
						id: 'avg30',
						title: t('old_option_chain.avg_volume', { days: 30 }),
						valueFormatter: sepNumbers(String(oneMonthAvgVolume ?? 0)),
					},
					{
						id: 'lastTradeDate',
						title: t('old_option_chain.last_trade_date'),
						valueFormatter: dateFormatter(lastTradeDate, 'datetime'),
					},
				],
				[
					{
						id: 'avgIV',
						title: t('old_option_chain.avg_iv'),
						valueFormatter: () => {
							const valueAsNumber = Number(avgIV);
							if (isNaN(valueAsNumber)) return '−';

							return sepNumbers(valueAsNumber.toFixed(2));
						},
					},
					{
						id: 'hv',
						title: t('old_option_chain.hv'),
						valueFormatter: sepNumbers(hv?.toFixed(2)),
					},
				],
			];
		} catch (error) {
			return [];
		}
	}, [symbol]);

	useEffect(() => {
		const sub = subscribeSymbolInfo(symbol.symbolISIN, 'symbolData,individualLegal');
		sub.addEventListener('onItemUpdate', onSymbolUpdate);

		subscribe(sub);
	}, [symbol.symbolISIN]);

	const {
		symbolTradeState,
		symbolTitle,
		companyName,
		closingPriceVarReferencePrice,
		closingPriceVarReferencePricePercent,
		closingPrice,
		lastTradedPrice,
		yesterdayClosingPrice,
		lowThreshold,
		highThreshold,
		lowPrice,
		highPrice,
	} = symbol;

	return (
		<div className='gap-32 flex-column'>
			<div className='gap-32 flex-column'>
				<div className='flex-justify-between'>
					<SymbolSearchToggler
						symbolTradeState={symbolTradeState}
						symbolTitle={symbolTitle}
						companyName={companyName}
					/>

					<div className='h-fit gap-8 text-base flex-items-center'>
						<span
							className={cn(
								'gap-4 ltr flex-items-center',
								getColorBasedOnPercent(closingPriceVarReferencePricePercent),
							)}
						>
							{sepNumbers(String(closingPriceVarReferencePrice ?? 0))}
							<span className='flex items-center'>
								({(closingPriceVarReferencePricePercent ?? 0).toFixed(2)} %)
								{closingPriceVarReferencePricePercent > 0 && <GrowUpSVG width='1rem' height='1rem' />}
								{closingPriceVarReferencePricePercent < 0 && <GrowDownSVG width='1rem' height='1rem' />}
							</span>
						</span>

						<span className='flex items-center gap-4 text-2xl font-bold'>
							{sepNumbers(String(lastTradedPrice ?? 0))}
							<span className='text-base font-normal text-gray-700'>{t('common.rial')}</span>
						</span>

						<SymbolContextMenu symbol={symbol ?? null} />
					</div>
				</div>

				<div className='flex gap-8'>
					<button onClick={() => addBsModal('buy')} type='button' className='h-40 flex-1 rounded btn-success'>
						{t('side.buy')}
					</button>
					<button onClick={() => addBsModal('sell')} type='button' className='h-40 flex-1 rounded btn-error'>
						{t('side.sell')}
					</button>
				</div>
			</div>

			<div className='gap-32 flex-column'>
				<SymbolPriceSlider
					yesterdayClosingPrice={yesterdayClosingPrice ?? 0}
					thresholdData={[lowThreshold ?? 0, highThreshold ?? 0]}
					exchangeData={[closingPrice ?? 0, lastTradedPrice ?? 0]}
					boundaryData={[lowPrice ?? 0, highPrice ?? 0]}
				/>

				<SymbolSummary data={symbolDetails} />
			</div>
		</div>
	);
};

export default SymbolDetails;

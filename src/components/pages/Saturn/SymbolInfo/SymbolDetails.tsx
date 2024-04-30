import { type ItemUpdate } from '@/classes/Subscribe';
import SymbolSummary, { type ListItemProps } from '@/components/common/Symbol/SymbolSummary';
import SymbolPriceSlider from '@/components/common/SymbolPriceSlider';
import SymbolState from '@/components/common/SymbolState';
import { GrowDownSVG, GrowUpSVG } from '@/components/icons';
import { useAppDispatch } from '@/features/hooks';
import { setSymbolInfoPanel } from '@/features/slices/panelSlice';
import { useTradingFeatures } from '@/hooks';
import usePrevious from '@/hooks/usePrevious';
import useSubscription from '@/hooks/useSubscription';
import dayjs from '@/libs/dayjs';
import { cn, numFormatter, sepNumbers } from '@/utils/helpers';
import { subscribeSymbolInfo } from '@/utils/subscriptions';
import { useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { useEffect, useMemo } from 'react';
import SymbolContextMenu from '../../../common/Symbol/SymbolContextMenu';

interface SymbolDetailsProps {
	symbol: Symbol.Info;
}

const SymbolDetails = ({ symbol }: SymbolDetailsProps) => {
	const t = useTranslations();

	const dispatch = useAppDispatch();

	const symbolSnapshot = usePrevious(symbol);

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
			symbolType: 'base',
			symbolISIN,
			symbolTitle,
		});
	};

	const openSymbolInfoPanel = () => {
		try {
			const { symbolISIN } = symbol;
			if (symbolISIN) dispatch(setSymbolInfoPanel(symbolISIN));
		} catch (e) {
			//
		}
	};

	const lastTradedPriceIs: 'equal' | 'more' | 'less' = useMemo(() => {
		if (!symbolSnapshot) return 'equal';

		const newValue = symbol.lastTradedPrice;
		const oldValue = symbolSnapshot.lastTradedPrice;

		if (newValue === oldValue) return 'equal';
		if (newValue > oldValue) return 'more';
		return 'less';
	}, [symbolSnapshot?.lastTradedPrice, symbol.lastTradedPrice]);

	const closingPriceIs: 'equal' | 'more' | 'less' = useMemo(() => {
		if (!symbolSnapshot) return 'equal';

		const newValue = symbol.closingPrice;
		const oldValue = symbolSnapshot.closingPrice;

		if (newValue === oldValue) return 'equal';
		if (newValue > oldValue) return 'more';
		return 'less';
	}, [symbolSnapshot?.lastTradedPrice, symbol.lastTradedPrice]);

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
									closingPriceIs === 'equal'
										? 'text-gray-1000'
										: closingPriceIs === 'more'
											? 'text-success-100'
											: 'text-error-100',
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
						valueFormatter: dayjs(lastTradeDate).calendar('jalali').format('HH:mm:ss'),
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
	}, [symbol, closingPriceIs]);

	useEffect(() => {
		const sub = subscribeSymbolInfo(symbol.symbolISIN, 'symbolData,individualLegal');
		sub.addEventListener('onItemUpdate', onSymbolUpdate);
		sub.start();

		subscribe(sub);
	}, [symbol.symbolISIN]);

	const priceColor =
		lastTradedPriceIs === 'equal'
			? 'text-gray-1000'
			: lastTradedPriceIs === 'more'
				? 'text-success-100'
				: 'text-error-100';

	const {
		closingPriceVarReferencePrice,
		symbolTradeState,
		symbolTitle,
		closingPrice,
		lastTradedPrice,
		companyName,
		yesterdayClosingPrice,
		lowThreshold,
		highThreshold,
		lowPrice,
		highPrice,
	} = symbol;

	return (
		<div className='flex-column'>
			<div className='gap-40 pb-24 flex-column'>
				<div className='flex-justify-between'>
					<div onClick={openSymbolInfoPanel} className='cursor-pointer flex-column'>
						<div style={{ gap: '1rem' }} className='flex-items-center'>
							<SymbolState state={symbolTradeState} />
							<h1 className='text-3xl font-medium text-gray-1000'>{symbolTitle}</h1>
						</div>

						<h4 className='whitespace-nowrap pr-20 text-tiny text-gray-1000'>{companyName}</h4>
					</div>

					<div className='h-fit gap-8 flex-items-center'>
						<span className={cn('gap-4 flex-items-center', priceColor)}>
							<span className='flex items-center text-tiny ltr'>
								({(closingPriceVarReferencePrice ?? 0).toFixed(2)} %)
								{lastTradedPriceIs === 'more' && <GrowUpSVG width='1rem' height='1rem' />}
								{lastTradedPriceIs === 'less' && <GrowDownSVG width='1rem' height='1rem' />}
							</span>
							{sepNumbers(String(closingPrice ?? 0))}
						</span>

						<span className={cn('flex items-center gap-4 text-4xl font-bold', priceColor)}>
							{sepNumbers(String(lastTradedPrice ?? 0))}
							<span className='text-base font-normal text-gray-900'>{t('common.rial')}</span>
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

			<div className='gap-24 flex-column'>
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

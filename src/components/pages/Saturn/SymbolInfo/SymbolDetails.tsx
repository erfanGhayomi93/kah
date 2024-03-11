import { type ItemUpdate } from '@/classes/Subscribe';
import SymbolSummary, { type ListItemProps } from '@/components/common/Symbol/SymbolSummary';
import SymbolState from '@/components/common/SymbolState';
import { GrowDownSVG, GrowUpSVG } from '@/components/icons';
import { useAppSelector } from '@/features/hooks';
import { getBrokerURLs } from '@/features/slices/brokerSlice';
import { useTradingFeatures } from '@/hooks';
import usePrevious from '@/hooks/usePrevious';
import useSubscription from '@/hooks/useSubscription';
import dayjs from '@/libs/dayjs';
import { cn, numFormatter, sepNumbers } from '@/utils/helpers';
import { subscribeSymbolInfo } from '@/utils/subscriptions';
import { useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { useLayoutEffect, useMemo } from 'react';

interface SymbolDetailsProps {
	symbol: Symbol.Info;
}

const SymbolDetails = ({ symbol }: SymbolDetailsProps) => {
	const t = useTranslations();

	const brokerURLs = useAppSelector(getBrokerURLs);

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
						title: t('option_chain.trade_volume'),
						valueFormatter: numFormatter(tradeVolume),
					},
					{
						id: 'closingPrice',
						title: t('option_chain.closing_price'),
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
	}, [symbol, closingPriceIs]);

	useLayoutEffect(() => {
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

	const { closingPriceVarReferencePrice, symbolTradeState, symbolTitle, closingPrice, lastTradedPrice, companyName } =
		symbol;

	return (
		<div className='flex-column'>
			<div className={cn('gap-40 flex-column', brokerURLs ? 'pb-32' : 'pb-56')}>
				<div className='flex-justify-between'>
					<div className='flex-column'>
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
							{sepNumbers(String(closingPrice))}
						</span>

						<span className={cn('flex items-center gap-4 text-4xl font-bold', priceColor)}>
							{sepNumbers(String(lastTradedPrice))}
							<span className='text-base font-normal text-gray-900'>{t('common.rial')}</span>
						</span>
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

			<SymbolSummary data={symbolDetails} />
		</div>
	);
};

export default SymbolDetails;

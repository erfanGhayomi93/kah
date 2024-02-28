import { useSymbolInfoQuery } from '@/api/queries/symbolQuery';
import { type ItemUpdate } from '@/classes/Subscribe';
import Loading from '@/components/common/Loading';
import SymbolState from '@/components/common/SymbolState';
import { GrowDownSVG, GrowUpSVG, MoreOptionsSVG } from '@/components/icons';
import { useTradingFeatures } from '@/hooks';
import useSubscription from '@/hooks/useSubscription';
import dayjs from '@/libs/dayjs';
import { numFormatter, sepNumbers } from '@/utils/helpers';
import { subscribeSymbolInfo } from '@/utils/subscriptions';
import { useQueryClient } from '@tanstack/react-query';
import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import { useLayoutEffect, useMemo } from 'react';
import NoData from './common/NoData';
import Section from './common/Section';

type TValue = string | React.ReactNode;

interface Item {
	id: string;
	title: string;
	valueFormatter: (() => TValue) | TValue;
}

interface SymbolInfoProps {
	selectedSymbol: null | string;
}

const ListItem = ({ title, valueFormatter }: Item) => (
	<div className='w-1/2 px-8 flex-justify-between'>
		<span className='whitespace-nowrap text-base text-gray-900'>{title}</span>
		<span className='text-base font-medium text-gray-1000 ltr'>
			{typeof valueFormatter === 'function' ? valueFormatter() : valueFormatter}
		</span>
	</div>
);

const SymbolInfo = ({ selectedSymbol }: SymbolInfoProps) => {
	const t = useTranslations();

	const queryClient = useQueryClient();

	const { addBuySellModal } = useTradingFeatures();

	const { subscribe } = useSubscription();

	const { data: symbolData, isLoading } = useSymbolInfoQuery({
		queryKey: ['symbolInfoQuery', selectedSymbol ?? null],
	});

	const addBsModal = (side: TBsSides) => {
		if (!symbolData) return;

		const { symbolISIN, symbolTitle } = symbolData;

		addBuySellModal({
			side,
			symbolType: 'base',
			symbolISIN,
			symbolTitle,
		});
	};

	const onSymbolUpdate = (updateInfo: ItemUpdate) => {
		const queryKey = ['symbolInfoQuery', selectedSymbol];
		const visualData = JSON.parse(JSON.stringify(queryClient.getQueryData(queryKey))) as Symbol.Info;

		updateInfo.forEachChangedField((fieldName, _b, value) => {
			try {
				if (value && fieldName in visualData) {
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

	const symbolDetails = useMemo<Array<[Item, Item]>>(() => {
		try {
			if (!symbolData) throw new Error();

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
			} = symbolData;

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
	}, [symbolData]);

	useLayoutEffect(() => {
		if (!selectedSymbol) return;

		const sub = subscribeSymbolInfo(selectedSymbol, 'symbolData');
		sub.addEventListener('onItemUpdate', onSymbolUpdate);
		sub.start();

		subscribe(sub);
	}, [selectedSymbol]);

	if (!selectedSymbol)
		return (
			<Section style={{ width: '41%', minWidth: '56rem', maxWidth: '64rem' }} className='flex-justify-center'>
				<NoData text={t('option_chain.select_symbol_from_right_list')} />
			</Section>
		);

	if (isLoading)
		return (
			<Section style={{ width: '41%', minWidth: '56rem', maxWidth: '64rem' }} className='relative'>
				<Loading />
			</Section>
		);

	if (!symbolData || typeof symbolData !== 'object')
		return (
			<Section style={{ width: '41%', minWidth: '56rem', maxWidth: '64rem' }} className='relative'>
				<span className='absolute text-base font-medium text-gray-900 center'>
					{t('option_chain.no_data_found')}
				</span>
			</Section>
		);

	const { closingPriceVarReferencePrice, symbolTradeState, symbolTitle, closingPrice, lastTradedPrice, companyName } =
		symbolData;

	return (
		<Section style={{ width: '41%', minWidth: '56rem', maxWidth: '64rem' }} className='relative py-12 flex-column'>
			<div className='flex-column'>
				<div className='justify-between pl-16 pr-24 flex-items-center'>
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

						<button type='button' className='size-24 text-gray-1000'>
							<MoreOptionsSVG width='2.4rem' height='2.4rem' />
						</button>
					</div>
				</div>

				<h4 className='whitespace-nowrap pr-44 text-tiny text-gray-1000'>{companyName}</h4>
			</div>

			<div className='gap-16 px-24 pb-48 pt-32 flex-justify-between'>
				<button
					onClick={() => addBsModal('buy')}
					className='h-40 flex-1 rounded text-base flex-justify-center btn-success-outline'
					type='button'
				>
					{t('side.buy')}
				</button>
				<button
					onClick={() => addBsModal('sell')}
					className='h-40 flex-1 rounded text-base flex-justify-center btn-error-outline'
					type='button'
				>
					{t('side.sell')}
				</button>
			</div>

			<ul className='flex px-24 flex-column'>
				{symbolDetails.map(([firstItem, secondItem], i) => (
					<li key={firstItem.id} className={clsx('h-32 gap-16 flex-justify-between', i % 2 && 'bg-gray-200')}>
						<ListItem {...firstItem} />
						<ListItem {...secondItem} />
					</li>
				))}
			</ul>
		</Section>
	);
};

export default SymbolInfo;

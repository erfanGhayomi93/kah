import { useSameSectorSymbolsQuery } from '@/api/queries/symbolQuery';
import lightStreamInstance from '@/classes/Lightstream';
import LightweightTable, { type IColDef } from '@/components/common/Tables/LightweightTable';
import { useAppDispatch } from '@/features/hooks';
import { setSymbolInfoPanel } from '@/features/slices/panelSlice';
import { useSubscription } from '@/hooks';
import useStateWithRef from '@/hooks/useStateRef';
import { getColorBasedOnPercent, numFormatter, sepNumbers, toFixed } from '@/utils/helpers';
import { useQueryClient } from '@tanstack/react-query';
import clsx from 'clsx';
import { type ItemUpdate } from 'lightstreamer-client-web';
import { useTranslations } from 'next-intl';
import { useEffect, useMemo } from 'react';
import NoData from '../../../../common/NoData';
import Loading from '../../common/Loading';

interface SymbolsProps {
	symbolISIN: string;
}

const Symbols = ({ symbolISIN }: SymbolsProps) => {
	const t = useTranslations('same_sector_symbol');

	const dispatch = useAppDispatch();

	const queryClient = useQueryClient();

	const { subscribe } = useSubscription();

	const { data, isLoading } = useSameSectorSymbolsQuery({
		queryKey: ['sameSectorSymbolsQuery', symbolISIN],
	});

	const visualData = useStateWithRef(JSON.parse(JSON.stringify(data ?? [])) as Symbol.SameSector[]);

	const onSymbolUpdate = (updateInfo: ItemUpdate) => {
		const symbolISIN: string = updateInfo.getItemName();
		const symbolIndex = visualData.findIndex((item) => item.symbolISIN === symbolISIN);

		if (symbolIndex === -1) return;

		updateInfo.forEachChangedField((fieldName, _b, value) => {
			try {
				const symbol = visualData[symbolIndex];

				if (value !== null && fieldName in symbol) {
					const valueAsNumber = Number(value);

					// @ts-expect-error: Lightstream returns the wrong data type
					visualData[symbolIndex] = isNaN(valueAsNumber) ? value : valueAsNumber;
				}
			} catch (e) {
				//
			}
		});

		queryClient.setQueryData(['sameSectorSymbolsQuery', symbolISIN], visualData);
	};

	const COLUMNS = useMemo<Array<IColDef<Symbol.SameSector>>>(
		() => [
			/* نماد */
			{
				headerName: t('symbol'),
				colId: 'symbolTitle',
				headerClass: 'text-sm',
				cellClass: 'cursor-pointer',
				onCellClick: (row) => dispatch(setSymbolInfoPanel(row.symbolISIN)),
				valueGetter: (row) => row?.symbolTitle ?? '−',
			},

			/* حجم */
			{
				headerName: t('volume'),
				colId: 'totalNumberOfSharesTraded',
				headerClass: 'text-sm',
				sort: 'desc',
				valueGetter: (row) => row?.totalNumberOfSharesTraded ?? 0,
				valueFormatter: (row) => {
					const value = Number(row.value);
					return value > 1e7 ? String(numFormatter(value)) : sepNumbers(String(value));
				},
			},

			/* آخرین قیمت/درصد تغییر */
			{
				colId: 'lastTradedPrice',
				cellClass: 'ltr',
				valueGetter: (row) => row?.lastTradedPriceVarPercent ?? 0,
				headerComponent: () => (
					<div className='flex size-full flex-col items-center justify-center gap-4 overflow-hidden'>
						<span className='h-16 text-tiny font-normal leading-normal'>{t('last_traded_price')}</span>
						<span className='h-16 text-tiny font-normal leading-normal'>
							{t('last_traded_price_percent')}
						</span>
					</div>
				),
				valueFormatter: ({ row }) => {
					const lastTradedPrice = row?.lastTradedPrice ?? 0;
					const lastTradedPriceVarPercent = row?.lastTradedPriceVarPercent ?? 0;

					return (
						<div className='flex size-full flex-col items-center justify-center gap-4 overflow-hidden'>
							<span className='text-tiny leading-normal ltr'>{sepNumbers(String(lastTradedPrice))}</span>
							<span
								className={clsx(
									'text-tiny leading-normal ltr',
									getColorBasedOnPercent(lastTradedPriceVarPercent),
								)}
							>
								{toFixed(lastTradedPriceVarPercent)}%
							</span>
						</div>
					);
				},
			},

			/* عرضه/تقاضا */
			{
				colId: 'bestLimitPrice',
				cellClass: 'ltr',
				valueGetter: (row) => row.bestBuyLimitPrice_1,
				headerComponent: () => (
					<div className='flex size-full flex-col items-center justify-center gap-4 overflow-hidden'>
						<span className='h-16 text-tiny font-normal leading-normal'>{t('demand')}</span>
						<span className='h-16 text-tiny font-normal leading-normal'>{t('supply')}</span>
					</div>
				),
				valueFormatter: ({ row }) => (
					<div className='flex size-full flex-col items-center justify-center gap-4 overflow-hidden'>
						<span className='text-tiny leading-normal text-light-success-100 ltr'>
							{sepNumbers(String(row?.bestBuyLimitPrice_1 ?? 0))}
						</span>
						<span className='text-tiny leading-normal text-light-error-100 ltr'>
							{sepNumbers(String(row?.bestSellLimitPrice_1 ?? 0))}
						</span>
					</div>
				),
			},
		],
		[],
	);

	const symbolsISIN = useMemo(() => {
		if (!data) return [];
		return data.map((item) => item.symbolISIN);
	}, [data]);

	useEffect(() => {
		if (!data) return;

		const sub = lightStreamInstance.subscribe({
			mode: 'MERGE',
			items: symbolsISIN,
			fields: [
				'totalNumberOfSharesTraded',
				'lastTradedPrice',
				'lastTradedPriceVarPercent',
				'bestBuyLimitPrice_1',
				'bestSellLimitPrice_1',
			],
			dataAdapter: 'RamandRLCDData',
			snapshot: true,
		});

		sub.addEventListener('onItemUpdate', onSymbolUpdate);
		sub.start();

		subscribe(sub);
	}, [symbolsISIN.join(',')]);

	if (isLoading) return <Loading />;

	if (!Array.isArray(data) || data.length === 0) return <NoData />;

	return <LightweightTable reverseColors columnDefs={COLUMNS} rowData={data ?? []} />;
};

export default Symbols;

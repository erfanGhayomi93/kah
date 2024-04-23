import LightweightTable, { type IColDef } from '@/components/common/Tables/LightweightTable';
import { useAppDispatch } from '@/features/hooks';
import { setSymbolInfoPanel } from '@/features/slices/panelSlice';
import dayjs from '@/libs/dayjs';
import { toFixed } from '@/utils/helpers';
import { blackScholes } from '@/utils/Math/black-scholes';
import { type IBlackScholesResponse } from '@/utils/Math/type';
import { useTranslations } from 'next-intl';
import { useMemo } from 'react';

interface ITableData extends IBlackScholesResponse {
	symbol: Option.Root;
}

interface GreeksTableProps {
	contracts: ISymbolStrategyContract[];
}

const GreeksTable = ({ contracts }: GreeksTableProps) => {
	const t = useTranslations();

	const dispatch = useAppDispatch();

	const setSymbol = (symbolISIN: string) => {
		dispatch(setSymbolInfoPanel(symbolISIN));
	};

	const dataMapper = useMemo(() => {
		return contracts.map<ITableData>((item) => {
			const {
				symbol: { optionWatchlistData, symbolInfo },
			} = item;

			const dueDays = dayjs(symbolInfo.contractEndDate).diff(new Date(), 'day', false);

			return {
				symbol: item.symbol,
				...blackScholes({
					sharePrice: optionWatchlistData.baseSymbolPrice,
					strikePrice: symbolInfo.strikePrice,
					rate: 0.3,
					volatility: Number(optionWatchlistData.historicalVolatility) / 100,
					dueDays,
				}),
			};
		});
	}, [contracts]);

	const columnDefs = useMemo<Array<IColDef<ITableData>>>(
		() => [
			{
				headerName: t('analyze_modal.symbolTitle'),
				cellClass: 'cursor-pointer',
				onCellClick: (row) => setSymbol(row.symbol.symbolInfo.symbolISIN),
				valueFormatter: (row) => row.symbol.symbolInfo.symbolTitle,
			},
			{
				headerName: t('analyze_modal.delta'),
				cellClass: 'ltr',
				valueFormatter: ({
					symbol: {
						symbolInfo: { optionType },
					},
					deltaCall,
					deltaPut,
				}) => toFixed(optionType === 'Call' ? deltaCall : deltaPut, 4),
			},
			{
				headerName: t('analyze_modal.theta'),
				cellClass: 'ltr',
				valueFormatter: ({
					symbol: {
						symbolInfo: { optionType },
					},
					thetaCall,
					thetaPut,
				}) => toFixed(optionType === 'Call' ? thetaCall : thetaPut, 4),
			},
			{
				headerName: t('analyze_modal.gama'),
				cellClass: 'ltr',
				valueFormatter: ({ gamma }) => toFixed(gamma, 8),
			},
			{
				headerName: t('analyze_modal.vega'),
				cellClass: 'ltr',
				valueFormatter: ({ vega }) => toFixed(vega, 4),
			},
			{
				headerName: t('analyze_modal.rho'),
				cellClass: 'ltr',
				valueFormatter: ({
					symbol: {
						symbolInfo: { optionType },
					},
					rhoCall,
					rhoPut,
				}) => toFixed(optionType === 'Call' ? rhoCall : rhoPut, 4),
			},
		],
		[],
	);

	return <LightweightTable rowData={dataMapper} columnDefs={columnDefs} />;
};

export default GreeksTable;

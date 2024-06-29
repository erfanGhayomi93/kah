import LightweightTable, { type IColDef } from '@/components/common/Tables/LightweightTable';
import { useAppDispatch } from '@/features/hooks';
import { setSymbolInfoPanel } from '@/features/slices/panelSlice';
import dayjs from '@/libs/dayjs';
import { toFixed } from '@/utils/helpers';
import { blackScholes } from '@/utils/Math/black-scholes';
import { type IBlackScholesResponse } from '@/utils/Math/type';
import { useTranslations } from 'next-intl';
import { useMemo } from 'react';
import NoData from '../NoData';

interface ITableData extends IBlackScholesResponse {
	symbol: TSymbolStrategy['symbol'];
}

interface AnalyzeGreeksTableProps {
	contracts: TSymbolStrategy[];
}

const AnalyzeGreeksTable = ({ contracts }: AnalyzeGreeksTableProps) => {
	const t = useTranslations('analyze_modal');

	const dispatch = useAppDispatch();

	const setSymbol = (symbolISIN: string) => {
		dispatch(setSymbolInfoPanel(symbolISIN));
	};

	const dataMapper = useMemo(() => {
		const filteredContracts = contracts.filter((item) => item.type === 'option') as IOptionStrategy[];

		return filteredContracts.map<ITableData>((item) => {
			const {
				symbol: { baseSymbolPrice, historicalVolatility, strikePrice, settlementDay },
			} = item;

			const dueDays = dayjs(settlementDay).diff(new Date(), 'day', false);

			return {
				symbol: item.symbol,
				...blackScholes({
					sharePrice: baseSymbolPrice,
					strikePrice,
					rate: 0.3,
					volatility: Number(historicalVolatility) / 100,
					dueDays,
				}),
			};
		});
	}, [contracts]);

	const columnDefs = useMemo<Array<IColDef<ITableData>>>(
		() => [
			{
				colId: 'symbolTitle',
				headerName: t('symbolTitle'),
				cellClass: 'cursor-pointer',
				onCellClick: (row) => setSymbol(row.symbol.symbolISIN),
				valueGetter: (row) => row.symbol.symbolTitle,
			},
			{
				colId: 'delta',
				headerName: t('delta'),
				cellClass: 'ltr',
				valueGetter: ({ symbol: { optionType }, deltaCall, deltaPut }) =>
					optionType === 'call' ? deltaCall : deltaPut,
				valueType: 'decimal',
			},
			{
				colId: 'theta',
				headerName: t('theta'),
				cellClass: 'ltr',
				valueGetter: ({ symbol: { optionType }, thetaCall, thetaPut }) =>
					optionType === 'call' ? thetaCall : thetaPut,
				valueType: 'decimal',
			},
			{
				colId: 'gama',
				headerName: t('gama'),
				cellClass: 'ltr',
				valueGetter: ({ gamma }) => gamma,
				valueType: 'decimal',
			},
			{
				colId: 'vega',
				headerName: t('vega'),
				cellClass: 'ltr',
				valueGetter: ({ vega }) => toFixed(vega, 4),
				valueType: 'decimal',
			},
			{
				colId: 'rho',
				headerName: t('rho'),
				cellClass: 'ltr',
				valueGetter: ({ symbol: { optionType }, rhoCall, rhoPut }) =>
					optionType === 'call' ? rhoCall : rhoPut,
				valueType: 'decimal',
			},
		],
		[],
	);

	if (dataMapper.length === 0)
		return (
			<div className='absolute center'>
				<NoData text={t('no_active_contract_found')} />
			</div>
		);

	return <LightweightTable rowData={dataMapper} columnDefs={columnDefs} />;
};

export default AnalyzeGreeksTable;

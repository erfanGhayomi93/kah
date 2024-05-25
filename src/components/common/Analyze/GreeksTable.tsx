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

interface GreeksTableProps {
	contracts: TSymbolStrategy[];
}

const GreeksTable = ({ contracts }: GreeksTableProps) => {
	const t = useTranslations('analyze_modal');

	const dispatch = useAppDispatch();

	const setSymbol = (symbolISIN: string) => {
		dispatch(setSymbolInfoPanel(symbolISIN));
	};

	const dataMapper = useMemo(() => {
		const filteredContracts = contracts.filter((item) => item.type === 'option') as IOptionStrategy[];

		return filteredContracts.map<ITableData>((item) => {
			const {
				strikePrice,
				settlementDay,
				symbol: { baseSymbolPrice, historicalVolatility },
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
				headerName: t('symbolTitle'),
				cellClass: 'cursor-pointer',
				onCellClick: (row) => setSymbol(row.symbol.symbolISIN),
				valueFormatter: (row) => row.symbol.symbolTitle,
			},
			{
				headerName: t('delta'),
				cellClass: 'ltr',
				valueFormatter: ({ symbol: { optionType }, deltaCall, deltaPut }) =>
					toFixed(optionType === 'call' ? deltaCall : deltaPut, 4),
			},
			{
				headerName: t('theta'),
				cellClass: 'ltr',
				valueFormatter: ({ symbol: { optionType }, thetaCall, thetaPut }) =>
					toFixed(optionType === 'call' ? thetaCall : thetaPut, 4),
			},
			{
				headerName: t('gama'),
				cellClass: 'ltr',
				valueFormatter: ({ gamma }) => toFixed(gamma, 8),
			},
			{
				headerName: t('vega'),
				cellClass: 'ltr',
				valueFormatter: ({ vega }) => toFixed(vega, 4),
			},
			{
				headerName: t('rho'),
				cellClass: 'ltr',
				valueFormatter: ({ symbol: { optionType }, rhoCall, rhoPut }) =>
					toFixed(optionType === 'call' ? rhoCall : rhoPut, 4),
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

export default GreeksTable;

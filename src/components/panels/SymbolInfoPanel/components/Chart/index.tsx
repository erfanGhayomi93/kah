import {
	useBaseOpenPositionChartDataQuery,
	useNotionalValueChartDataQuery,
	useOpenPositionChartDataQuery,
} from '@/api/queries/optionQueries';
import { useSymbolChartDataQuery } from '@/api/queries/symbolQuery';
import Loading from '@/components/common/Loading';
import NoData from '@/components/common/NoData';
import SymbolChart, { SymbolChartInterval, SymbolChartType } from '@/components/common/Symbol/SymbolChart';
import { dateTypesAPI } from '@/constants';
import { useInputs } from '@/hooks';
import { useTranslations } from 'next-intl';
import { useMemo } from 'react';
import Section, { type ITabIem } from '../../common/Section';

interface ChartProps {
	isOption: boolean;
	symbolISIN: string;
}

const Chart = ({ isOption, symbolISIN }: ChartProps) => {
	const t = useTranslations();

	const { inputs, setFieldValue } = useInputs<ISymbolChartStates>({
		interval: 'daily',
		type: 'area',
		tab: 'symbol_chart',
	});

	const { data: symbolChartData, isLoading: isSymbolChartLoading } = useSymbolChartDataQuery({
		queryKey: ['symbolChartDataQuery', symbolISIN, dateTypesAPI[inputs.interval]],
	});

	const { data: optionOpenPositionData, isLoading: isOpenPositionChartLoading } = useOpenPositionChartDataQuery({
		queryKey: ['openPositionChartDataQuery', symbolISIN, dateTypesAPI[inputs.interval]],
		enabled: inputs.tab === 'open_positions' && isOption,
	});

	const { data: baseOpenPositionData, isLoading: isBaseOpenPositionChartLoading } = useBaseOpenPositionChartDataQuery(
		{
			queryKey: ['baseOpenPositionChartDataQuery', symbolISIN, dateTypesAPI[inputs.interval]],
			enabled: inputs.tab === 'open_positions' && !isOption,
		},
	);

	const { data: nationalValueData, isLoading: isNotionalValueChartLoading } = useNotionalValueChartDataQuery({
		queryKey: ['notionalValueChartDataQuery', symbolISIN, dateTypesAPI[inputs.interval]],
		enabled: inputs.tab === 'notional_value' && isOption,
	});

	const onChangeTab = (id: TSymbolChartTabStates | string) => {
		setFieldValue('tab', id as TSymbolChartTabStates);
	};

	const tabs: ITabIem[] = useMemo(() => {
		const value = [
			{
				id: 'symbol_chart',
				title: t('symbol_info_panel.symbol_chart'),
			},
			{
				id: 'open_positions',
				title: t('symbol_info_panel.open_positions'),
			},
		];

		if (isOption) {
			value.push({
				id: 'notional_value',
				title: t('symbol_info_panel.notional_value_tab'),
			});
		}

		return value;
	}, [isOption]);

	const chartData =
		(inputs.tab === 'symbol_chart'
			? symbolChartData
			: inputs.tab === 'notional_value'
				? nationalValueData
				: isOption
					? optionOpenPositionData
					: baseOpenPositionData) ?? [];

	return (
		<Section name='chart' defaultActiveTab={inputs.tab} tabs={tabs} onChange={onChangeTab}>
			<div className='relative h-full pb-16 flex-column'>
				{Array.isArray(chartData) && chartData.length > 0 ? (
					<div className='flex-1 pt-16'>
						{/* @ts-expect-error: Typescript can not detect "chartData" type based on input.tab, It's working fine */}
						<SymbolChart
							data={chartData ?? []}
							interval={inputs.interval}
							type={inputs.tab !== 'symbol_chart' ? 'area' : inputs.type}
							tab={inputs.tab}
							height={224}
						/>
					</div>
				) : (
					<NoData />
				)}

				<div style={{ flex: '0 0 2.4rem' }} className='px-8 flex-items-center'>
					<SymbolChartInterval
						activeInterval={inputs.interval}
						onChange={(v) => setFieldValue('interval', v)}
					/>

					{inputs.tab === 'symbol_chart' && (
						<SymbolChartType type={inputs.type} onChange={(v) => setFieldValue('type', v)} />
					)}
				</div>

				{(isSymbolChartLoading ||
					isOpenPositionChartLoading ||
					isBaseOpenPositionChartLoading ||
					isNotionalValueChartLoading) && (
					<div className='darkBlue:bg-gray-50 absolute left-0 top-0 size-full bg-white dark:bg-gray-50'>
						<Loading />
					</div>
				)}
			</div>
		</Section>
	);
};

export default Chart;

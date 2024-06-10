import {
	useBaseOpenPositionChartDataQuery,
	useNotionalValueChartDataQuery,
	useOpenPositionChartDataQuery,
} from '@/api/queries/optionQueries';
import { useSymbolChartDataQuery } from '@/api/queries/symbolQuery';
import Radiobox from '@/components/common/Inputs/Radiobox';
import Loading from '@/components/common/Loading';
import NoData from '@/components/common/NoData';
import SymbolChart from '@/components/common/Symbol/SymbolChart';
import Tooltip from '@/components/common/Tooltip';
import { CandleChartSVG, LinearChartSVG } from '@/components/icons';
import { dateTypesAPI } from '@/constants';
import { useInputs } from '@/hooks';
import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import { useMemo } from 'react';
import Section, { type ITabIem } from '../../common/Section';

interface ChartIntervalProps {
	interval: ISymbolChartStates['interval'];
	label: string;
	active: boolean;
	onChange: () => void;
}

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

	const { data: symbolChartData, isLoading } = useSymbolChartDataQuery({
		queryKey: ['symbolChartDataQuery', symbolISIN, dateTypesAPI[inputs.interval]],
	});

	const { data: optionOpenPositionData } = useOpenPositionChartDataQuery({
		queryKey: ['openPositionChartDataQuery', symbolISIN, dateTypesAPI[inputs.interval]],
		enabled: inputs.tab === 'open_positions' && isOption,
	});

	const { data: baseOpenPositionData } = useBaseOpenPositionChartDataQuery({
		queryKey: ['baseOpenPositionChartDataQuery', symbolISIN, dateTypesAPI[inputs.interval]],
		enabled: inputs.tab === 'open_positions' && !isOption,
	});

	const { data: nationalValueData } = useNotionalValueChartDataQuery({
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
					<div className='pt-16'>
						{/* @ts-expect-error: Typescript can not detect "chartData" type based on input.tab, It's working fine */}
						<SymbolChart data={chartData ?? []} height='208px' {...inputs} />
					</div>
				) : (
					<NoData />
				)}

				<div style={{ flex: '0 0 2.4rem' }} className='px-8 flex-items-center'>
					<ul className='flex-1 gap-16 flex-items-start'>
						<ChartInterval
							interval='daily'
							label={t('dates.daily')}
							active={inputs.interval === 'daily'}
							onChange={() => setFieldValue('interval', 'daily')}
						/>

						<ChartInterval
							interval='weekly'
							label={t('dates.weekly')}
							active={inputs.interval === 'weekly'}
							onChange={() => setFieldValue('interval', 'weekly')}
						/>

						<ChartInterval
							interval='monthly'
							label={t('dates.monthly')}
							active={inputs.interval === 'monthly'}
							onChange={() => setFieldValue('interval', 'monthly')}
						/>

						<ChartInterval
							interval='yearly'
							label={t('dates.yearly')}
							active={inputs.interval === 'yearly'}
							onChange={() => setFieldValue('interval', 'yearly')}
						/>
					</ul>

					{inputs.tab === 'symbol_chart' && (
						<div className='gap-8 flex-justify-end'>
							<Tooltip content={t('symbol_info_panel.linear')}>
								<button
									onClick={() => setFieldValue('type', 'area')}
									type='button'
									className={clsx(
										'size-24 rounded-sm transition-colors flex-justify-center',
										inputs.type === 'area' ? 'btn-primary' : 'bg-gray-500 text-gray-900',
									)}
								>
									<LinearChartSVG width='2rem' height='2rem' />
								</button>
							</Tooltip>
							<Tooltip content={t('symbol_info_panel.candle')}>
								<button
									onClick={() => setFieldValue('type', 'candlestick')}
									type='button'
									className={clsx(
										'size-24 rounded-sm transition-colors flex-justify-center',
										inputs.type === 'candlestick' ? 'btn-primary' : 'bg-gray-500 text-gray-900',
									)}
								>
									<CandleChartSVG width='2rem' height='2rem' />
								</button>
							</Tooltip>
						</div>
					)}
				</div>

				{isLoading && (
					<div className='absolute left-0 top-0 size-full bg-white'>
						<Loading />
					</div>
				)}
			</div>
		</Section>
	);
};

const ChartInterval = ({ interval, active, label, onChange }: ChartIntervalProps) => (
	<li className='gap-4 flex-items-center'>
		<Radiobox label={label} name={interval} checked={active} onChange={onChange} />
	</li>
);

export default Chart;

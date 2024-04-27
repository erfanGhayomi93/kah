import { useSymbolChartDataQuery } from '@/api/queries/symbolQuery';
import Radiobox from '@/components/common/Inputs/Radiobox';
import Loading from '@/components/common/Loading';
import NoData from '@/components/common/NoData';
import Tooltip from '@/components/common/Tooltip';
import { CandleChartSVG, LinearChartSVG } from '@/components/icons';
import { dateTypesAPI } from '@/constants';
import { useInputs } from '@/hooks';
import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import { useMemo } from 'react';
import SymbolChart from '../../../../common/Symbol/SymbolChart';
import Section, { type ITabIem } from '../../common/Section';

interface ChartIntervalProps {
	interval: ISymbolChartStates['interval'];
	label: string;
	active: boolean;
	onChange: () => void;
}

interface ChartProps {
	symbolISIN: string;
}

const Chart = ({ symbolISIN }: ChartProps) => {
	const t = useTranslations();

	const { inputs, setFieldValue } = useInputs<ISymbolChartStates>({
		interval: 'daily',
		type: 'area',
	});

	const { data, isLoading } = useSymbolChartDataQuery({
		queryKey: ['symbolChartDataQuery', symbolISIN, dateTypesAPI[inputs.interval]],
	});

	const tabs: ITabIem[] = useMemo(
		() => [
			{
				id: 'symbol_chart',
				title: t('symbol_info_panel.symbol_chart'),
			},
		],
		[],
	);

	return (
		<Section name='chart' defaultActiveTab='symbol_chart' tabs={tabs}>
			<div className='relative h-full pb-16 flex-column'>
				{Array.isArray(data) && data.length > 0 ? (
					<div className='pt-16'>
						<SymbolChart type={inputs.type} data={data} height='208px' />
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

					<div className='gap-8 flex-justify-end'>
						<Tooltip content={t('symbol_info_panel.linear')}>
							<button
								onClick={() => setFieldValue('type', 'area')}
								type='button'
								className={clsx(
									'size-24 rounded-sm transition-colors flex-justify-center',
									inputs.type === 'area' ? 'btn-primary' : 'bg-gray-600 text-gray-900',
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
									inputs.type === 'candlestick' ? 'btn-primary' : 'bg-gray-600 text-gray-900',
								)}
							>
								<CandleChartSVG width='2rem' height='2rem' />
							</button>
						</Tooltip>
					</div>
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

import { useGetOptionWatchlistPriceChangeInfoQuery } from '@/api/queries/dashboardQueries';
import AppChart from '@/components/common/AppChart';
import { sepNumbers } from '@/utils/helpers';
import { useTranslations } from 'next-intl';
import { useMemo } from 'react';
import Suspend from '../../common/Suspend';

const COLORS = [
	'rgba(255, 0, 40, 1)',
	'rgba(255, 52, 84, 1)',
	'rgba(255, 82, 109, 1)',
	'rgba(226, 231, 237, 1)',
	'rgba(66, 218, 173, 1)',
	'rgba(0, 194, 136, 1)',
	'rgba(0, 164, 115, 1)',
];

const BG_COLORS = [
	'rgba(255, 0, 40, 0.05)',
	'rgba(255, 52, 84, 0.05)',
	'rgba(255, 82, 109, 0.05)',
	'rgba(226, 231, 237, 0.1)',
	'rgba(0, 194, 136, 0.05)',
	'rgba(0, 164, 115, 0.05)',
	'rgba(0, 164, 115, 0.05)',
];

const DEFAULT_RESULT = [...Array<IChartOutput[]>(7)].map((_, i) => ({
	x: `${i}`,
	y: 0,
	fillColor: COLORS[i],
	strokeColor: COLORS[i],
}));

interface IChartOutput {
	x: string | number;
	y: string | number;
	fillColor: string;
	strokeColor: string;
}

const PriceChangesWatchlistChart = () => {
	const t = useTranslations();

	const { data, isLoading } = useGetOptionWatchlistPriceChangeInfoQuery({
		queryKey: ['getOptionWatchlistPriceChangeInfoQuery'],
	});

	const dataMapper = useMemo<IChartOutput[]>(() => {
		if (!Array.isArray(data)) return DEFAULT_RESULT;

		return DEFAULT_RESULT.map((_, i) => ({
			x: data[i]?.state ?? `${i}`,
			y: Math.max(0, Math.min(data[i]?.count ?? 0, 100)),
			fillColor: COLORS[i],
			strokeColor: COLORS[i],
		}));
	}, [data]);

	return (
		<>
			<AppChart
				options={{
					tooltip: {
						y: {
							formatter: (val) => {
								return `‏${t('home.count')}: ${sepNumbers(String(val ?? 0))}`;
							},
						},
					},
					states: {
						active: {
							filter: {
								type: 'none',
							},
						},
						hover: {
							filter: {
								type: 'none',
							},
						},
					},
					plotOptions: {
						bar: {
							columnWidth: '32%',
							borderRadius: 6,
							colors: {
								backgroundBarColors: BG_COLORS,
								backgroundBarRadius: 6,
							},
							dataLabels: {
								position: 'top',
							},
						},
					},
					xaxis: {
						tickAmount: 5,
					},
					yaxis: {
						show: false,
					},
					dataLabels: {
						textAnchor: 'middle',
						offsetY: -24,
						formatter: (value) => {
							return `${value}%`;
						},
					},
					grid: {
						show: false,
					},
					labels: [
						'< ‎-4',
						'‎-4 تا ‎-2',
						'‎-2 تا ‎-0.5',
						'‎+0.5 تا ‎-0.5',
						'‎+2 تا ‎+0.5',
						'‎+4 تا ‎+2',
						'‎+4 <',
					],
				}}
				series={[
					{
						data: dataMapper,
					},
				]}
				type='bar'
				width='100%'
				height='100%'
			/>

			<Suspend isLoading={isLoading} isEmpty={!data?.length} />
		</>
	);
};

export default PriceChangesWatchlistChart;

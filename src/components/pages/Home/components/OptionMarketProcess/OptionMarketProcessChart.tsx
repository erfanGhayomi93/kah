import { useGetMarketProcessChartQuery } from '@/api/queries/dashboardQueries';
import { dateFormatter, numFormatter, sepNumbers } from '@/utils/helpers';
import { useMemo } from 'react';
import Chart from 'react-apexcharts';
import Suspend from '../../common/Suspend';

interface OptionMarketProcessChartProps {
	interval: Dashboard.TInterval;
	type: Dashboard.GetMarketProcessChart.TChartType;
}

const OptionMarketProcessChart = ({ interval, type }: OptionMarketProcessChartProps) => {
	const { data, isFetching } = useGetMarketProcessChartQuery({
		queryKey: ['getMarketProcessChartQuery', interval, type],
	});

	const dataMapper: Array<{ x: string; y: number }> = useMemo(() => {
		if (!data) return [];

		const keys = Object.keys(data);
		if (keys.length === 0) return [];

		return keys.map((d) => ({
			x: dateFormatter(d, interval === 'Today' ? 'time' : 'date'),
			y: data[d] ?? 0,
		}));
	}, [interval, data]);

	return (
		<>
			<Chart
				options={{
					chart: {
						stacked: false,
						toolbar: {
							show: false,
						},
						foreColor: 'rgb(146, 145, 165)',
						zoom: {
							type: 'x',
							enabled: true,
							autoScaleYaxis: true,
						},
					},
					colors: ['rgba(0, 194, 136, 1)'],
					tooltip: {
						cssClass: 'apex-tooltip',

						style: {
							fontFamily: 'IRANSans',
							fontSize: '12px',
						},

						x: {
							show: false,
						},

						y: {
							title: {
								formatter: () => {
									return '';
								},
							},
							formatter: (val) => {
								return sepNumbers(String(val ?? 0));
							},
						},
					},
					xaxis: {
						tickAmount: 5,
						offsetX: 0,
						offsetY: 0,
						axisBorder: {
							show: false,
						},
						axisTicks: {
							show: false,
						},
						labels: {
							rotate: 0,
							rotateAlways: false,
							style: {
								fontFamily: 'IRANSans',
								fontSize: '12px',
							},
						},
					},
					yaxis: {
						tickAmount: 2,
						labels: {
							offsetX: -8,
							offsetY: 1,
							style: {
								fontFamily: 'IRANSans',
								fontSize: '12px',
							},
							formatter: (val) => {
								return numFormatter(val);
							},
						},
					},
					dataLabels: {
						enabled: false,
					},
					markers: {
						size: 0,
						strokeColors: ['rgba(0, 194, 136, 1)'],
						colors: 'rgb(255, 255, 255)',
						strokeWidth: 2,
						hover: {
							size: 4,
						},
					},
					grid: {
						position: 'back',
						show: true,
						yaxis: {
							lines: {
								show: true,
							},
						},
						padding: {
							top: -16,
							left: 0,
							bottom: -8,
							right: 0,
						},
					},
					stroke: {
						curve: 'smooth',
						width: 2,
					},
					fill: {
						type: 'gradient',
						gradient: {
							type: 'vertical',
							colorStops: [
								{
									offset: 20,
									color: 'rgb(0, 194, 136)',
									opacity: 0.2,
								},
								{
									offset: 100,
									color: 'rgb(0, 194, 136)',
									opacity: 0,
								},
							],
						},
					},
				}}
				series={[
					{
						data: dataMapper,
					},
				]}
				type='area'
				width='100%'
				height='100%'
			/>

			<Suspend isLoading={isFetching} isEmpty={!data || Object.keys(data).length === 0} />
		</>
	);
};

export default OptionMarketProcessChart;

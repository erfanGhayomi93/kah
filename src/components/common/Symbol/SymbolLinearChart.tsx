import { useSymbolChartDataQuery } from '@/api/queries/symbolQuery';
import dayjs from '@/libs/dayjs';
import { numFormatter } from '@/utils/helpers';
import { useMemo } from 'react';
import Chart from 'react-apexcharts';
import Loading from '../../panels/SymbolInfoPanel/common/Loading';
import NoData from '../../panels/SymbolInfoPanel/common/NoData';

interface SymbolLinearChartProps {
	symbolISIN: string;
	height?: number | string;
}

const SymbolLinearChart = ({ symbolISIN, height }: SymbolLinearChartProps) => {
	const { data, isLoading } = useSymbolChartDataQuery({
		queryKey: ['symbolChartDataQuery', symbolISIN, 'Today'],
	});

	const dateFormatter = (v: string | number) => {
		return dayjs(v).calendar('jalali').format('HH:mm');
	};

	const dataMapper: Array<Record<'x' | 'y', number>> = useMemo(() => {
		if (!Array.isArray(data)) return [];

		return data.map((item) => ({
			x: item.x,
			y: item.c,
		}));
	}, [data]);

	if (isLoading) return <Loading />;

	if (!Array.isArray(data) || data.length === 0) return <NoData />;

	return (
		<Chart
			options={{
				chart: {
					stacked: false,
					toolbar: {
						show: false,
					},
					foreColor: 'rgba(121, 130, 151, 1)',
					zoom: {
						type: 'x',
						enabled: true,
						autoScaleYaxis: true,
					},
				},
				colors: ['rgb(34, 180, 150)'],
				tooltip: {
					style: {
						fontFamily: 'IRANSans',
						fontSize: '1.2rem',
					},
				},
				xaxis: {
					offsetX: 0,
					offsetY: 0,
					tickAmount: 7,
					axisBorder: {
						show: true,
					},
					axisTicks: {
						show: false,
					},
					labels: {
						style: {
							fontFamily: 'IRANSans',
							fontSize: '1.2rem',
						},
						formatter: (val) => {
							return dateFormatter(val);
						},
					},
				},
				yaxis: {
					tickAmount: 4,
					labels: {
						offsetX: -8,
						offsetY: 1,
						style: {
							fontFamily: 'IRANSans',
							fontSize: '1.2rem',
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
						top: 0,
						left: 0,
						bottom: 0,
						right: 0,
					},
				},
				fill: {
					type: 'gradient',
					gradient: {
						opacityFrom: 0.8,
						opacityTo: 0.2,
					},
				},
				stroke: {
					curve: 'smooth',
					width: 1,
				},
			}}
			series={[
				{
					name: 'قیمت',
					data: dataMapper,
				},
			]}
			type='area'
			width='100%'
			height={height}
		/>
	);
};

export default SymbolLinearChart;

import { useGetIndividualLegalInfoQuery } from '@/api/queries/dashboardQueries';
import { dateFormatter, numFormatter, sepNumbers } from '@/utils/helpers';
import { useMemo } from 'react';
import Chart from 'react-apexcharts';
import Suspend from '../../common/Suspend';

interface IndividualAndLegalChartProps {
	symbolType: Dashboard.GetIndividualLegalInfo.SymbolType;
	type: Dashboard.GetIndividualLegalInfo.Type;
}

const IndividualAndLegalChart = ({ symbolType, type }: IndividualAndLegalChartProps) => {
	const { data, isFetching } = useGetIndividualLegalInfoQuery({
		queryKey: ['getIndividualLegalInfoQuery', symbolType, type],
	});

	const dataMapper: ApexAxisChartSeries = useMemo(() => {
		if (!data?.length) return [];

		const l = data.length;
		const result: Array<{ data: Array<{ x: string; y: number }> }> = [
			{
				data: [],
			},
			{
				data: [],
			},
		];
		for (let i = 0; i < l; i++) {
			const item = data[i];
			const dateTime = item.dateTime;
			const call = 'individualBuyAverage' in item ? item.individualBuyAverage : item.sumOfLegalsBuyVolume;
			const put = 'individualBuyAverage' in item ? item.individualSellAverage : item.sumOfLegalsSellVolume;

			result[0].data.push({
				x: dateTime,
				y: call,
			});

			result[1].data.push({
				x: dateTime,
				y: put,
			});
		}

		return result;
	}, [type, symbolType, data]);

	const colors = ['rgba(0, 194, 136, 1)', 'rgba(255, 82, 109, 1)'];

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
					legend: {
						show: false,
					},
					colors,
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
							formatter: (v) => {
								return dateFormatter(v, 'time');
							},
						},
					},
					yaxis: {
						tickAmount: 2,
						labels: {
							offsetX: -16,
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
						strokeColors: colors,
						colors: 'rgb(255, 255, 255)',
						strokeWidth: 2,
						hover: {
							size: 4,
						},
					},
					grid: {
						position: 'back',
						strokeDashArray: 24,
						show: true,
						yaxis: {
							lines: {
								show: true,
							},
						},
						xaxis: {
							lines: {
								show: true,
							},
						},
						padding: {
							top: -16,
							left: -8,
							bottom: 0,
							right: 0,
						},
					},
					stroke: {
						curve: 'smooth',
						width: 2,
					},
				}}
				series={dataMapper}
				type='line'
				width='100%'
				height='100%'
			/>

			<Suspend isLoading={isFetching} isEmpty={!data?.length} />
		</>
	);
};

export default IndividualAndLegalChart;

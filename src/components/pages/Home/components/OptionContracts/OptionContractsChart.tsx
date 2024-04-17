import num2persian from '@/utils/num2persian';
import { useMemo } from 'react';
import Chart from 'react-apexcharts';

interface OptionContractsChartProps {
	basis: Dashboard.GetOptionContractAdditionalInfo.Basis;
	type: Dashboard.GetOptionContractAdditionalInfo.Type;
	data?: Dashboard.GetOptionContractAdditionalInfo.All;
	setDataPointHover: (v: Dashboard.GetOptionContractAdditionalInfo.DataPoint) => void;
}

const IOTM_COLORS = ['rgba(0, 182, 237, 1)', 'rgba(0, 194, 136, 1)', 'rgba(255, 82, 109, 1)'];

const CONTRACT_TYPE_COLORS = ['rgba(0, 194, 136, 1)', 'rgba(255, 82, 109, 1)'];

const OptionContractsChart = ({ type, basis, data, setDataPointHover }: OptionContractsChartProps) => {
	const dataMapper = useMemo(() => {
		try {
			if (!Array.isArray(data)) return [];

			const fieldName = basis === 'Value' ? 'tradeValue' : 'tradeVolume';

			return data.map((item) => item[fieldName]);
		} catch (e) {
			return [];
		}
	}, [basis, data]);

	const donutColor = type === 'IOTM' ? IOTM_COLORS : CONTRACT_TYPE_COLORS;

	return (
		<Chart
			options={{
				chart: {
					events: {
						dataPointMouseEnter: (_e, _c, { dataPointIndex }: { dataPointIndex: number }) => {
							try {
								const i: Dashboard.GetOptionContractAdditionalInfo.DataPoint[] = [
									'call',
									'put',
									'atm',
									'itm',
									'otm',
								];

								if (type === 'ContractType') {
									setDataPointHover(i[dataPointIndex]);
								} else {
									setDataPointHover(i[dataPointIndex + 2] ?? null);
								}
							} catch (e) {
								//
							}
						},
						mouseLeave: () => setDataPointHover(null),
					},
					animations: {
						dynamicAnimation: {
							enabled: true,
						},
						animateGradually: {
							enabled: false,
						},
						enabled: true,
						easing: 'linear',
						speed: 200,
					},
				},
				states: {
					active: {
						allowMultipleDataPointsSelection: false,
						filter: {
							type: 'none',
						},
					},
					hover: {
						filter: {
							type: 'darken',
							value: 0.75,
						},
					},
				},
				fill: {
					colors: donutColor,
				},
				plotOptions: {
					pie: {
						expandOnClick: true,
					},
				},
				colors: donutColor,
				legend: {
					show: false,
				},
				dataLabels: {
					enabled: false,
				},
				tooltip: {
					intersect: false,
					followCursor: false,
					cssClass: 'apex-tooltip',
					fillSeriesColor: false,
					style: {
						fontFamily: 'IRANSans',
					},
					y: {
						title: {
							formatter: () => '',
						},
						formatter: (v) => {
							return `‏${num2persian(String(v))}`;
						},
					},
				},
				stroke: {
					show: true,
					width: 2,
					colors: ['rgb(255, 255, 255)'],
				},
			}}
			series={dataMapper}
			type='donut'
			width='100%'
			height='100%'
		/>
	);
};

export default OptionContractsChart;

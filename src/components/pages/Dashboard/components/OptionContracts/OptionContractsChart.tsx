import AppChart from '@/components/common/AppChart';
import num2persian from '@/utils/num2persian';
import { useMemo } from 'react';

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
		<AppChart
			options={{
				chart: {
					events: {
						dataPointMouseEnter: (_e, _c, { dataPointIndex }: { dataPointIndex: number }) => {
							try {
								const i: Dashboard.GetOptionContractAdditionalInfo.DataPoint[] = [
									'call',
									'put',
									'itm',
									'atm',
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
						customScale: 0.75,
						expandOnClick: true,

						donut: {
							size: '60%',
						},
					},
				},
				colors: donutColor,
				tooltip: {
					cssClass: 'apex-tooltip',
					fillSeriesColor: false,
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
				grid: {
					padding: {
						top: 0,
						right: 0,
						bottom: 0,
						left: 0,
					},
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

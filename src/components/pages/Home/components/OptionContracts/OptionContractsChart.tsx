import { useMemo } from 'react';
import Chart from 'react-apexcharts';

interface OptionContractsChartProps {
	basis: Dashboard.GetOptionContractAdditionalInfo.Basis;
	type: Dashboard.GetOptionContractAdditionalInfo.Type;
	data?: Dashboard.GetOptionContractAdditionalInfo.All;
}

const IOTM_COLORS = ['rgba(0, 182, 237, 1)', 'rgba(0, 194, 136, 1)', 'rgba(255, 82, 109, 1)'];

const CONTRACT_TYPE_COLORS = ['rgba(0, 194, 136, 1)', 'rgba(255, 82, 109, 1)'];

const OptionContractsChart = ({ type, basis, data }: OptionContractsChartProps) => {
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
		<div className='flex-1'>
			<Chart
				options={{
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
					fill: {
						colors: donutColor,
					},
					colors: donutColor,
					legend: {
						show: false,
					},
					dataLabels: {
						enabled: false,
					},
					tooltip: {
						enabled: false,
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
		</div>
	);
};

export default OptionContractsChart;

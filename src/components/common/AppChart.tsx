import ApexChart, { type Props } from 'react-apexcharts';

const AppChart = ({ options, height = '100%', series, type = 'area', width = '100%' }: Partial<Props>) => {
	return (
		<ApexChart
			options={{
				colors: ['rgb(66, 115, 237)'],
				stroke: {
					curve: 'smooth',
					width: 1,
				},
				...options,
				chart: {
					stacked: false,
					toolbar: {
						show: false,
					},
					foreColor: 'rgb(146, 145, 165)',
					zoom: {
						enabled: false,
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
					...options?.chart,
				},
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
					},
				},
				xaxis: {
					offsetX: 0,
					offsetY: 0,
					tickAmount: 7,
					axisBorder: {
						show: false,
					},
					axisTicks: {
						show: false,
					},
					labels: {
						style: {
							fontFamily: 'IRANSans',
							fontSize: '12px',
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
							fontSize: '12px',
						},
					},
				},
				legend: {
					show: false,
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
						bottom: 0,
						right: 0,
					},
				},
			}}
			series={series}
			type={type}
			width={width}
			height={height}
		/>
	);
};

export default AppChart;

import ApexChart, { type Props } from 'react-apexcharts';

const AppChart = ({ options, height = '100%', series, type = 'area', width = '100%' }: Partial<Props>) => {
	const colors = options?.colors ?? ['rgb(66, 115, 237)'];

	return (
		<ApexChart
			options={{
				colors,
				stroke: {
					curve: 'smooth',
					width: 2,
				},
				legend: {
					show: false,
				},
				...options,
				dataLabels: {
					enabled: false,
					style: {
						colors: ['rgba(93, 96, 109, 1)'],
						fontWeight: 500,
						fontFamily: 'IRANSans',
						fontSize: '12px',
					},
					...options?.dataLabels,
				},
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

					...options?.tooltip,

					x: {
						show: false,
						...options?.tooltip?.x,
					},

					y: {
						title: {
							formatter: () => {
								return '';
							},
						},
						...options?.tooltip?.y,
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
					...options?.xaxis,
					labels: {
						rotate: 0,
						style: {
							fontFamily: 'IRANSans',
							fontSize: '12px',
						},
						...options?.xaxis?.labels,
					},
				},
				yaxis: {
					tickAmount: 4,
					...options?.yaxis,
					labels: {
						rotate: 0,
						offsetX: -8,
						offsetY: 1,
						style: {
							fontFamily: 'IRANSans',
							fontSize: '12px',
						},
						...(options?.yaxis as ApexYAxis)?.labels,
					},
				},
				markers: {
					size: 0,
					strokeColors: colors,
					colors: 'rgb(255, 255, 255)',
					strokeWidth: 2,
					hover: {
						size: 4,
					},
					...options?.markers,
				},
				grid: {
					position: 'back',
					show: true,
					...options?.grid,
					yaxis: {
						lines: {
							show: true,
						},
						...options?.grid?.yaxis,
					},
					padding: {
						top: -16,
						left: 0,
						bottom: 0,
						right: -24,
						...options?.grid?.padding,
					},
				},
				fill: {
					type: type === 'area' ? 'gradient' : 'solid',
					gradient: {
						type: 'vertical',
						colorStops: [
							{
								offset: 20,
								color: colors[0],
								opacity: 0.2,
							},
							{
								offset: 100,
								color: colors[0],
								opacity: 0,
							},
						],
					},
					...options?.fill,
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

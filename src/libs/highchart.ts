import { type AxisCrosshairOptions, setOptions } from 'highcharts/highstock';

export const chartFontSetting = {
	fontFamily: 'IRANSans',
	fontSize: '11',
	fontWeight: '400',
};

export const chartCrosshairSetting: AxisCrosshairOptions = {
	width: 1,
	dashStyle: 'LongDash',
	label: {
		enabled: true,
		align: 'center',
		backgroundColor: 'rgba(24, 28, 47, 1)',
		borderRadius: 4,
		style: {
			...chartFontSetting,
			height: 40,
			borderRadius: 4,
			borderWidth: 0,
			color: 'rgb(255, 255, 255)',
		},
	},
};

export const setupChart = () => {
	setOptions({
		chart: {
			zooming: {
				resetButton: {
					position: {
						x: -999,
						y: -999,
					},
				},
				mouseWheel: {
					enabled: true,
					type: 'x',
				},
				singleTouch: false,
			},
			panning: {
				enabled: true,
				type: 'x',
			},
		},
		accessibility: {
			enabled: false,
		},
		subtitle: {
			text: '',
		},
		title: {
			text: '',
		},
		legend: {
			enabled: false,
		},
		credits: {
			enabled: false,
		},
		connectors: {
			enabled: false,
		},
		caption: {
			text: '',
		},
		tooltip: {
			followTouchMove: true,
			backgroundColor: 'rgba(24, 28, 47, 1)',
			borderRadius: 4,
			borderWidth: 0,
			style: {
				...chartFontSetting,
				color: 'rgb(255, 255, 255)',
			},
		},
		plotOptions: {
			area: {
				marker: {
					enabled: false,
				},
			},
			areaspline: {
				marker: {
					enabled: false,
				},
			},
		},
		xAxis: {
			lineColor: 'rgb(226, 231, 237)',
			endOnTick: false,
			startOnTick: false,
			showFirstLabel: true,
			showLastLabel: true,
			tickWidth: 0,
			maxPadding: 0,
			minPadding: 0,
			title: {
				text: '',
			},
			crosshair: chartCrosshairSetting,
			labels: {
				align: 'center',
				rotation: 0,
				style: {
					...chartFontSetting,
					color: 'rgba(93, 96, 109, 1)',
				},
			},
		},
		yAxis: {
			tickWidth: 0,
			minPadding: 0,
			maxPadding: 0,
			startOnTick: true,
			endOnTick: true,
			showFirstLabel: true,
			showLastLabel: true,
			gridLineColor: 'rgb(226, 231, 237)',
			title: {
				text: '',
			},
			crosshair: {
				...chartCrosshairSetting,
				label: {
					enabled: false,
				},
			},
			labels: {
				style: {
					...chartFontSetting,
					color: 'rgba(93, 96, 109, 1)',
				},
			},
		},
	});
};

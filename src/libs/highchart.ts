import { type AxisCrosshairOptions, setOptions } from 'highcharts/highstock';

export const chartFontSetting = {
	fontFamily: 'IRANSans',
	fontSize: '11px',
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
			fontFamily: chartFontSetting.fontFamily,
			fontSize: '12px',
			fontWeight: '400',
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
			animation: true,
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
			hideDelay: 0,
			followTouchMove: true,
			backgroundColor: 'rgba(24, 28, 47, 1)',
			borderRadius: 4,
			borderWidth: 0,
			useHTML: true,
			style: {
				...chartFontSetting,
				pointerEvents: 'none',
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
			line: {
				marker: {
					enabled: false,
				},
			},
			spline: {
				marker: {
					enabled: false,
				},
			},
			pie: {
				allowPointSelect: true,
				cursor: 'pointer',
				dataLabels: {
					enabled: false,
				},
			},
			column: {
				dataLabels: {
					style: chartFontSetting,
				},
			},
		},
		xAxis: {
			gridLineColor: 'rgb(226, 231, 237)',
			lineColor: 'rgb(226, 231, 237)',
			endOnTick: false,
			startOnTick: false,
			showFirstLabel: true,
			showLastLabel: true,
			tickWidth: 0,
			maxPadding: 0,
			minPadding: 0,
			offset: 0,
			lineWidth: 0,
			gridLineWidth: 0,
			title: {
				text: '',
			},
			crosshair: chartCrosshairSetting,
			labels: {
				padding: '0',
				align: 'center',
				rotation: 0,
				style: {
					...chartFontSetting,
					color: 'rgba(93, 96, 109, 1)',
				},
			},
		},
		yAxis: {
			lineWidth: 0,
			tickWidth: 0,
			minPadding: 0.025,
			maxPadding: 0.025,
			offset: 0,
			startOnTick: true,
			endOnTick: true,
			showFirstLabel: true,
			showLastLabel: true,
			gridLineColor: 'rgb(226, 231, 237)',
			lineColor: 'rgb(226, 231, 237)',
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
				padding: '0',
				style: {
					...chartFontSetting,
					color: 'rgba(93, 96, 109, 1)',
				},
			},
		},
	});
};

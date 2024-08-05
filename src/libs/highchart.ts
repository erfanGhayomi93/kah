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
			backgroundColor: 'transparent',
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
			backgroundColor: 'rgba(28, 30, 38, 1)',
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
				},
			},
		},
	});
};

export const setupChartColor = (theme: Exclude<TTheme, 'system'>) => {
	setOptions(getChartTheme(theme));
};

export const getChartTheme = (theme: Exclude<TTheme, 'system'>) => {
	const colors: Record<string, Record<typeof theme, string>> = {
		axisGridLineColor: {
			light: 'rgb(226, 231, 237)',
			dark: 'rgba(55, 57, 69, 1)',
			darkBlue: 'rgba(55, 57, 69, 1)',
		},
		axisLineColor: {
			light: 'rgb(226, 231, 237)',
			dark: 'rgba(55, 57, 69, 1)',
			darkBlue: 'rgba(55, 57, 69, 1)',
		},
		axisLabelColor: {
			light: 'rgba(93, 96, 109, 1)',
			dark: 'rgb(166, 169, 173)',
			darkBlue: 'rgb(166, 169, 173)',
		},
		pieBorderColor: {
			light: 'rgba(255, 255, 255, 1)',
			dark: 'rgba(28, 30, 38, 1)',
			darkBlue: 'rgba(28, 30, 38, 1)',
		},
		columnLabelColor: {
			light: 'rgb(93, 96, 109)',
			dark: 'rgba(166, 169, 173, 1)',
			darkBlue: 'rgba(166, 169, 173, 1)',
		},
		axisCrosshairBorderColor: {
			light: 'rgb(28, 30, 38)',
			dark: 'rgb(68, 70, 83)',
			darkBlue: 'rgb(28, 48, 85)',
		},
		axisCrosshairBackgroundColor: {
			light: 'rgb(28, 30, 38)',
			dark: 'rgb(68, 70, 83)',
			darkBlue: 'rgba(28, 48, 85)',
		},
		navigatorLabelColor: {
			light: 'rgba(93, 96, 109, 1)',
			dark: 'rgb(166, 169, 173)',
			darkBlue: 'rgb(166, 169, 173)',
		},
		navigatorBorderColor: {
			light: 'rgb(226, 231, 237)',
			dark: 'rgb(55, 57, 69)',
			darkBlue: 'rgba(55, 57, 69)',
		},
	};

	return {
		navigator: {
			outlineColor: colors.navigatorBorderColor[theme],
			xAxis: {
				labels: {
					style: {
						textOutline: `1px solid ${colors.navigatorLabelColor[theme]}`,
						color: colors.navigatorLabelColor[theme],
					},
				},
			},
		},
		xAxis: {
			gridLineColor: colors.axisGridLineColor[theme],
			lineColor: colors.axisLineColor[theme],
			crosshair: {
				color: colors.axisCrosshairBorderColor[theme],
				label: {
					backgroundColor: colors.axisCrosshairBackgroundColor[theme],
				},
			},
			labels: {
				style: {
					color: colors.axisLabelColor[theme],
				},
			},
		},
		yAxis: {
			gridLineColor: colors.axisGridLineColor[theme],
			lineColor: colors.axisLineColor[theme],
			crosshair: {
				color: colors.axisCrosshairBorderColor[theme],
				label: {
					backgroundColor: colors.axisCrosshairBackgroundColor[theme],
				},
			},
			labels: {
				style: {
					color: colors.axisLabelColor[theme],
				},
			},
		},
		plotOptions: {
			pie: {
				borderColor: colors.pieBorderColor[theme],
				borderWidth: 8,
			},
			column: {
				dataLabels: {
					style: {
						opacity: 1,
						color: colors.columnLabelColor[theme],
						textOutline: `1px solid ${colors.columnLabelColor[theme]}`,
					},
				},
			},
		},
	};
};

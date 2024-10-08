import { useOptionCalculativeInfoQuery } from '@/api/queries/optionQueries';
import SymbolSummary, { type ListItemProps } from '@/components/common/Symbol/SymbolSummary';
import { numFormatter, sepNumbers } from '@/utils/helpers';
import { blackScholes } from '@/utils/math/black-scholes';
import { useTranslations } from 'next-intl';
import { useMemo } from 'react';

interface ComputingInformationProps {
	symbol: Symbol.Info | null;
}

const ComputingInformation = ({ symbol }: ComputingInformationProps) => {
	const t = useTranslations();

	const { data: optionData } = useOptionCalculativeInfoQuery({
		queryKey: ['optionCalculativeInfoQuery', symbol?.symbolISIN ?? ''],
		enabled: Boolean(symbol?.symbolISIN),
	});

	const symbolDetails = useMemo<Array<[ListItemProps, ListItemProps]>>(() => {
		try {
			if (!symbol || !optionData) return [];

			const {
				breakEvenPoint,
				leverage,
				historicalVolatility,
				impliedVolatility,
				intrinsicValue,
				timeValue,
				iotm,
				initialMargin,
				requiredMargin,
			} = optionData;

			const isCall = symbol?.contractType === 'Call';
			const dueDays = Math.ceil(
				Math.abs(Date.now() - new Date(symbol.contractEndDate).getTime()) / 1e3 / 24 / 60 / 60,
			);

			const { vega, gamma, thetaCall, thetaPut, deltaPut, deltaCall } = blackScholes({
				sharePrice: symbol?.baseSymbolPrice ?? 0,
				strikePrice: symbol.strikePrice ?? 0,
				rate: 0.3,
				volatility: Number(historicalVolatility) / 100,
				dueDays,
			});

			const theta = (isCall ? thetaCall : thetaPut) || 0;
			const delta = (isCall ? deltaCall : deltaPut) || 0;

			return [
				[
					{
						id: 'breakEvenPoint',
						title: t('old_option_chain.break_even_point'),
						valueFormatter: numFormatter(breakEvenPoint),
					},
					{
						id: 'impliedVolatility',
						title: t('old_option_chain.implied_volatility'),
						valueFormatter: sepNumbers(impliedVolatility.toFixed(2)),
					},
				],

				[
					{
						id: 'leverage',
						title: t('old_option_chain.leverage'),
						valueFormatter: numFormatter(leverage),
					},
					{
						id: 'historical_volatility',
						title: t('old_option_chain.historical_volatility'),
						valueFormatter: historicalVolatility,
					},
				],

				[
					{
						id: 'delta',
						title: t('old_option_chain.delta'),
						valueFormatter: delta.toFixed(3),
					},
					{
						id: 'w_implied_volatility',
						title: t('old_option_chain.w_implied_volatility'),
						valueFormatter: sepNumbers(intrinsicValue.toFixed(3)),
					},
				],

				[
					{
						id: 'theta',
						title: t('old_option_chain.theta'),
						valueFormatter: theta.toFixed(3),
					},
					{
						id: 'intrinsicValue',
						title: t('old_option_chain.intrinsic_value'),
						valueFormatter: sepNumbers(intrinsicValue.toFixed(3)),
					},
				],

				[
					{
						id: 'gamma',
						title: t('old_option_chain.gamma'),
						valueFormatter: sepNumbers(gamma.toFixed(3)),
					},
					{
						id: 'timeValue',
						title: t('old_option_chain.time_value'),
						valueFormatter: sepNumbers(String(timeValue)),
					},
				],

				[
					{
						id: 'vega',
						title: t('old_option_chain.vega'),
						valueFormatter: sepNumbers(vega.toFixed(3)),
					},
					{
						id: 'iotm',
						title: t('old_option_chain.iotm'),
						valueFormatter: iotm,
					},
				],

				[
					{
						id: 'requiredMargin',
						title: t('old_option_chain.required_margin'),
						valueFormatter: sepNumbers(String(requiredMargin)),
					},
					{
						id: 'initialMargin',
						title: t('old_option_chain.initial_margin'),
						valueFormatter: sepNumbers(String(initialMargin)),
					},
				],
			];
		} catch (error) {
			return [];
		}
	}, [symbol, optionData]);

	return <SymbolSummary data={symbolDetails} />;
};

export default ComputingInformation;

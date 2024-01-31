import { useOptionCalculativeInfoQuery } from '@/api/queries/optionQueries';
import SymbolSummary, { type ListItemProps } from '@/components/common/Symbol/SymbolSummary';
import dayjs from '@/libs/dayjs';
import { numFormatter, sepNumbers } from '@/utils/helpers';
import clsx from 'clsx';
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
				delta,
				historicalVolatility,
				theta,
				intrinsicValue,
				gamma,
				timeValue,
				vega,
				iotm,
				initialMargin,
				requiredMargin,
			} = optionData;

			const { closingPrice, closingPriceVarReferencePrice, closingPriceVarReferencePricePercent } = symbol;

			return [
				[
					{
						id: 'breakEvenPoint',
						title: t('option_chain.trade_volume'),
						valueFormatter: numFormatter(breakEvenPoint),
					},
					{
						id: 'closingPrice',
						title: t('option_chain.closing_price'),
						valueFormatter: (
							<span
								className={clsx(
									'gap-4 flex-items-center',
									closingPriceVarReferencePricePercent >= 0 ? 'text-success-200' : 'text-error-200',
								)}
							>
								{sepNumbers(String(closingPrice))}
								<span className='text-tiny ltr'>
									{closingPriceVarReferencePrice} (
									{(closingPriceVarReferencePricePercent ?? 0).toFixed(2)} %)
								</span>
							</span>
						),
					},
				],

				[
					{
						id: 'leverage',
						title: t('option_chain.trade_value'),
						valueFormatter: numFormatter(leverage),
					},
					{
						id: 'historical_volatility',
						title: t('option_chain.historical_volatility'),
						valueFormatter: historicalVolatility,
					},
				],

				[
					{
						id: 'delta',
						title: t('option_chain.delta'),
						valueFormatter: delta.toFixed(3),
					},
					{
						id: 'impliedVolatility',
						title: t('option_chain.implied_volatility'),
						valueFormatter: sepNumbers(intrinsicValue.toFixed(3)),
					},
				],

				[
					{
						id: 'theta',
						title: t('option_chain.theta'),
						valueFormatter: theta.toFixed(3),
					},
					{
						id: 'intrinsicValue',
						title: t('option_chain.intrinsic_value'),
						valueFormatter: sepNumbers(intrinsicValue.toFixed(3)),
					},
				],

				[
					{
						id: 'gamma',
						title: t('option_chain.gamma'),
						valueFormatter: sepNumbers(gamma.toFixed(3)),
					},
					{
						id: 'timeValue',
						title: t('option_chain.time_value'),
						valueFormatter: dayjs(timeValue).calendar('jalali').format('YYYY/MM/DD − HH:mm:ss'),
					},
				],

				[
					{
						id: 'vega',
						title: t('option_chain.vega'),
						valueFormatter: sepNumbers(vega.toFixed(3)),
					},
					{
						id: 'iotm',
						title: t('option_chain.iotm'),
						valueFormatter: iotm,
					},
				],

				[
					{
						id: 'requiredMargin',
						title: t('option_chain.required_margin'),
						valueFormatter: sepNumbers(String(requiredMargin)),
					},
					{
						id: 'initialMargin',
						title: t('option_chain.initial_margin'),
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

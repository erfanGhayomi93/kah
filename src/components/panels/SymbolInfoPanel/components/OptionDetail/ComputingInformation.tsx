import { useOptionCalculativeInfoQuery } from '@/api/queries/optionQueries';
import { numFormatter, sepNumbers } from '@/utils/helpers';
import { blackScholes } from '@/utils/math/black-scholes';
import { useTranslations } from 'next-intl';
import { useMemo } from 'react';
import Loading from '../../common/Loading';

interface IOptionItem {
	id: string;
	title: string;
	value: React.ReactNode;
}

interface ComputingInformationProps {
	isExpand: boolean;
	symbolData: Symbol.Info;
}

const ComputingInformation = ({ isExpand, symbolData }: ComputingInformationProps) => {
	const t = useTranslations();

	const { data, isLoading } = useOptionCalculativeInfoQuery({
		queryKey: ['optionCalculativeInfoQuery', symbolData.symbolISIN],
	});

	const items = useMemo<IOptionItem[]>(() => {
		if (!data) return [];

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
		} = data;

		const isCall = symbolData?.contractType === 'Call';
		const dueDays = Math.ceil(
			Math.abs(Date.now() - new Date(symbolData.contractEndDate).getTime()) / 1e3 / 24 / 60 / 60,
		);

		const { vega, gamma, thetaCall, thetaPut, deltaPut, deltaCall, rhoCall, rhoPut } = blackScholes({
			sharePrice: symbolData?.baseSymbolPrice ?? 0,
			strikePrice: symbolData.strikePrice ?? 0,
			rate: 0.3,
			volatility: Number(historicalVolatility) / 100,
			dueDays,
		});

		const theta = (isCall ? thetaCall : thetaPut) || 0;
		const delta = (isCall ? deltaCall : deltaPut) || 0;
		const rho = isCall ? rhoCall : rhoPut;

		return [
			{
				id: 'breakEvenPoint',
				title: t('old_option_chain.break_even_point'),
				value: numFormatter(breakEvenPoint),
			},

			{
				id: 'impliedVolatility',
				title: t('old_option_chain.implied_volatility'),
				value: sepNumbers(impliedVolatility.toFixed(2)),
			},

			{
				id: 'leverage',
				title: t('old_option_chain.leverage'),
				value: numFormatter(leverage),
			},

			{
				id: 'historical_volatility',
				title: t('old_option_chain.historical_volatility'),
				value: historicalVolatility,
			},

			{
				id: 'delta',
				title: t('old_option_chain.delta'),
				value: delta.toFixed(3),
			},

			/* {
				id: 'w_implied_volatility',
				title: t('old_option_chain.w_implied_volatility'),
				value: sepNumbers(intrinsicValue.toFixed(3)),
			}, */

			{
				id: 'theta',
				title: t('old_option_chain.theta'),
				value: theta.toFixed(3),
			},

			{
				id: 'intrinsicValue',
				title: t('old_option_chain.intrinsic_value'),
				value: sepNumbers(intrinsicValue.toFixed(3)),
			},

			{
				id: 'gamma',
				title: t('old_option_chain.gamma'),
				value: sepNumbers(gamma.toFixed(3)),
			},

			{
				id: 'rho',
				title: t('old_option_chain.rho'),
				value: rho.toFixed(3),
			},

			{
				id: 'timeValue',
				title: t('old_option_chain.time_value'),
				value: sepNumbers(String(timeValue)),
			},

			{
				id: 'vega',
				title: t('old_option_chain.vega'),
				value: sepNumbers(vega.toFixed(3)),
			},

			{
				id: 'iotm',
				title: t('old_option_chain.iotm'),
				value: iotm,
			},

			{
				id: 'requiredMargin',
				title: t('old_option_chain.required_margin'),
				value: sepNumbers(String(requiredMargin)),
			},

			{
				id: 'initialMargin',
				title: t('old_option_chain.initial_margin'),
				value: sepNumbers(String(initialMargin)),
			},
		];
	}, [data]);

	const rows = useMemo(() => {
		if (!isExpand) return items;
		return items.slice(0, 6);
	}, [items, isExpand]);

	if (isLoading) return <Loading />;

	return (
		<ul className='flex-column' style={{ height: `${rows.length * 40}px`, transition: 'height 200ms ease-in' }}>
			{rows.map((row) => (
				<li
					key={row.id}
					style={{ flex: '0 0 40px' }}
					className='rounded-sm px-8 text-base flex-justify-between odd:bg-gray-100'
				>
					<span className='text-gray-700'>{row.title}:</span>
					<span className='text-gray-800 ltr'>{row.value}</span>
				</li>
			))}
		</ul>
	);
};

export default ComputingInformation;

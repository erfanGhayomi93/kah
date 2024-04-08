import { useOptionCalculativeInfoQuery } from '@/api/queries/optionQueries';
import dayjs from '@/libs/dayjs';
import { numFormatter, sepNumbers } from '@/utils/helpers';
import { useTranslations } from 'next-intl';
import { useMemo } from 'react';
import Loading from '../../common/Loading';

interface IOptionItem {
	id: string;
	title: string;
	value: React.ReactNode;
}

interface ComputingInformationProps {
	symbolISIN: string;
}

const ComputingInformation = ({ symbolISIN }: ComputingInformationProps) => {
	const t = useTranslations();

	const { data, isLoading } = useOptionCalculativeInfoQuery({
		queryKey: ['optionCalculativeInfoQuery', symbolISIN],
	});

	const dateFormatter = (v: string | number | null) => {
		if (!v) return '−';
		return dayjs(v).calendar('jalali').format('YYYY/MM/DD − HH:mm:ss');
	};

	const items = useMemo<IOptionItem[]>(() => {
		if (!data) return [];

		const {
			breakEvenPoint,
			leverage,
			delta,
			historicalVolatility,
			impliedVolatility,
			theta,
			intrinsicValue,
			gamma,
			timeValue,
			vega,
			iotm,
			initialMargin,
			requiredMargin,
		} = data;

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

			{
				id: 'w_implied_volatility',
				title: t('old_option_chain.w_implied_volatility'),
				value: sepNumbers(intrinsicValue.toFixed(3)),
			},

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
				id: 'timeValue',
				title: t('old_option_chain.time_value'),
				value: dateFormatter(timeValue),
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

	if (isLoading) return <Loading />;

	return (
		<div className='px-8 pb-8 pt-16 flex-column'>
			<ul className='flex-column'>
				{items.map((item) => (
					<li
						style={{ flex: '0 0 40px' }}
						className='rounded-sm px-8 text-base flex-justify-between even:bg-gray-200'
						key={item.id}
					>
						<span className='text-gray-900'>{item.title}:</span>
						<span className='text-gray-1000 ltr'>{item.value}</span>
					</li>
				))}
			</ul>
		</div>
	);
};

export default ComputingInformation;

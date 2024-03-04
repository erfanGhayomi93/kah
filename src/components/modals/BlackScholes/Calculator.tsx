import { blackScholes } from '@/utils/Math/black-scholes';
import { type IBlackScholesResponse } from '@/utils/Math/type';
import { sepNumbers } from '@/utils/helpers';
import { useTranslations } from 'next-intl';
import { useLayoutEffect, useState } from 'react';
import styled from 'styled-components';

interface CalculatorProps extends IBlackScholesModalStates {}

const Section = styled.div<{ $side?: string }>`
	position: relative;
	flex: 0 0 13.2rem;
	border-radius: 0.8rem;
	display: flex;
	flex-direction: column;
	font-size: 1.4rem;
	font-weight: 700;

	${({ $side }) =>
		$side &&
		`
	&::after {
		content: "${$side}";
		position: absolute;
		left: 0.8rem;
		padding: 0 0.8rem;
		top: -1rem;
		color: inherit;
		z-index: 9;
		background-color: inherit;
	}
	`}
`;

const Part = styled.div`
	flex: 1;
	direction: ltr;
	width: 100%;
	display: flex;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
	justify-content: center;
	align-items: center;
`;

const Calculator = (props: CalculatorProps) => {
	const t = useTranslations();

	const [values, setValues] = useState<IBlackScholesResponse>({
		call: 0,
		put: 0,
		deltaCall: 0,
		deltaPut: 0,
		vega: 0,
		thetaCall: 0,
		thetaPut: 0,
		rhoCall: 0,
		rhoPut: 0,
		lambdaCall: 0,
		lambdaPut: 0,
		gamma: 0,
	});

	const numFormatter = (v: number, l = 3) => {
		if (isNaN(v) || v === Infinity) return '−';

		if (l === 0) return sepNumbers(v.toFixed(0));

		const value = v.toFixed(l);
		const [integer, decimal] = value.split('.');

		if (!decimal) return sepNumbers(integer);

		return sepNumbers(integer) + '.' + decimal;
	};

	useLayoutEffect(() => {
		const { strikePrice, dueDays, volatility, riskFreeProfit, sharePrice } = props;

		setValues(
			blackScholes({
				sharePrice,
				strikePrice,
				rate: Number(riskFreeProfit) / 100,
				volatility: Number(volatility) / 100,
				dueDays,
			}),
		);
	}, [JSON.stringify(props)]);

	return (
		<div className='h-full flex-1 justify-between gap-24 rounded-md bg-gray-100 px-24 pb-16 pt-24 flex-column'>
			<div className='flex flex-1'>
				<Section $side='Call' className='border border-success-100 bg-gray-100 text-success-100'>
					<Part className='text-lg'>{numFormatter(values.call, 0)}</Part>
					<Part className='bg-success-100/5'>{numFormatter(values.deltaCall)}</Part>
					<Part className='bg-success-100/5'>{numFormatter(values.gamma, 7)}</Part>
					<Part className='bg-success-100/5'>{numFormatter(values.vega)}</Part>
					<Part className='bg-success-100/5'>{numFormatter(values.thetaCall)}</Part>
					<Part className='bg-success-100/5'>{numFormatter(values.rhoCall)}</Part>
				</Section>

				<div className='flex-1 text-base font-medium text-gray-900 flex-column'>
					<Part>{t('black_scholes_modal.theoretical_price')}</Part>
					<Part className='bg-gray-200'>{t('black_scholes_modal.delta')}</Part>
					<Part className='bg-gray-200'>{t('black_scholes_modal.gamma')}</Part>
					<Part className='bg-gray-200'>{t('black_scholes_modal.vega')}</Part>
					<Part className='bg-gray-200'>{t('black_scholes_modal.theta')}</Part>
					<Part className='bg-gray-200'>{t('black_scholes_modal.rho')}</Part>
				</div>

				<Section $side='Put' className='border border-error-100 bg-gray-100 text-error-100'>
					<Part className='text-lg'>{numFormatter(values.put, 0)}</Part>
					<Part className='bg-error-100/5'>{numFormatter(values.deltaPut)}</Part>
					<Part className='bg-error-100/5'>{numFormatter(values.gamma, 7)}</Part>
					<Part className='bg-error-100/5'>{numFormatter(values.vega)}</Part>
					<Part className='bg-error-100/5'>{numFormatter(values.thetaPut)}</Part>
					<Part className='bg-error-100/5'>{numFormatter(values.rhoPut)}</Part>
				</Section>
			</div>

			<div
				style={{ height: '5.4rem', boxShadow: '0px 2px 11px 0px rgba(0, 0, 0, 0.03)' }}
				className='flex rounded bg-white text-base ltr'
			>
				<Section style={{ flex: '0 0 13.2rem' }} className='h-full flex-justify-center'>
					<span className='font-bold text-error-100 ltr'>-65.25</span>
				</Section>

				<div className='h-full flex-1 flex-justify-center'>
					<span className='font-medium text-gray-900'>{t('black_scholes_modal.implied_volatility')}</span>
				</div>

				<Section className='h-full ltr flex-justify-center'>
					<span className='font-bold text-success-100'>2.57</span>
				</Section>
			</div>
		</div>
	);
};

export default Calculator;

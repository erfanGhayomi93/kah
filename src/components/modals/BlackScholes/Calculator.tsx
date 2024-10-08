import { cn, toFixed } from '@/utils/helpers';
import { blackScholes, impliedVolatility } from '@/utils/math/black-scholes';
import { type IBlackScholesResponse } from '@/utils/math/type';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import styles from './BlackScholes.module.scss';

interface CalculatorProps extends IBlackScholesModalStates {}

interface IInputs extends IBlackScholesResponse {
	ivCall: number;
	ivPut: number;
}

const Calculator = (props: CalculatorProps) => {
	const t = useTranslations();

	const [values, setValues] = useState<IInputs>({
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
		ivCall: 0,
		ivPut: 0,
	});

	useEffect(() => {
		const { strikePrice, dueDays, volatility, riskFreeProfit, sharePrice, premium } = props;

		const rate = Number(riskFreeProfit) / 100;
		const volatilityAsPercent = Number(volatility) / 100;

		const ivCall = impliedVolatility({
			optionPrice: premium,
			rate,
			strikePrice,
			dueDays,
			contractType: 'call',
			sharePrice,
			stepCount: 5,
			volatility: volatilityAsPercent,
			step: 1,
		});

		const ivPut = impliedVolatility({
			optionPrice: premium,
			rate,
			strikePrice,
			dueDays,
			contractType: 'put',
			sharePrice,
			stepCount: 5,
			volatility: volatilityAsPercent,
			step: 1,
		});

		setValues({
			...blackScholes({
				sharePrice,
				strikePrice,
				rate,
				volatility: volatilityAsPercent,
				dueDays,
			}),
			ivCall,
			ivPut,
		});
	}, [JSON.stringify(props)]);

	return (
		<>
			<div className='flex flex-1'>
				<fieldset
					className={cn(
						'border border-success-100 bg-gray-50 text-success-100',
						styles.section,
						styles.fieldset,
					)}
				>
					<legend>Call</legend>
					<div className={cn('text-lg', styles.part)}>{toFixed(values.call, 0)}</div>
					<div className={cn(styles.green, styles.part)}>{toFixed(values.deltaCall)}</div>
					<div className={cn(styles.green, styles.part)}>{toFixed(values.gamma, 7)}</div>
					<div className={cn(styles.green, styles.part)}>{toFixed(values.vega)}</div>
					<div className={cn(styles.green, styles.part)}>{toFixed(values.thetaCall)}</div>
					<div className={cn(styles.green, styles.part)}>{toFixed(values.rhoCall)}</div>
				</fieldset>

				<div
					style={{ paddingTop: '2.1rem' }}
					className='flex-1 text-base font-medium text-gray-700 flex-column'
				>
					<div className={styles.part}>{t('black_scholes_modal.theoretical_price')}</div>
					<div className={cn(styles.gray, styles.part)}>{t('black_scholes_modal.delta')}</div>
					<div className={cn(styles.gray, styles.part)}>{t('black_scholes_modal.gamma')}</div>
					<div className={cn(styles.gray, styles.part)}>{t('black_scholes_modal.vega')}</div>
					<div className={cn(styles.gray, styles.part)}>{t('black_scholes_modal.theta')}</div>
					<div className={cn(styles.gray, styles.part)}>{t('black_scholes_modal.rho')}</div>
				</div>

				<fieldset
					className={cn('border border-error-100 bg-gray-50 text-error-100', styles.section, styles.fieldset)}
				>
					<legend>Put</legend>
					<div className={cn('text-lg', styles.part)}>{toFixed(values.put, 0)}</div>
					<div className={cn(styles.red, styles.part)}>{toFixed(values.deltaPut)}</div>
					<div className={cn(styles.red, styles.part)}>{toFixed(values.gamma, 7)}</div>
					<div className={cn(styles.red, styles.part)}>{toFixed(values.vega)}</div>
					<div className={cn(styles.red, styles.part)}>{toFixed(values.thetaPut)}</div>
					<div className={cn(styles.red, styles.part)}>{toFixed(values.rhoPut)}</div>
				</fieldset>
			</div>

			<div
				style={{ height: '5.4rem', boxShadow: '0px 2px 11px 0px rgba(0, 0, 0, 0.03)' }}
				className='flex rounded bg-white text-base ltr darkBlue:bg-gray-50 dark:bg-gray-50'
			>
				<div className={cn('h-full ltr flex-justify-center', styles.section)}>
					<span className='font-bold text-error-100 ltr'>
						{Number((values.ivPut * 100).toFixed(4) || 0) * 1}%
					</span>
				</div>

				<div className='h-full flex-1 flex-justify-center'>
					<span className='font-medium text-gray-700'>{t('black_scholes_modal.implied_volatility')}</span>
				</div>

				<div className={cn('h-full ltr flex-justify-center', styles.section)}>
					<span className='font-bold text-success-100'>
						{Number((values.ivCall * 100).toFixed(4) || 0) * 1}%
					</span>
				</div>
			</div>
		</>
	);
};

export default Calculator;

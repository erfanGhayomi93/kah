import { useTranslations } from 'next-intl';
import styled from 'styled-components';

interface CalculatorProps extends IBlackScholesModalStates {}

const Section = styled.div<{ $side?: string }>`
	position: relative;
	flex: 0 0 13.2rem;
	border-radius: 0.8rem;

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
	width: 100%;
	display: flex;
	justify-content: center;
	align-items: center;
`;

const Calculator = ({ premium, strikePrice, dueDays, volatility, riskFreeProfit, contractPrice }: CalculatorProps) => {
	const t = useTranslations();

	return (
		<div className='h-full flex-1 justify-between gap-24 rounded-md bg-gray-100 px-24 pb-16 pt-24 flex-column'>
			<div className='flex flex-1'>
				<Section
					$side='Call'
					className='border border-success-100 bg-gray-100 text-base font-bold text-success-100 flex-column'
				>
					<Part className='text-lg'>16637</Part>
					<Part className='bg-success-100/5'>452</Part>
					<Part className='bg-success-100/5'>435</Part>
					<Part className='bg-success-100/5'>123</Part>
					<Part className='bg-success-100/5'>345</Part>
					<Part className='bg-success-100/5'>7567</Part>
				</Section>

				<div className='flex-1 text-base font-medium text-gray-900 flex-column'>
					<Part>{t('black_scholes_modal.theoretical_price')}</Part>
					<Part className='bg-gray-200'>{t('black_scholes_modal.delta')}</Part>
					<Part className='bg-gray-200'>{t('black_scholes_modal.gamma')}</Part>
					<Part className='bg-gray-200'>{t('black_scholes_modal.vega')}</Part>
					<Part className='bg-gray-200'>{t('black_scholes_modal.theta')}</Part>
					<Part className='bg-gray-200'>{t('black_scholes_modal.rho')}</Part>
				</div>

				<Section
					$side='Put'
					className='border border-error-100 bg-gray-100 text-base font-bold text-error-100 flex-column'
				>
					<Part className='text-lg'>43805</Part>
					<Part className='bg-error-100/5'>657</Part>
					<Part className='bg-error-100/5'>567567</Part>
					<Part className='bg-error-100/5'>6547</Part>
					<Part className='bg-error-100/5'>456</Part>
					<Part className='bg-error-100/5'>435</Part>
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

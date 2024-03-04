import { useTranslations } from 'next-intl';
import Input from './Input';

interface FormProps {
	inputs: IBlackScholesModalStates;
	setInputValue: <T extends keyof IBlackScholesModalStates>(field: T, value: IBlackScholesModalStates[T]) => void;
}

const Form = ({ inputs, setInputValue }: FormProps) => {
	const t = useTranslations();

	return (
		<div style={{ flex: '0 0 30rem' }} className='justify-between flex-column'>
			<Input
				value={inputs.sharePrice}
				onChange={(v) => setInputValue('sharePrice', Number(v))}
				placeholder={t('black_scholes_modal.share_price_placeholder')}
				prefix={t('common.rial')}
				maxLength={10}
			/>

			<Input
				value={inputs.strikePrice}
				onChange={(v) => setInputValue('strikePrice', Number(v))}
				placeholder={t.rich('black_scholes_modal.strike_price_placeholder', {
					chunk: (chunk) => <span className='font-medium opacity-70'>{chunk}</span>,
				})}
				prefix={t('common.rial')}
				maxLength={10}
			/>

			<Input
				value={inputs.dueDays}
				onChange={(v) => setInputValue('dueDays', Number(v))}
				placeholder={t('black_scholes_modal.due_days_remaining')}
				prefix={t('black_scholes_modal.day')}
				maxLength={3}
			/>

			<Input
				value={inputs.volatility}
				onChange={(v) => setInputValue('volatility', v)}
				placeholder={t.rich('black_scholes_modal.volatility_placeholder', {
					chunk: (chunk) => <span className='font-medium opacity-70'>{chunk}</span>,
				})}
				prefix='%'
				maxLength={4}
			/>

			<Input
				value={inputs.riskFreeProfit}
				onChange={(v) => setInputValue('riskFreeProfit', v)}
				placeholder={t('black_scholes_modal.risk_free_profit')}
				prefix='%'
				maxLength={4}
			/>

			<Input
				value={inputs.premium}
				onChange={(v) => setInputValue('premium', Number(v))}
				placeholder={t.rich('black_scholes_modal.premium_placeholder', {
					chunk: (chunk) => <span className='font-medium opacity-70'>{chunk}</span>,
				})}
				prefix={t('common.rial')}
				maxLength={10}
			/>
		</div>
	);
};

export default Form;

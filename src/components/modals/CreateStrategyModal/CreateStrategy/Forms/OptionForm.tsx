import Button from '@/components/common/Button';
import InputLegend from '@/components/common/Inputs/InputLegend';
import Tooltip from '@/components/common/Tooltip';
import { QuestionCircleOutlineSVG } from '@/components/icons';
import { useTranslations } from 'next-intl';

interface OptionFormProps {
	budget: number;
	nextStep: () => void;
}

const OptionForm = ({ budget, nextStep }: OptionFormProps) => {
	const t = useTranslations();

	return (
		<form
			onSubmit={(e) => {
				e.preventDefault();
				nextStep();
			}}
			className='flex-1 justify-between gap-16 flex-column'
			method='get'
		>
			<div className='w-full flex-1 gap-16 flex-column'>
				<InputLegend
					type='text'
					disabled
					value={budget}
					placeholder={
						<>
							{t('create_strategy.estimated_budget')}
							<Tooltip placement='top' content='Tooltip'>
								<QuestionCircleOutlineSVG width='1.6rem' height='1.6rem' />
							</Tooltip>
						</>
					}
					prefix={t('common.rial')}
					maxLength={16}
					legendWidth={96}
					autoTranslateLegend
				/>

				<div className='text-tiny text-gray-900 flex-justify-between'>
					<span>{t('create_strategy.sellable_contracts')}:</span>
					<span className='flex gap-4 text-gray-1000'>10 {t('create_strategy.contract')}</span>
				</div>
			</div>

			<Button afterArrow type='submit' className='h-48 rounded text-lg shadow btn-error'>
				{t('side.sell')}
			</Button>
		</form>
	);
};

export default OptionForm;

import Button from '@/components/common/Button';
import InputLegend from '@/components/common/Inputs/InputLegend';
import Tooltip from '@/components/common/Tooltip';
import { InfoCircleSVG, QuestionCircleOutlineSVG } from '@/components/icons';
import { sepNumbers } from '@/utils/helpers';
import { useTranslations } from 'next-intl';

interface OptionFormProps {
	budget: number;
	quantity: number;
	contractSize: number;
	nextStep: () => void;
}

const OptionForm = ({ budget, contractSize, quantity, nextStep }: OptionFormProps) => {
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
					<span className='flex gap-4 text-gray-1000'>
						{sepNumbers(String(quantity)) + ' ' + t('create_strategy.contract')}
					</span>
				</div>

				<div className='justify-center gap-4 text-info flex-items-start'>
					<InfoCircleSVG width='1.6rem' height='1.6rem' className='mt-4' />
					<p className='flex-1 text-center text-tiny leading-8 text-gray-900'>
						{t('create_strategy.option_quantity_description', {
							n: sepNumbers(String(quantity * contractSize)),
						})}
					</p>
				</div>
			</div>

			<Button afterArrow type='submit' className='h-48 rounded text-lg shadow btn-error'>
				{t('side.sell')}
			</Button>
		</form>
	);
};

export default OptionForm;

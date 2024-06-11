import Button from '@/components/common/Button';
import InputLegend from '@/components/common/Inputs/InputLegend';
import Tooltip from '@/components/common/Tooltip';
import { QuestionCircleOutlineSVG } from '@/components/icons';
import { useTranslations } from 'next-intl';

interface StepProps {
	id: number;
	children: React.ReactNode;
}

interface FreezeFormProps {
	budget: number;
	nextStep: () => void;
}

const FreezeForm = ({ budget, nextStep }: FreezeFormProps) => {
	const t = useTranslations();

	return (
		<form
			onSubmit={(e) => {
				e.preventDefault();
				nextStep();
			}}
			className='flex-1 gap-16 flex-column'
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

				<span className='text-base font-medium text-gray-1000'>
					{t('create_strategy.freeze_being_confident')}
				</span>

				<Button type='submit' className='h-48 rounded text-lg shadow btn-primary'>
					{t('create_strategy.freeze')}
				</Button>
			</div>

			<ul className='gap-8 flex-column *:gap-4 *:flex-items-start'>
				<Step id={1}>{t('create_strategy.freeze_hint_1')}</Step>
				<Step id={2}>{t('create_strategy.freeze_hint_2')}</Step>
				<Step id={3}>{t('create_strategy.freeze_hint_3')}</Step>
			</ul>
		</form>
	);
};

const Step = ({ id, children }: StepProps) => (
	<li>
		<span className='mt-4 size-16 select-none rounded-circle border border-gray-500 pt-2 align-middle text-sm text-gray-900 flex-justify-center'>
			{id}
		</span>
		<p className='flex-1 text-justify text-tiny leading-10 text-gray-1000'>{children}</p>
	</li>
);

export default FreezeForm;

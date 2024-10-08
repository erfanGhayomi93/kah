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
	isFreeze: boolean;
	nextStep: () => void;
}

const FreezeForm = ({ budget, isFreeze, nextStep }: FreezeFormProps) => {
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
					classes={{
						prefix: 'w-40',
					}}
				/>

				<span className='text-gray-800 text-base font-medium'>
					{t('create_strategy.freeze_being_confident')}
				</span>

				<Button afterArrow={isFreeze} type='submit' className='h-48 rounded text-lg shadow btn-primary'>
					{t(isFreeze ? 'common.continue' : 'create_strategy.freeze')}
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
		<span className='border-gray-200 text-gray-700 mt-4 size-16 select-none rounded-circle border pt-2 align-middle text-sm flex-justify-center'>
			{id}
		</span>
		<p className='text-gray-800 flex-1 text-justify text-tiny leading-10'>{children}</p>
	</li>
);

export default FreezeForm;

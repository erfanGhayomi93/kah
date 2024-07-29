import { PlusSVG } from '@/components/icons';
import { useTranslations } from 'next-intl';

const AddConditionalAlarm = () => {
	const t = useTranslations('create_strategy');

	return (
		<div className='flex-justify-start'>
			<button type='button' className='text-gray-700 flex h-40 gap-8 font-medium opacity-50 flex-justify-start'>
				<PlusSVG width='2rem' height='2rem' />
				{t('add_conditional_alert')}
			</button>
		</div>
	);
};

export default AddConditionalAlarm;

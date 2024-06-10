import { sepNumbers } from '@/utils/helpers';
import { useTranslations } from 'next-intl';

const StrategyChartDetails = () => {
	const t = useTranslations('create_strategy');

	return (
		<div style={{ flex: '0 0 18.4rem' }} className='flex gap-40 border-y border-gray-500 py-16'>
			<ul
				style={{ flex: '0 0 22rem' }}
				className='justify-between text-gray-900 ltr flex-column *:flex-justify-between'
			>
				<li>
					<span className='font-medium text-success-100'>{t('profit')}</span>
					<span>:{t('current_status')}</span>
				</li>
				<li>
					<span className='font-medium'>{sepNumbers('22509')}</span>
					<span>:{t('bep')}</span>
				</li>
				<li>
					<span className='font-medium'>(-{sepNumbers('2925')})</span>
					<span>:{t('most_loss')}</span>
				</li>
				<li>
					<span className='font-medium text-success-100'>({sepNumbers('2075')})</span>
					<span>:{t('most_profit')}</span>
				</li>
			</ul>
			<div className='flex-1'></div>
		</div>
	);
};

export default StrategyChartDetails;

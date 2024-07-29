import { numFormatter } from '@/utils/helpers';
import { useTranslations } from 'next-intl';

interface QueueValueProps {
	sum: number;
	buyQueueValue: number;
	sellQueueValue: number;
}

const QueueValue = ({ sum, buyQueueValue, sellQueueValue }: QueueValueProps) => {
	const t = useTranslations('saturn_page');

	const buyQueuePercent = ((buyQueueValue / sum) * 100).toFixed(2) || 0;
	const sellQueuePercent = ((sellQueueValue / sum) * 100).toFixed(2) || 0;

	return (
		<div className='flex-1 gap-4 flex-column'>
			<div className='ltr flex-justify-between *:text-tiny'>
				<span className='text-error-100'>{sellQueuePercent}%</span>
				<span className='text-success-100'>{buyQueuePercent}%</span>
			</div>

			<div className='relative flex *:h-4'>
				<div className='bg-success-100' style={{ width: `${buyQueuePercent}%` }} />
				<div
					className='darkBlue:bg-gray-50 absolute top-0 h-4 w-6 bg-white dark:bg-gray-50'
					style={{ transform: 'skew(45deg)', left: `calc(${sellQueuePercent}% - 3px)` }}
				/>
				<div className='bg-error-100' style={{ width: `${sellQueuePercent}%` }} />
			</div>

			<div className='ltr flex-justify-between *:text-tiny'>
				<span className='text-error-100'>{numFormatter(sellQueueValue) + ' ' + t('sell_queue_value')}</span>
				<span className='text-success-100'>{numFormatter(buyQueueValue) + ' ' + t('buy_queue_value')}</span>
			</div>
		</div>
	);
};

export default QueueValue;

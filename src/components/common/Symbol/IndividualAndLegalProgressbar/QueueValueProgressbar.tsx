import { divide, numFormatter } from '@/utils/helpers';
import { useTranslations } from 'next-intl';

interface QueueValueProgressbarProps {
	sum: number;
	buyQueueValue: number;
	sellQueueValue: number;
}

const QueueValueProgressbar = ({ sum, buyQueueValue, sellQueueValue }: QueueValueProgressbarProps) => {
	const t = useTranslations('saturn_page');

	const buyQueuePercent = (divide(buyQueueValue, sum) * 100).toFixed(2) || 0;
	const sellQueuePercent = (divide(sellQueueValue, sum) * 100).toFixed(2) || 0;

	return (
		<div className='flex-1 gap-4 flex-column'>
			<div className='ltr flex-justify-between *:text-tiny'>
				<span className='text-error-100'>{sellQueuePercent}%</span>
				<span className='text-success-100'>{buyQueuePercent}%</span>
			</div>

			<div className='relative flex *:h-4'>
				<div className='bg-success-100' style={{ width: `${buyQueuePercent}%` }} />
				<div
					className='absolute top-0 w-6 bg-white darkness:bg-gray-50'
					style={{ transform: 'skew(45deg)', left: `calc(${sum === 0 ? 50 : sellQueuePercent}% - 3px)` }}
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

export default QueueValueProgressbar;

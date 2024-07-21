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
				<span className='text-light-error-100'>{sellQueuePercent}%</span>
				<span className='text-light-success-100'>{buyQueuePercent}%</span>
			</div>

			<div className='relative flex *:h-4'>
				<div className='bg-light-success-100' style={{ width: `${buyQueuePercent}%` }} />
				<div
					className='absolute top-0 h-4 w-6 bg-white'
					style={{ transform: 'skew(45deg)', left: `calc(${sellQueuePercent}% - 3px)` }}
				/>
				<div className='bg-light-error-100' style={{ width: `${sellQueuePercent}%` }} />
			</div>

			<div className='ltr flex-justify-between *:text-tiny'>
				<span className='text-light-error-100'>
					{numFormatter(sellQueueValue) + ' ' + t('sell_queue_value')}
				</span>
				<span className='text-light-success-100'>
					{numFormatter(buyQueueValue) + ' ' + t('buy_queue_value')}
				</span>
			</div>
		</div>
	);
};

export default QueueValue;

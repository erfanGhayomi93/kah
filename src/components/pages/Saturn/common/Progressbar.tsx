import { divide } from '@/utils/helpers';
import { useTranslations } from 'next-intl';

interface ProgressbarProps {
	side: 'buy' | 'sell';
	legalVolume: number;
	individualVolume: number;
}

const Progressbar = ({ side, individualVolume, legalVolume }: ProgressbarProps) => {
	const t = useTranslations();

	const bgColor = side === 'buy' ? 'bg-success-100' : 'bg-error-100';
	const bgAlphaColor = side === 'buy' ? 'bg-success-100/10' : 'bg-error-100/10';

	const percent = divide(individualVolume, individualVolume + legalVolume) * 100;

	return (
		<div className='flex-1 gap-4 flex-column'>
			<div className='gap-16 flex-justify-between'>
				<div className='flex-1 gap-4 px-4 flex-justify-start'>
					<span style={{ width: '6px', height: '6px' }} className={`rounded-circle ${bgColor}`} />
					<span className='text-base text-gray-1000'>
						{t('saturn_page.individual')}
						<span className='text-tiny ltr'> {percent.toFixed(2)}%</span>
					</span>
				</div>

				<div className='flex-1 gap-4 px-4 flex-justify-end'>
					<span style={{ width: '6px', height: '6px' }} className={`rounded-circle ${bgAlphaColor}`} />
					<span className='text-base text-gray-1000'>
						{t('saturn_page.legal')}
						<span className='text-tiny ltr'> {(100 - percent).toFixed(2)}%</span>
					</span>
				</div>
			</div>

			<div className={`min-h-8 flex-1 overflow-hidden rounded-oval rtl ${bgAlphaColor}`}>
				<div style={{ width: `${percent}%` }} className={`min-h-8 transition-width ${bgColor}`} />
			</div>
		</div>
	);
};

export default Progressbar;

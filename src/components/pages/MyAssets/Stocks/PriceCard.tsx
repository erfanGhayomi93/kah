import { getColorBasedOnPercent, sepNumbers } from '@/utils/helpers';
import { useTranslations } from 'next-intl';

interface PriceCardProps {
	percent?: number;
	value: number;
	title: string;
}

const PriceCard = ({ value, title, percent }: PriceCardProps) => {
	const t = useTranslations('common');

	return (
		<div className='h-64 w-1/4 rounded px-8 shadow-card flex-justify-between'>
			<span className='text-base text-light-gray-700'>{title}:</span>
			<div className='flex gap-8 text-base'>
				{percent !== undefined && (
					<span className={getColorBasedOnPercent(percent)}>({percent.toFixed(2)}%)</span>
				)}
				<span className='text-light-gray-700'>
					<span className='font-medium text-light-gray-800'>{sepNumbers(String(value))} </span>
					{t('rial')}
				</span>
			</div>
		</div>
	);
};

export default PriceCard;
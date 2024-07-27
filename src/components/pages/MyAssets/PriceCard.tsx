import { getColorBasedOnPercent, sepNumbers } from '@/utils/helpers';
import clsx from 'clsx';
import { useTranslations } from 'next-intl';

interface PriceCardProps {
	className?: ClassesValue;
	percent?: number;
	value: number;
	title: string;
	loading?: boolean;
}

const PriceCard = ({ value, title, percent, className, loading }: PriceCardProps) => {
	const t = useTranslations('common');

	if (loading) return <div className={clsx('h-64 rounded skeleton', className)} />;

	return (
		<div className={clsx('h-64 rounded px-8 shadow-card flex-justify-between', className)}>
			<span className='text-base text-light-gray-700'>{title}:</span>
			<div className='flex gap-8 text-base'>
				{percent !== undefined && (
					<span className={getColorBasedOnPercent(percent)}>({percent.toFixed(2)}%)</span>
				)}

				<div className='gap-4 text-light-gray-700 flex-items-center'>
					<span className='font-medium text-light-gray-800 ltr'>{sepNumbers(String(value))}</span>
					{t('rial')}
				</div>
			</div>
		</div>
	);
};

export default PriceCard;

import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import Badge from './Badge';

interface FreezeStepProps {
	status: CreateStrategy.Status;
	className: string;
}

const FreezeStep = ({ status, className }: FreezeStepProps) => {
	const t = useTranslations();

	return (
		<li className={className}>
			<h2 className={clsx(status === 'TODO' ? 'text-light-gray-800 font-medium' : 'text-light-gray-700')}>
				{t('create_strategy.freeze')}
			</h2>

			<div className='flex-justify-between'>
				<Badge type={status} />
			</div>
		</li>
	);
};

export default FreezeStep;

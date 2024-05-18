import clsx from 'clsx';
import { useTranslations } from 'next-intl';

interface BadgeProps {
	type: CreateStrategy.Status;
}

const Badge = ({ type }: BadgeProps) => {
	const t = useTranslations('create_strategy');
	return (
		<span
			className={clsx('h-28 cursor-default select-none rounded px-12 text-tiny', {
				'no-hover !border-0 font-medium btn-select': type === 'TODO',
				'btn-disabled': type === 'PENDING',
				'btn-success': type === 'DONE',
				'btn-error': type === 'ERROR',
			})}
		>
			{t(`status_${type}`)}
		</span>
	);
};

export default Badge;

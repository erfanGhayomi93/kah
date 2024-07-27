import clsx from 'clsx';
import { memo } from 'react';

interface StrategyTagProps {
	id: Strategy.Cheap | string;
	title: string;
	i: number;
}

const StrategyTag = ({ id, title, i }: StrategyTagProps) => {
	return (
		<li
			className={clsx(
				'h-32 w-96 cursor-default rounded-oval !border border-current text-tiny flex-justify-center',
				i === 0
					? [
							'font-medium',
							id === 'HighRisk' && 'border-error-100 bg-error-100 text-white',
							id === 'LowRisk' && 'border-success-200 bg-success-200 text-gray-800',
							id === 'ModerateRisk' && 'border-warning-100 bg-warning-100 text-gray-800',
							id === 'NoRisk' && 'border-success-100 bg-success-100 text-white',
						]
					: 'border-gray-200 text-gray-700',
			)}
		>
			{title}
		</li>
	);
};

export default memo(StrategyTag, (prev, next) => prev.id === next.id);

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
							id === 'HighRisk' && 'border-light-error-100 bg-light-error-100 text-white',
							id === 'LowRisk' && 'border-light-success-200 bg-light-success-200 text-light-gray-800',
							id === 'ModerateRisk' &&
								'border-light-warning-100 bg-light-warning-100 text-light-gray-800',
							id === 'NoRisk' && 'border-light-success-100 bg-light-success-100 text-white',
						]
					: 'border-light-gray-200 text-light-gray-700',
			)}
		>
			{title}
		</li>
	);
};

export default memo(StrategyTag, (prev, next) => prev.id === next.id);

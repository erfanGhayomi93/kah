import clsx from 'clsx';

interface StrategyTagProps {
	id: Strategy.Cheap | string;
	title: string;
	i: number;
}

export const StrategyTag = ({ id, title, i }: StrategyTagProps) => {
	return (
		<li
			className={clsx(
				'h-32 w-96 cursor-default rounded-oval !border border-current text-tiny flex-justify-center',
				i === 0
					? [
							'font-medium',
							id === 'HighRisk' && 'border-error-100 bg-error-100 text-white',
							id === 'LowRisk' && 'border-success-300 bg-success-300 text-gray-1000',
							id === 'ModerateRisk' && 'border-warning-100 bg-warning-100 text-gray-1000',
							id === 'NoRisk' && 'border-success-100 bg-success-100 text-white',
						]
					: 'border-gray-500 text-gray-800',
			)}
		>
			{title}
		</li>
	);
};

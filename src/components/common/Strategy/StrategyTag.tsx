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
				i === 0 && id === 'HighRisk' && 'font-medium btn-error',
				i === 0 && id === 'LowRisk' && 'font-medium btn-success',
				i === 0 && id === 'ModerateRisk' && 'font-medium btn-warning',
				i === 1 && 'border-success-100 text-success-100',
				i === 2 && 'border-error-100 text-error-100',
				i === 3 && 'border-info text-info',
			)}
		>
			{title}
		</li>
	);
};

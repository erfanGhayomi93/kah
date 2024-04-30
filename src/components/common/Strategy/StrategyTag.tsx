import clsx from 'clsx';

interface StrategyTagProps {
	id: Strategy.Cheap | string;
	title: string;
	i: number;
}

export const StrategyTag = ({ id, title, i }: StrategyTagProps) => {
	return (
		<li>
			<button
				type='button'
				className={clsx(
					'h-32 w-96 rounded-oval !border border-current text-tiny flex-justify-center',
					i === 0 && id === 'HighRisk' && 'font-medium btn-error',
					i === 0 && id === 'LowRisk' && 'font-medium btn-success',
					i === 0 && id === 'ModerateRisk' && 'btn-warning font-medium',
					i === 1 && 'btn-success-outline',
					i === 2 && 'btn-error-outline',
					i === 3 && 'btn-info-outline',
				)}
			>
				{title}
			</button>
		</li>
	);
};

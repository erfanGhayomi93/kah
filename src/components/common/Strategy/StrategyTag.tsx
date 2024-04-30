import { StrategyCheapColor } from '@/constants/enums';
import clsx from 'clsx';

interface StrategyTagProps {
	id: Strategy.Cheap;
	title: string;
	i: number;
}

export const StrategyTag = ({ id, title, i }: StrategyTagProps) => {
	return (
		<li>
			<button
				type='button'
				className={clsx(
					'h-32 w-96 rounded-oval border border-current text-tiny flex-justify-center',
					i !== 0 && `border-current text-${StrategyCheapColor[id]}`,
					i === 0 && `font-medium bg-${StrategyCheapColor[id]}`,
					{
						'border-current text-white': i === 0 && id !== 'ModerateRisk',
						'border-warning-100 bg-warning-100 text-gray-1000': i === 0 && id === 'ModerateRisk',
					},
				)}
			>
				{title}
			</button>
		</li>
	);
};

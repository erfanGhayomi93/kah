import { StrategyCheapColor } from '@/constants/enums';
import clsx from 'clsx';
import { useTranslations } from 'next-intl';

interface StrategyTagProps {
	tag: Strategy.Cheap;
	i: number;
}

export const StrategyTag = ({ tag, i }: StrategyTagProps) => {
	const t = useTranslations();

	return (
		<li>
			<button
				type='button'
				className={clsx(
					'h-32 w-96 rounded-oval border border-current text-tiny flex-justify-center',
					i !== 0 && `border-current text-${StrategyCheapColor[tag]}`,
					i === 0 && `font-medium bg-${StrategyCheapColor[tag]}`,
					{
						'border-current text-white': i === 0 && tag !== 'ModerateRisk',
						'border-warning-100 bg-warning-100 text-gray-1000': i === 0 && tag === 'ModerateRisk',
					},
				)}
			>
				{t(`strategy_cheaps.${tag}`)}
			</button>
		</li>
	);
};

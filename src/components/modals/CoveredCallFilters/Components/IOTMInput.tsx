import { ChartDownSVG, ChartUpSVG } from '@/components/icons';
import clsx from 'clsx';
import { useTranslations } from 'next-intl';

interface IOTMInputProps {
	value: ICoveredCallFiltersModalStates['iotm'];
	onClick: (v: Option.IOTM) => void;
}

const IOTMInput = ({ value, onClick }: IOTMInputProps) => {
	const t = useTranslations('strategy_filters');

	const includes = (v: Option.IOTM) => {
		return value.includes(v);
	};

	return (
		<div className='flex h-40 gap-8 *:h-full *:flex-1 *:rounded *:!border *:font-medium'>
			<button
				type='button'
				onClick={() => onClick('ATM')}
				className={clsx('flex-1 !border', includes('ATM') ? 'btn-secondary' : 'btn-secondary-outline')}
			>
				<span className='h-2 w-20 rounded bg-current' />
				{t('atm')}
			</button>
			<button
				type='button'
				onClick={() => onClick('OTM')}
				className={clsx('flex-1 !border', includes('OTM') ? 'btn-error' : 'btn-error-outline')}
			>
				<ChartDownSVG />
				{t('otm')}
			</button>
			<button
				type='button'
				onClick={() => onClick('ITM')}
				className={clsx('flex-1 !border', includes('ITM') ? 'btn-success' : 'btn-success-outline')}
			>
				<ChartUpSVG />
				{t('itm')}
			</button>
		</div>
	);
};

export default IOTMInput;

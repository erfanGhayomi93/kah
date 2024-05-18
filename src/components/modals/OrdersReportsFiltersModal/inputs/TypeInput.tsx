import { cn } from '@/utils/helpers';
import { useTranslations } from 'next-intl';

interface TypeInputProps {
	value: IOptionWatchlistFilters['type'];
	onChange: (value: IOptionWatchlistFilters['type']) => void;
}

const TypeInput = ({ value, onChange }: TypeInputProps) => {
	const t = useTranslations();

	const onChangeValue = (v: 'Call' | 'Put') => {
		if (value.includes(v)) onChange(value.filter((val) => val !== v));
		else onChange([...value, v]);
	};

	const isSell = value.includes('Put');

	const isBuy = value.includes('Call');

	return (
		<div className='flex-1 gap-8 flex-justify-end *:h-40 *:flex-1 *:rounded *:font-medium'>
			<button
				type='button'
				onClick={() => onChangeValue('Call')}
				className={cn(isBuy ? 'btn-primary' : 'btn-choose-outline')}
			>
				{t('side.buy')}
			</button>
			<button
				type='button'
				onClick={() => onChangeValue('Put')}
				className={cn(isSell ? 'btn-primary' : 'btn-choose-outline')}
			>
				{t('side.sell')}
			</button>
		</div>
	);
};

export default TypeInput;

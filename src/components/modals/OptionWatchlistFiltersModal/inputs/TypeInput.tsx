import clsx from 'clsx';
import { useTranslations } from 'next-intl';

interface TypeInputProps {
	value: IOptionWatchlistFilters['type'];
	onChange: (value: IOptionWatchlistFilters['type']) => void;
}

const TypeInput = ({ value, onChange }: TypeInputProps) => {
	const t = useTranslations();

	const onChangeValue = (v: 'buy' | 'sell') => {
		if (value.includes(v)) onChange(value.filter((val) => val !== v));
		else onChange([...value, v]);
	};

	const isSell = value.includes('sell');

	const isBuy = value.includes('buy');

	return (
		<div className='flex-1 gap-8 flex-justify-end *:h-40 *:flex-1 *:rounded *:font-medium'>
			<button onClick={() => onChangeValue('buy')} className={clsx(isBuy ? 'btn-choose' : 'btn-choose-outline')}>
				{t('side.buy')}
			</button>
			<button onClick={() => onChangeValue('sell')} className={clsx(isSell ? 'btn-choose' : 'btn-choose-outline')}>
				{t('side.sell')}
			</button>
		</div>
	);
};

export default TypeInput;

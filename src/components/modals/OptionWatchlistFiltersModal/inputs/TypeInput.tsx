import clsx from 'clsx';
import { useTranslations } from 'next-intl';

interface TypeInputProps {
	value: IOptionWatchlistFilters['type'];
	onChange: (value: IOptionWatchlistFilters['type']) => void;
}

const TypeInput = ({ value, onChange }: TypeInputProps) => {
	const t = useTranslations();

	return (
		<div className='flex-1 gap-8 flex-justify-end *:h-40 *:flex-1 *:rounded *:font-medium'>
			<button
				onClick={() => onChange(value === 'buy' ? null : 'buy')}
				className={clsx(value === 'buy' ? 'btn-primary' : 'btn-primary-outline')}
			>
				{t('side.buy')}
			</button>
			<button
				onClick={() => onChange(value === 'sell' ? null : 'sell')}
				className={clsx(value === 'sell' ? 'btn-primary' : 'btn-primary-outline')}
			>
				{t('side.sell')}
			</button>
		</div>
	);
};

export default TypeInput;

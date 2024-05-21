import clsx from 'clsx';
import { useTranslations } from 'next-intl';

interface SideInputProps {
	value: ICoveredCallFiltersModalStates['side'];
	onClick: (v: TBsSides) => void;
}

const SideInput = ({ value, onClick }: SideInputProps) => {
	const t = useTranslations('side');

	const includes = (v: TBsSides) => {
		return value.includes(v);
	};

	return (
		<div className='flex h-40 gap-8 *:h-full *:flex-1 *:rounded *:!border *:font-medium'>
			<button
				type='button'
				className={clsx(includes('buy') ? 'btn-primary' : 'btn-primary-outline')}
				onClick={() => onClick('buy')}
			>
				{t('buy')}
			</button>
			<button
				type='button'
				className={clsx(includes('sell') ? 'btn-primary' : 'btn-primary-outline')}
				onClick={() => onClick('sell')}
			>
				{t('sell')}
			</button>
		</div>
	);
};

export default SideInput;

import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { SearchSVG } from '../icons';
import Portal from './Portal';
import styles from './SymbolSearch.module.scss';

type ValueType = Option.SymbolSearch | null;

type InputProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange'>;

interface SymbolSearchProps extends InputProps {
	value: ValueType;
	classes?: RecordClasses<'root' | 'input' | 'search' | 'list'>;
	onChange: (symbol: ValueType) => void;
}

const SymbolSearch = ({ value, classes, onChange, ...inputProps }: SymbolSearchProps) => {
	const t = useTranslations();

	const [term, setTerm] = useState('');

	const [focus, setFocus] = useState(false);

	const onFocus = (cb: () => void) => {
		setFocus(true);
		cb();
	};

	const onBlur = () => {
		setFocus(false);
	};

	return (
		<Portal
			zIndex={9999}
			renderer={({ setOpen }) => (
				<ul className={clsx(styles.list, classes?.list)}>
					<h1>Hello</h1>
				</ul>
			)}
			onClose={onBlur}
		>
			{({ setOpen, open }) => (
				<label className={clsx('input-group', styles.root, classes?.root)}>
					<div className={clsx(styles.search, classes?.search)}>
						<SearchSVG />
					</div>

					<input
						type='text'
						inputMode='search'
						className={clsx(styles.input, classes?.input)}
						maxLength={24}
						placeholder={t('symbol_search.input_placeholder')}
						onFocus={() => onFocus(() => setOpen(true))}
						{...inputProps}
					/>
				</label>
			)}
		</Portal>
	);
};

export default SymbolSearch;

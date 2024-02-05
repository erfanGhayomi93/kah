import { useSymbolSearchQuery } from '@/api/queries/symbolQuery';
import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { SearchSVG } from '../icons';
import Popup from './Popup';
import styles from './SymbolSearch.module.scss';

type ValueType = Symbol.Search | null;

type InputProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange'>;

interface SymbolSearchProps extends InputProps {
	value: ValueType;
	classes?: RecordClasses<'root' | 'input' | 'search' | 'list' | 'blankList' | 'item'>;
	onChange: (symbol: ValueType) => void;
}

const SymbolSearch = ({ value, classes, onChange, ...inputProps }: SymbolSearchProps) => {
	const t = useTranslations();

	const [term, setTerm] = useState('');

	const { data: symbolsData, isFetching } = useSymbolSearchQuery({
		queryKey: ['symbolSearchQuery', term.length < 2 ? null : term],
	});

	const onSelect = (symbol: ValueType) => {
		onChange(symbol);
	};

	const onFocus = (cb: () => void) => {
		cb();
	};

	const onBlur = () => {
		setTerm('');
	};

	return (
		<Popup
			margin={{
				y: 4,
			}}
			zIndex={9999}
			onClose={onBlur}
			renderer={({ setOpen }) => {
				if (term.length < 2)
					return (
						<div className={clsx(styles.blankList, classes?.blankList)}>
							<span>{t('symbol_search.needs_more_than_n_chars', { n: 2 })}</span>
						</div>
					);

				if (isFetching)
					return (
						<div className={clsx(styles.blankList, classes?.blankList)}>
							<span>{t('common.searching')}</span>
						</div>
					);

				if (!Array.isArray(symbolsData) || symbolsData.length === 0)
					return (
						<div className={clsx(styles.blankList, classes?.blankList)}>
							<span>{t('symbol_search.no_symbol_found')}</span>
						</div>
					);

				return (
					<div className={clsx(styles.list, classes?.list)}>
						<ul>
							{symbolsData.map((symbol) => (
								<li
									onMouseUp={() => setOpen(false)}
									onMouseDown={() => onSelect(symbol)}
									key={symbol.symbolISIN}
									className={clsx(styles.item, classes?.item)}
								>
									{symbol.symbolTitle}
								</li>
							))}
						</ul>
					</div>
				);
			}}
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
						value={term}
						onChange={(e) => setTerm(e.target.value)}
					/>
				</label>
			)}
		</Popup>
	);
};

export default SymbolSearch;

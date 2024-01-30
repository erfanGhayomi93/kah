import { useOptionSymbolSearchQuery } from '@/api/queries/optionQueries';
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
	classes?: RecordClasses<'root' | 'input' | 'search' | 'list' | 'blankList' | 'item'>;
	onChange: (symbol: ValueType) => void;
}

const SymbolSearch = ({ value, classes, onChange, ...inputProps }: SymbolSearchProps) => {
	const t = useTranslations();

	const [term, setTerm] = useState('');

	const [focus, setFocus] = useState(false);

	const { data: symbolsData, isFetching } = useOptionSymbolSearchQuery({
		queryKey: ['optionSymbolSearchQuery', { term: term.length < 2 ? null : term, orderBy: 'Alphabet' }],
	});

	const onSelect = (symbol: ValueType) => {
		onChange(symbol);
	};

	const onFocus = (cb: () => void) => {
		setFocus(true);
		cb();
	};

	const onBlur = () => {
		setFocus(false);
	};

	return (
		<Portal
			margin={{
				y: 4,
			}}
			zIndex={9999}
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
					<ul className={clsx(styles.list, classes?.list)}>
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
				);
			}}
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
						value={term}
						onChange={(e) => setTerm(e.target.value)}
					/>
				</label>
			)}
		</Portal>
	);
};

export default SymbolSearch;

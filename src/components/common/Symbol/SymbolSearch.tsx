import { useSymbolSearchQuery } from '@/api/queries/symbolQuery';
import { cn } from '@/utils/helpers';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { SearchSVG } from '../../icons';
import Popup from '../Popup';
import styles from './SymbolSearch.module.scss';

type TSymbolType = Symbol.Search | null;

type InputProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange'>;

interface SymbolSearchProps extends InputProps {
	value: TSymbolType;
	classes?: RecordClasses<'root' | 'input' | 'search' | 'list' | 'blankList' | 'item'>;
	onChange: (symbol: TSymbolType) => void;
}

const SymbolSearch = ({ value, classes, placeholder, onChange, ...inputProps }: SymbolSearchProps) => {
	const t = useTranslations();

	const [term, setTerm] = useState('');

	const { data: symbolsData, isFetching } = useSymbolSearchQuery({
		queryKey: ['symbolSearchQuery', term.length < 2 ? null : term],
	});

	const onSelect = (symbol: TSymbolType) => {
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
				if (term.length < 2) return null;

				if (isFetching)
					return (
						<div className={cn(styles.blankList, classes?.blankList)}>
							<span>{t('common.searching')}</span>
						</div>
					);

				if (!Array.isArray(symbolsData) || symbolsData.length === 0)
					return (
						<div className={cn(styles.blankList, classes?.blankList)}>
							<span>{t('common.symbol_not_found')}</span>
						</div>
					);

				return (
					<div className={cn(styles.list, classes?.list)}>
						<ul>
							{symbolsData.map((symbol) => (
								<li
									onMouseUp={() => setOpen(false)}
									onMouseDown={() => onSelect(symbol)}
									key={symbol.symbolISIN}
									className={cn(styles.item, classes?.item)}
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
				<label className={cn('input-group', styles.root, classes?.root)}>
					<div className={cn(styles.search, classes?.search)}>
						<SearchSVG />
					</div>

					<input
						type='text'
						inputMode='search'
						className={cn(styles.input, classes?.input)}
						maxLength={24}
						onFocus={() => onFocus(() => setOpen(true))}
						{...inputProps}
						value={open ? term : value ? value.symbolTitle : term}
						onChange={(e) => setTerm(e.target.value)}
					/>

					<span
						style={{ right: '3.6rem' }}
						className={cn('flexible-placeholder', value && 'active', open && 'colorful')}
					>
						{placeholder ?? t('symbol_search.input_placeholder')}
					</span>

					<fieldset className={cn('flexible-fieldset', value && 'active')}>
						<legend>{placeholder ?? t('symbol_search.input_placeholder')}</legend>
					</fieldset>
				</label>
			)}
		</Popup>
	);
};

export default SymbolSearch;

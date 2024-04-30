import { useSymbolSearchQuery } from '@/api/queries/symbolQuery';
import { cn } from '@/utils/helpers';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { SearchSVG, XCircleSVG } from '../../icons';
import Popup from '../Popup';
import styles from './SymbolSearch.module.scss';

type InputProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange'>;

interface IClearableProps {
	clearable: true;
	value: Symbol.Search | null;
	onClear?: () => void;
	onChange: (option: Symbol.Search | null) => void;
}

interface INonClearableProps {
	clearable?: false;
	value: Symbol.Search | null;
	onChange: (option: Symbol.Search) => void;
	readonly onClear: () => void;
}

type SymbolSearchProps = InputProps &
	(IClearableProps | INonClearableProps) & {
		classes?: RecordClasses<'root' | 'input' | 'search' | 'list' | 'blankList' | 'item' | 'clear'>;
	};

const SymbolSearch = ({
	clearable,
	value,
	classes,
	placeholder,
	onChange,
	onClear,
	...inputProps
}: SymbolSearchProps) => {
	const t = useTranslations();

	const [term, setTerm] = useState('');

	const { data: symbolsData, isFetching } = useSymbolSearchQuery({
		queryKey: ['symbolSearchQuery', term.length < 2 ? null : term],
	});

	const onSelect = (symbol: Symbol.Search) => {
		onChange(symbol);
	};

	const onFocus = (cb: () => void) => {
		cb();
	};

	const onBlur = () => {
		setTerm('');
	};

	const onClearInput = () => {
		if (!clearable) return;

		try {
			onChange(null);
			setTerm('');
			onClear?.();
		} catch (e) {
			//
		}
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

					{clearable && (
						<button onClick={onClearInput} type='button' className={cn(styles.clear, classes?.clear)}>
							<XCircleSVG width='1.6rem' height='1.6rem' />
						</button>
					)}

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

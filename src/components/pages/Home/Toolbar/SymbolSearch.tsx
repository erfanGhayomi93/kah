import { SearchSVG, XSVG } from '@/components/icons';
import { useTranslations } from 'next-intl';
import { useRef, useState } from 'react';

const SymbolSearch = () => {
	const t = useTranslations();

	const inputRef = useRef<HTMLInputElement>(null);

	const [term, setTerm] = useState('');

	const onClearTerm = () => {
		setTerm('');
		if (inputRef.current) inputRef.current.focus();
	};

	return (
		<div style={{ maxWidth: '40rem' }} className='input-group h-40 flex-1 rounded border border-gray-400 flex-items-center'>
			<span className='px-8 text-gray-100'>
				<SearchSVG />
			</span>
			<input
				ref={inputRef}
				type='text'
				inputMode='numeric'
				maxLength={32}
				className='h-40 flex-1 rounded bg-transparent pl-8 text-gray-100'
				placeholder={t('option_watchlist_filters_modal.base_symbol_placeholder')}
				value={term}
				onChange={(e) => setTerm(e.target.value)}
			/>

			{term.length > 1 && (
				<button
					onClick={onClearTerm}
					type='button'
					className='ml-16 min-h-20 min-w-20 rounded-circle bg-gray-100 text-white flex-justify-center'
				>
					<XSVG width='0.8rem' height='0.8rem' />
				</button>
			)}
		</div>
	);
};

export default SymbolSearch;

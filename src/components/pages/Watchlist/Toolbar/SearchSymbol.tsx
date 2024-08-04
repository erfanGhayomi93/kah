import KeyDown from '@/components/common/KeyDown';
import { SearchSVG, XCircleSVG } from '@/components/icons';
import { useDebounce } from '@/hooks';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';

interface SearchSymbolProps {
	setTerm: (v: string) => void;
}

const SearchSymbol = ({ setTerm }: SearchSymbolProps) => {
	const t = useTranslations();

	const { setDebounce, clearDebounce } = useDebounce();

	const [search, setSearch] = useState('');

	const [isExpand, setIsExpand] = useState(false);

	useEffect(() => {
		clearDebounce();

		setTerm('');
		setSearch('');
	}, [isExpand]);

	useEffect(() => {
		setDebounce(() => setTerm(search), 200);
	}, [search]);

	return (
		<KeyDown enabled={isExpand} keys={['Escape']} onKeyDown={() => setIsExpand(false)}>
			<div
				style={{ width: isExpand ? '30rem' : '4rem' }}
				className='h-40 rounded border border-gray-200 bg-white pl-8 transition-width flex-justify-between darkBlue:bg-gray-50 dark:bg-gray-50'
			>
				<button
					onClick={() => setIsExpand(!isExpand)}
					type='button'
					className='h-40 min-w-40 text-gray-700 flex-justify-center'
				>
					<SearchSVG width='2.4rem' height='2.4rem' strokeWidth='4rem' />
				</button>

				{isExpand && (
					<div className='flex-1 overflow-hidden flex-justify-start'>
						<input
							autoFocus
							type='text'
							value={search}
							onChange={(e) => setSearch(e.target.value)}
							className='flex-1 border-0 bg-transparent text-right text-tiny'
							placeholder={t('header.search_symbol_placeholder')}
						/>
						<button
							onClick={() => setIsExpand(false)}
							type='button'
							className='size-24 rounded-circle text-gray-700 flex-justify-center'
						>
							<XCircleSVG width='1.6rem' height='1.6rem' />
						</button>
					</div>
				)}
			</div>
		</KeyDown>
	);
};

export default SearchSymbol;

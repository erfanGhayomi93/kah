import clsx from 'clsx';
import { useTranslations } from 'next-intl';

interface SymbolListProps {
	isFetching: boolean;
	data: Option.BaseSearch[];
	selectedSymbolsLength: number;
	addSymbol: (symbol: Option.BaseSearch) => void;
	isSymbolSelected: (symbolISIN: string) => boolean;
}

interface SymbolItemProps extends Option.BaseSearch {
	isActive: boolean;
	onClick: () => void;
}

const SymbolList = ({ data, isFetching, selectedSymbolsLength, isSymbolSelected, addSymbol }: SymbolListProps) => {
	const t = useTranslations('option_watchlist_filters_modal');

	if (isFetching) {
		return <span className='text-gray-700 absolute text-base font-medium center'>{t('loading')}</span>;
	}

	if (data.length === 0) {
		return <span className='text-gray-700 absolute text-base font-medium center'>{t('symbol_not_found')}</span>;
	}

	return (
		<ul
			className={clsx(
				'w-full overflow-auto pt-16 flex-column *:flex-48 *:flex-justify-start',
				!selectedSymbolsLength ? 'pt-8' : 'pt-16',
			)}
		>
			{data.map((item) => (
				<SymbolItem
					key={item.symbolISIN}
					{...item}
					isActive={isSymbolSelected(item.symbolISIN)}
					onClick={() => addSymbol(item)}
				/>
			))}
		</ul>
	);
};

const SymbolItem = ({ symbolTitle, isActive, onClick }: SymbolItemProps) => (
	<li
		onClick={onClick}
		className={clsx(
			'cursor-pointer pr-16 text-right transition-colors',
			isActive ? 'bg-secondary-200' : 'bg-transparent hover:btn-hover',
		)}
	>
		<span className={clsx('text-base', isActive ? 'text-primary-100' : 'text-gray-700')}>{symbolTitle}</span>
	</li>
);

export default SymbolList;

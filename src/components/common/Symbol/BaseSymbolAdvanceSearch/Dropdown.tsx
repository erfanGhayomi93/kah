import { useTranslations } from 'next-intl';
import SymbolList from './SymbolList';
import TagList from './TagList';

interface DropdownProps {
	tagOnly: boolean;
	isFetching: boolean;
	data: Option.BaseSearch[];
	selectedSymbols: Option.BaseSearch[];
	close: () => void;
	addSymbol: (symbol: Option.BaseSearch) => void;
	removeSymbol: (symbolISIN: string) => void;
	isSymbolSelected: (symbolISIN: string) => boolean;
	removeAllSymbols: () => void;
}

const Dropdown = ({
	data,
	isFetching,
	tagOnly,
	selectedSymbols,
	close,
	addSymbol,
	removeSymbol,
	isSymbolSelected,
	removeAllSymbols,
}: DropdownProps) => {
	const t = useTranslations('common');

	const maxHeight = `calc(${(632 / window.innerHeight) * 100}vh - 16.5rem)`;

	return (
		<div
			style={{
				height: tagOnly ? undefined : maxHeight,
				maxHeight,
			}}
			className='darkBlue:bg-gray-50 relative flex-col overflow-auto rounded bg-white shadow-card transition-height flex-justify-between dark:bg-gray-50'
		>
			<TagList data={selectedSymbols} tagOnly={tagOnly} removeSymbol={removeSymbol} clear={removeAllSymbols} />

			{!tagOnly && (
				<SymbolList
					selectedSymbolsLength={selectedSymbols.length}
					data={data}
					isFetching={isFetching}
					addSymbol={addSymbol}
					isSymbolSelected={isSymbolSelected}
				/>
			)}

			<div className='darkBlue:bg-gray-50 w-full bg-white p-16 flex-justify-end dark:bg-gray-50'>
				<button onClick={close} style={{ width: '31.2rem' }} type='button' className='h-40 rounded btn-primary'>
					{t('close')}
				</button>
			</div>
		</div>
	);
};

export default Dropdown;

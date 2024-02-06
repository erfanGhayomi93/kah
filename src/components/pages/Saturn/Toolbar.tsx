import SymbolSearch from '@/components/common/SymbolSearch';
import { BookmarkSVG } from '@/components/icons';
import { useAppDispatch } from '@/features/hooks';
import { toggleSaveSaturnTemplate } from '@/features/slices/modalSlice';
import { toggleSavedSaturnTemplates } from '@/features/slices/uiSlice';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

interface ToolbarProps {
	baseSymbolInfo: Symbol.Info;
	baseSymbolContracts: TSaturnBaseSymbolContracts;
	setSymbol: (symbol: Symbol.Search | null) => void;
}

const Toolbar = ({ baseSymbolInfo, baseSymbolContracts, setSymbol }: ToolbarProps) => {
	const t = useTranslations();

	const dispatch = useAppDispatch();

	const [symbol] = useState<Symbol.Search | null>(null);

	const onChangeSymbol = (value: Symbol.Search | null) => {
		if (!value) return;
		setSymbol(value);
	};

	const saveTemplate = () => {
		if (!baseSymbolInfo.symbolISIN) return;

		dispatch(
			toggleSaveSaturnTemplate({
				baseSymbolISIN: baseSymbolInfo.symbolISIN,
				baseSymbolTitle: baseSymbolInfo.symbolTitle,
				activeTab: 'tab_chart',
				options: baseSymbolContracts.filter(Boolean) as Saturn.ContentOption[],
			}),
		);
	};

	const openSavedTemplates = () => {
		dispatch(toggleSavedSaturnTemplates(true));
	};

	return (
		<div className='w-full flex-justify-between'>
			<div style={{ flex: 1, maxWidth: '40rem' }} className='rounded bg-white'>
				<SymbolSearch value={symbol} onChange={onChangeSymbol} />
			</div>

			<div style={{ flex: 2 }} className='flex-1 gap-8 flex-justify-end'>
				<button onClick={saveTemplate} type='button' className='h-40 rounded px-32 btn-primary'>
					{t('common.save')}
				</button>
				<button
					type='button'
					className='size-40 rounded border border-gray-500 bg-white text-primary-400 transition-colors flex-justify-center hover:bg-primary-400 hover:text-white'
					onClick={openSavedTemplates}
				>
					<BookmarkSVG />
				</button>
			</div>
		</div>
	);
};

export default Toolbar;

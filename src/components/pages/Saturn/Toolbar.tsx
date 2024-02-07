import SymbolSearch from '@/components/common/SymbolSearch';
import { BookmarkSVG } from '@/components/icons';
import { useAppDispatch, useAppSelector } from '@/features/hooks';
import { toggleSavedSaturnTemplates } from '@/features/slices/uiSlice';
import { getIsLoggedIn } from '@/features/slices/userSlice';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

interface ToolbarProps {
	setSymbol: (symbol: Symbol.Search | null) => void;
	saveTemplate: () => void;
}

const Toolbar = ({ setSymbol, saveTemplate }: ToolbarProps) => {
	const t = useTranslations();

	const isLoggedIn = useAppSelector(getIsLoggedIn);

	const dispatch = useAppDispatch();

	const [symbol] = useState<Symbol.Search | null>(null);

	const onChangeSymbol = (value: Symbol.Search | null) => {
		if (!value) return;
		setSymbol(value);
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
				<button
					onClick={saveTemplate}
					type='button'
					className='h-40 rounded px-32 btn-primary'
					disabled={!isLoggedIn}
				>
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

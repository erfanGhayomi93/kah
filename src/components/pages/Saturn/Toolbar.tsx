import SymbolSearch from '@/components/common/SymbolSearch';
import { BookmarkSVG } from '@/components/icons';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

interface ToolbarProps {
	setSymbol: (symbol: Symbol.Search | null) => void;
}

const Toolbar = ({ setSymbol }: ToolbarProps) => {
	const t = useTranslations();

	const [symbol] = useState<Symbol.Search | null>(null);

	const onChangeSymbol = (value: Symbol.Search | null) => {
		if (!value) return;
		setSymbol(value);
	};

	return (
		<div className='w-full flex-justify-between'>
			<div style={{ flex: 1, maxWidth: '40rem' }} className='rounded bg-white'>
				<SymbolSearch value={symbol} onChange={onChangeSymbol} />
			</div>

			<div style={{ flex: 2 }} className='flex-1 gap-8 flex-justify-end'>
				<button type='button' className='h-40 rounded px-32 btn-primary' disabled>
					{t('saturn_page.save')}
				</button>
				<button
					type='button'
					className='size-40 rounded border border-gray-500 bg-white text-primary-400 flex-justify-center'
					disabled
				>
					<BookmarkSVG />
				</button>
			</div>
		</div>
	);
};

export default Toolbar;

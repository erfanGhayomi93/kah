import SymbolSearch from '@/components/common/SymbolSearch';
import { BookmarkSVG } from '@/components/icons';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

interface ToolbarProps {
	onChangeBaseSymbol: (value: string) => void;
}

const Toolbar = ({ onChangeBaseSymbol }: ToolbarProps) => {
	const t = useTranslations();

	const [symbol, setSymbol] = useState<Option.SymbolSearch | null>(null);

	const onChangeSymbol = (value: Option.SymbolSearch | null) => {
		if (value) onChangeBaseSymbol(value.symbolISIN);
		setSymbol(value);
	};

	return (
		<div className='w-full flex-justify-between'>
			<div style={{ flex: 1 }} className='rounded bg-white'>
				<SymbolSearch value={symbol} onChange={onChangeSymbol} />
			</div>

			<div style={{ flex: 2 }} className='flex-1 gap-8 flex-justify-end'>
				<button type='button' className='h-40 rounded px-32 btn-primary' disabled>
					{t('saturn.save')}
				</button>
				<button
					type='button'
					className='size-40 rounded border border-gray-500 bg-white text-primary-400 text-primary-400 flex-justify-center'
					disabled
				>
					<BookmarkSVG />
				</button>
			</div>
		</div>
	);
};

export default Toolbar;

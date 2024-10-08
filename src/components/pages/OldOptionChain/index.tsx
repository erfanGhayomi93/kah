'use client';

import Loading from '@/components/common/Loading';
import Main from '@/components/layout/Main';
import { useLocalstorage } from '@/hooks';
import dynamic from 'next/dynamic';
import Section from './common/Section';

const SymbolInfo = dynamic(() => import('./SymbolInfo'), {
	ssr: false,
	loading: () => <Loading />,
});

const SelectSymbol = dynamic(() => import('./SelectSymbol'), {
	ssr: false,
	loading: () => <Loading />,
});

const SymbolContracts = dynamic(() => import('./SymbolContracts'), {
	ssr: false,
	loading: () => <Loading />,
});

const OptionChain = () => {
	const [selectedSymbol, setSelectedSymbol] = useLocalstorage<null | string>('selected_symbol', null);

	return (
		<Main style={{ overflowY: 'scroll' }} className='gap-8'>
			<div style={{ flex: '0 0 46.4rem' }} className='flex gap-8'>
				<div className='darkBlue:bg-gray-50 relative flex-1 gap-24 rounded bg-white p-16 flex-column dark:bg-gray-50'>
					<SelectSymbol selectedSymbol={selectedSymbol} setSelectedSymbol={setSelectedSymbol} />
				</div>

				<Section
					style={{ width: '41%', minWidth: '56rem', maxWidth: '64rem' }}
					className='darkBlue:bg-gray-50 relative rounded bg-white py-12 flex-column dark:bg-gray-50'
				>
					<SymbolInfo selectedSymbol={selectedSymbol} />
				</Section>
			</div>

			<Section style={{ flex: '1.8 0 48rem' }} className='relative justify-start gap-8 flex-column'>
				<SymbolContracts selectedSymbol={selectedSymbol} />
			</Section>
		</Main>
	);
};

export default OptionChain;

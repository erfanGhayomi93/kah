'use client';

import { useSymbolInfoQuery } from '@/api/queries/symbolQuery';
import Loading from '@/components/common/Loading';
import { defaultSymbolISIN } from '@/constants';
import { useLocalstorage } from '@/hooks';
import { useSearchParams } from 'next/navigation';
import { useLayoutEffect, useState } from 'react';
import styled from 'styled-components';
import SymbolContracts from './SymbolContracts/SymbolContracts';
import SymbolInfo from './SymbolInfo';
import Toolbar from './Toolbar';

const Main = styled.main`
	display: flex;
	flex-direction: column;
	padding: 0.8rem 3.2rem 2.4rem 3.2rem;
	gap: 0.8rem;
	min-height: calc(100% - 10rem);
`;

const Saturn = () => {
	const searchParams = useSearchParams();

	const [baseSymbolContracts, setBaseSymbolContracts] = useState<TSaturnBaseSymbolContracts>([
		null,
		null,
		null,
		null,
	]);

	const [selectedSymbol, setSelectedSymbol] = useLocalstorage<string>('selected_symbol', defaultSymbolISIN);

	const { data: baseSymbolInfo, isFetching } = useSymbolInfoQuery({
		queryKey: [
			'symbolInfoQuery',
			searchParams.get('symbolISIN') || (typeof selectedSymbol === 'string' ? selectedSymbol : defaultSymbolISIN),
		],
	});

	useLayoutEffect(() => {
		try {
			const contractISIN = searchParams.get('contractISIN');
			if (!contractISIN) throw new Error();

			setBaseSymbolContracts([contractISIN, null, null, null]);
		} catch (e) {
			//
		}
	}, []);

	if (!baseSymbolInfo && isFetching) {
		return (
			<Main>
				<Loading />
			</Main>
		);
	}

	if (!baseSymbolInfo) return null;

	return (
		<Main>
			<Toolbar onChangeBaseSymbol={(value) => setSelectedSymbol(value)} />
			<SymbolInfo symbol={baseSymbolInfo} />
			<SymbolContracts
				baseSymbol={baseSymbolInfo}
				baseSymbolContracts={baseSymbolContracts}
				onChange={(value) => setBaseSymbolContracts(value)}
			/>
		</Main>
	);
};

export default Saturn;

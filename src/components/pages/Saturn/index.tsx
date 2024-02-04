'use client';

import { useSymbolInfoQuery } from '@/api/queries/symbolQuery';
import ipcMain from '@/classes/IpcMain';
import Loading from '@/components/common/Loading';
import Main from '@/components/layout/Main';
import { defaultSymbolISIN } from '@/constants';
import { useLocalstorage } from '@/hooks';
import { useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import { useLayoutEffect, useState } from 'react';
import SymbolContracts from './SymbolContracts/SymbolContracts';
import SymbolInfo from './SymbolInfo';
import Toolbar from './Toolbar';

const Saturn = () => {
	const t = useTranslations();

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

	const onContractAdded = (data: Option.Root) => {
		try {
			const contracts = [...baseSymbolContracts];
			const nullableContractIndex = contracts.findIndex((c) => c === null);

			if (nullableContractIndex >= 0) contracts[nullableContractIndex] = data.symbolInfo.symbolISIN;
			else contracts[0] = data.symbolInfo.symbolISIN;

			setBaseSymbolContracts(contracts);
		} catch (e) {
			//
		}
	};

	const onChangeSymbol = (symbol: Symbol.Search | null) => {
		if (!symbol) return;

		const { isOption, symbolISIN } = symbol;

		if (!isOption) {
			if (selectedSymbol !== symbolISIN) {
				setSelectedSymbol(symbolISIN);
				setBaseSymbolContracts([null, null, null, null]);
			}

			return;
		}

		const contracts = [...baseSymbolContracts];

		if (contracts.includes(symbolISIN)) return;

		const blankContract = contracts.findIndex((con) => con === null);
		if (blankContract > -1) {
			contracts[blankContract] = symbolISIN;
		} else {
			contracts.shift();
			contracts.unshift(symbolISIN);
		}

		setBaseSymbolContracts(contracts);
	};

	useLayoutEffect(() => {
		try {
			const contractISIN = searchParams.get('contractISIN');
			if (!contractISIN) throw new Error();

			setBaseSymbolContracts([contractISIN, null, null, null]);
		} catch (e) {
			//
		}
	}, []);

	useLayoutEffect(() => {
		try {
			ipcMain.handle<Option.Root>('saturn_contract_added', onContractAdded);

			return () => {
				ipcMain.removeHandler('saturn_contract_added', onContractAdded);
			};
		} catch (e) {
			//
		}
	}, [baseSymbolContracts]);

	if (!baseSymbolInfo && isFetching) {
		return (
			<Main>
				<Loading />
			</Main>
		);
	}

	if (!baseSymbolInfo)
		return (
			<Main>
				<span className='absolute text-base font-medium text-gray-900 center'>
					{t('common.an_error_occurred')}
				</span>
			</Main>
		);

	return (
		<Main className='gap-8'>
			<Toolbar setSymbol={onChangeSymbol} />
			<SymbolInfo symbol={baseSymbolInfo} />
			<SymbolContracts
				baseSymbol={baseSymbolInfo}
				baseSymbolContracts={baseSymbolContracts}
				setBaseSymbol={(value) => setSelectedSymbol(value)}
				setBaseSymbolContracts={(value) => setBaseSymbolContracts(value)}
			/>
		</Main>
	);
};

export default Saturn;

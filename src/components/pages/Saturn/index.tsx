'use client';

import { useSymbolInfoQuery } from '@/api/queries/symbolQuery';
import ipcMain from '@/classes/IpcMain';
import Loading from '@/components/common/Loading';
import Main from '@/components/layout/Main';
import { defaultSymbolISIN } from '@/constants';
import { useAppSelector } from '@/features/hooks';
import { getSaturnActiveTemplate } from '@/features/slices/uiSlice';
import { useLocalstorage } from '@/hooks';
import { openNewTab } from '@/utils/helpers';
import { useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import { useLayoutEffect, useState } from 'react';
import SavedTemplates from './SavedTemplates';
import SymbolContracts from './SymbolContracts/SymbolContracts';
import SymbolInfo from './SymbolInfo';
import Toolbar from './Toolbar';

const Saturn = () => {
	const t = useTranslations();

	const searchParams = useSearchParams();

	const saturnActiveTemplate = useAppSelector(getSaturnActiveTemplate);

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

			const { symbolISIN, symbolTitle } = data.symbolInfo;

			const option: Saturn.ContentOption = {
				symbolISIN,
				symbolTitle,
				activeTab: 'price_information',
			};

			if (nullableContractIndex >= 0) contracts[nullableContractIndex] = option;
			else contracts[0] = option;

			setBaseSymbolContracts(contracts);
		} catch (e) {
			//
		}
	};

	const onChangeSymbol = (symbol: Symbol.Search | null) => {
		if (!symbol || !baseSymbolInfo) return;

		try {
			const baseSymbolISIN = baseSymbolInfo.symbolISIN;
			const { isOption, symbolISIN, symbolTitle } = symbol;

			if (isOption) {
				const contracts = [...baseSymbolContracts];
				if (contracts.find((sym) => sym?.symbolISIN === symbolISIN)) return;

				const option: Saturn.ContentOption = {
					symbolISIN,
					symbolTitle,
					activeTab: 'price_information',
				};

				const blankContract = contracts.findIndex((con) => con === null);
				if (blankContract > -1) {
					contracts[blankContract] = option;
					setBaseSymbolContracts(contracts);
				} else {
					if (symbolISIN) openNewTab('/fa/saturn', `contractISIN=${symbolISIN}&symbolISIN=${baseSymbolISIN}`);
				}
			}

			if (symbolISIN) openNewTab('/fa/saturn', `symbolISIN=${symbolISIN}`);
		} catch (e) {
			//
		}
	};

	useLayoutEffect(() => {
		try {
			const contractISIN = searchParams.get('contractISIN');
			if (!contractISIN || saturnActiveTemplate) throw new Error();

			// TODO
			// setBaseSymbolContracts([contractISIN, null, null, null]);
		} catch (e) {
			//
		}
	}, []);

	useLayoutEffect(() => {
		try {
			if (!saturnActiveTemplate) return;

			const { baseSymbolISIN, options } = JSON.parse(saturnActiveTemplate.content) as Saturn.Content;

			setSelectedSymbol(baseSymbolISIN);
			setBaseSymbolContracts([null, null, null, null]);
		} catch (e) {
			//
		}
	}, [saturnActiveTemplate]);

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
			<Toolbar
				baseSymbolContracts={baseSymbolContracts}
				baseSymbolInfo={baseSymbolInfo}
				setSymbol={onChangeSymbol}
			/>
			<SymbolInfo symbol={baseSymbolInfo} />
			<SavedTemplates />
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

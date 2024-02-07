'use client';

import { symbolInfoQueryFn, useSymbolInfoQuery } from '@/api/queries/symbolQuery';
import ipcMain from '@/classes/IpcMain';
import LocalstorageInstance from '@/classes/Localstorage';
import Loading from '@/components/common/Loading';
import Main from '@/components/layout/Main';
import { defaultSymbolISIN } from '@/constants';
import { useAppDispatch, useAppSelector } from '@/features/hooks';
import { toggleSaveSaturnTemplate } from '@/features/slices/modalSlice';
import { getSaturnActiveTemplate } from '@/features/slices/uiSlice';
import { openNewTab } from '@/utils/helpers';
import { useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import { useLayoutEffect, useState } from 'react';
import SymbolContracts from './SymbolContracts/SymbolContracts';
import SymbolInfo from './SymbolInfo';
import Toolbar from './Toolbar';

const Saturn = () => {
	const t = useTranslations();

	const dispatch = useAppDispatch();

	const queryClient = useQueryClient();

	const searchParams = useSearchParams();

	const saturnActiveTemplate = useAppSelector(getSaturnActiveTemplate);

	const [baseSymbolContracts, setBaseSymbolContracts] = useState<TSaturnBaseSymbolContracts>([
		null,
		null,
		null,
		null,
	]);

	const [baseSymbolActiveTab, setBaseSymbolActiveTab] = useState<Saturn.SymbolTab>('tab_market_depth');

	const [selectedSymbol, setSelectedSymbol] = useState<string>(
		searchParams.get('symbolISIN') ?? LocalstorageInstance.get('selected_symbol', defaultSymbolISIN),
	);

	const { data: baseSymbolInfo, isFetching } = useSymbolInfoQuery({
		queryKey: ['symbolInfoQuery', typeof selectedSymbol === 'string' ? selectedSymbol : defaultSymbolISIN],
	});

	const onContractAdded = (data: Array<{ symbolISIN: string; symbolTitle: string; activeTab: Saturn.OptionTab }>) => {
		try {
			const contracts = [...baseSymbolContracts];

			for (let i = 0; i < data.length; i++) {
				const { symbolISIN, symbolTitle, activeTab } = data[i];
				const nullableContractIndex = contracts.findIndex((c) => c === null);

				const option: Saturn.ContentOption = {
					symbolISIN,
					symbolTitle,
					activeTab: activeTab ?? 'price_information',
				};
				if (nullableContractIndex >= 0) contracts[nullableContractIndex] = option;
				else contracts[0] = option;
			}
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

	const saveTemplate = () => {
		if (!baseSymbolInfo) return;

		const { symbolISIN, symbolTitle } = baseSymbolInfo;

		dispatch(
			toggleSaveSaturnTemplate({
				baseSymbolISIN: symbolISIN,
				baseSymbolTitle: symbolTitle,
				activeTab: baseSymbolActiveTab,
				options: baseSymbolContracts.filter(Boolean) as Saturn.ContentOption[],
			}),
		);
	};

	const fetchContractISIN = async (contractISIN: string) => {
		try {
			const data = await queryClient.fetchQuery({
				staleTime: 6e5,
				queryKey: ['symbolInfoQuery', contractISIN],
				queryFn: symbolInfoQueryFn,
			});
			if (!data) return;

			const { symbolISIN, symbolTitle } = data;

			setBaseSymbolContracts([
				{
					symbolISIN,
					symbolTitle,
					activeTab: 'price_information',
				},
				null,
				null,
				null,
			]);
		} catch (e) {
			//
		}
	};

	useLayoutEffect(() => {
		try {
			const contractISIN = searchParams.get('contractISIN');
			if (!contractISIN || saturnActiveTemplate) throw new Error();

			fetchContractISIN(contractISIN);
		} catch (e) {
			//
		}
	}, []);

	useLayoutEffect(() => {
		if (selectedSymbol) LocalstorageInstance.set('selected_symbol', selectedSymbol);
	}, [selectedSymbol]);

	useLayoutEffect(() => {
		try {
			if (!saturnActiveTemplate) return;

			const { baseSymbolISIN, options } = JSON.parse(saturnActiveTemplate.content) as Saturn.Content;

			setSelectedSymbol(baseSymbolISIN);
			if (Array.isArray(options) && options.length > 0) setBaseSymbolContracts(options);
			else setBaseSymbolContracts([null, null, null, null]);
		} catch (e) {
			//
		}
	}, [saturnActiveTemplate]);

	useLayoutEffect(() => {
		try {
			ipcMain.handle<Array<{ symbolISIN: string; symbolTitle: string; activeTab: Saturn.OptionTab }>>(
				'saturn_contract_added',
				onContractAdded,
			);

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
			<Toolbar setSymbol={onChangeSymbol} saveTemplate={saveTemplate} />
			<SymbolInfo
				symbol={baseSymbolInfo}
				activeTab={baseSymbolActiveTab}
				setActiveTab={(tabId) => setBaseSymbolActiveTab(tabId)}
			/>
			<SymbolContracts
				baseSymbol={baseSymbolInfo}
				setBaseSymbol={(value) => setSelectedSymbol(value)}
				baseSymbolContracts={baseSymbolContracts}
				setBaseSymbolContracts={(value) => setBaseSymbolContracts(value)}
			/>
		</Main>
	);
};

export default Saturn;

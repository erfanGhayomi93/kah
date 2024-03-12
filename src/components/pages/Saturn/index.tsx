'use client';

import { useActiveTemplateQuery } from '@/api/queries/saturnQueries';
import { symbolInfoQueryFn, useSymbolInfoQuery } from '@/api/queries/symbolQuery';
import ipcMain from '@/classes/IpcMain';
import LocalstorageInstance from '@/classes/Localstorage';
import Loading from '@/components/common/Loading';
import Main from '@/components/layout/Main';
import Orders from '@/components/layout/Orders';
import { defaultSymbolISIN } from '@/constants';
import { useAppDispatch, useAppSelector } from '@/features/hooks';
import { getBrokerURLs } from '@/features/slices/brokerSlice';
import { toggleSaveSaturnTemplate } from '@/features/slices/modalSlice';
import { getSaturnActiveTemplate, setSaturnActiveTemplate } from '@/features/slices/uiSlice';
import { type RootState } from '@/features/store';
import { cn, openNewTab } from '@/utils/helpers';
import { createSelector } from '@reduxjs/toolkit';
import { useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import dynamic from 'next/dynamic';
import { useSearchParams } from 'next/navigation';
import { useLayoutEffect, useState } from 'react';
import { toast } from 'react-toastify';
import Toolbar from './Toolbar';

const SymbolContracts = dynamic(() => import('./SymbolContracts'), {
	ssr: false,
	loading: () => <Loading />,
});

const SymbolInfo = dynamic(() => import('./SymbolInfo'), {
	ssr: false,
	loading: () => <Loading />,
});

const getStates = createSelector(
	(state: RootState) => state,
	(state) => ({
		saturnActiveTemplate: getSaturnActiveTemplate(state),
		brokerURLs: getBrokerURLs(state),
	}),
);

const Saturn = () => {
	const t = useTranslations();

	const dispatch = useAppDispatch();

	const queryClient = useQueryClient();

	const searchParams = useSearchParams();

	const { saturnActiveTemplate, brokerURLs } = useAppSelector(getStates);

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

	const { data: baseSymbolInfo, isLoading: isLoadingBaseSymbolInfo } = useSymbolInfoQuery({
		queryKey: ['symbolInfoQuery', typeof selectedSymbol === 'string' ? selectedSymbol : defaultSymbolISIN],
	});

	const { data: activeTemplate, isLoading: isLoadingActiveTemplate } = useActiveTemplateQuery({
		queryKey: ['useActiveTemplate'],
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
		if (!symbol) {
			toast.error(t('alerts.symbol_not_found'));
			return;
		}

		try {
			const { isOption, symbolISIN, symbolTitle } = symbol;

			if (baseSymbolInfo) {
				const baseSymbolISIN = baseSymbolInfo.symbolISIN;

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
						if (symbolISIN)
							openNewTab('/fa/saturn', `contractISIN=${symbolISIN}&symbolISIN=${baseSymbolISIN}`);
					}
				} else {
					if (symbolISIN) openNewTab('/fa/saturn', `symbolISIN=${symbolISIN}`);
				}
			} else {
				openNewTab('/fa/saturn', `${isOption ? 'contractISIN' : 'symbolISIN'}=${symbol.symbolISIN}`);
			}
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
			if (Array.isArray(options) && options.length > 0) {
				setBaseSymbolContracts([...options, ...Array(4 - options.length).fill(null)]);
			} else {
				setBaseSymbolContracts([null, null, null, null]);
			}
		} catch (e) {
			//
		}
	}, [saturnActiveTemplate]);

	useLayoutEffect(() => {
		try {
			ipcMain.handle('saturn_contract_added', onContractAdded);

			return () => {
				ipcMain.removeHandler('saturn_contract_added', onContractAdded);
			};
		} catch (e) {
			//
		}
	}, [baseSymbolContracts]);

	useLayoutEffect(() => {
		if (!activeTemplate) return;
		dispatch(setSaturnActiveTemplate(activeTemplate));
	}, [activeTemplate]);

	if (isLoadingBaseSymbolInfo || isLoadingActiveTemplate) {
		return (
			<Main>
				<Loading />
			</Main>
		);
	}

	return (
		<Main className='gap-8 !pb-0 !pl-0 !pr-8'>
			<Toolbar setSymbol={onChangeSymbol} saveTemplate={saveTemplate} />

			{baseSymbolInfo ? (
				<div className='flex flex-1 gap-8 overflow-hidden'>
					<div
						style={{
							flex: '5',
						}}
						className={cn(
							'relative size-full flex-1 rounded bg-white px-16 pb-16 pt-8 flex-column',
							brokerURLs ? 'gap-32' : 'gap-40',
						)}
					>
						<SymbolInfo
							symbol={baseSymbolInfo}
							activeTab={baseSymbolActiveTab}
							setActiveTab={(tabId) => setBaseSymbolActiveTab(tabId)}
						/>
					</div>

					<div style={{ flex: '7' }} className='relative gap-8 overflow-auto rounded flex-column'>
						<SymbolContracts
							baseSymbol={baseSymbolInfo}
							setBaseSymbol={(value) => setSelectedSymbol(value)}
							baseSymbolContracts={baseSymbolContracts}
							setBaseSymbolContracts={(value) => setBaseSymbolContracts(value)}
						/>
					</div>
				</div>
			) : (
				<span className='absolute text-base font-bold text-gray-900 center'>
					{t('common.symbol_not_found')}
				</span>
			)}

			<Orders />
		</Main>
	);
};

export default Saturn;

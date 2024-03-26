'use client';

import axios from '@/api/axios';
import { symbolInfoQueryFn } from '@/api/queries/symbolQuery';
import routes from '@/api/routes';
import ipcMain from '@/classes/IpcMain';
import LocalstorageInstance from '@/classes/Localstorage';
import Loading from '@/components/common/Loading';
import { useAppDispatch, useAppSelector } from '@/features/hooks';
import { getBrokerURLs } from '@/features/slices/brokerSlice';
import { getSaturnActiveTemplate, setSaturnActiveTemplate } from '@/features/slices/uiSlice';
import { type RootState } from '@/features/store';
import { cn } from '@/utils/helpers';
import { createSelector } from '@reduxjs/toolkit';
import { useQueryClient } from '@tanstack/react-query';
import dynamic from 'next/dynamic';
import { useSearchParams } from 'next/navigation';
import { useLayoutEffect } from 'react';

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

interface LayoutProps {
	selectedSymbol: string;
	onChangeSymbol: (symbolISIN: string) => void;
	baseSymbolActiveTab: Saturn.SymbolTab;
	onChangeBaeSymbolActiveTab: (tab: Saturn.SymbolTab) => void;
	baseSymbolContracts: TSaturnBaseSymbolContracts;
	onChangeBaseSymbolContracts: (v: TSaturnBaseSymbolContracts) => void;
	baseSymbolInfo: Symbol.Info;
	activeTemplate: Saturn.Template;
}

const Layout = ({
	selectedSymbol,
	onChangeSymbol,
	baseSymbolContracts,
	onChangeBaseSymbolContracts,
	baseSymbolActiveTab,
	onChangeBaeSymbolActiveTab,
	baseSymbolInfo,
	activeTemplate,
}: LayoutProps) => {
	const dispatch = useAppDispatch();

	const queryClient = useQueryClient();

	const searchParams = useSearchParams();

	const { saturnActiveTemplate, brokerURLs } = useAppSelector(getStates);

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
			onChangeBaseSymbolContracts(contracts);
		} catch (e) {
			//
		}
	};

	const updateTemplate = async () => {
		if (!baseSymbolInfo || !saturnActiveTemplate) return;

		try {
			const { symbolISIN, symbolTitle } = baseSymbolInfo;

			const content = JSON.stringify({
				baseSymbolTitle: symbolTitle,
				baseSymbolISIN: symbolISIN,
				activeTab: baseSymbolActiveTab,
				options: baseSymbolContracts,
			});

			await axios.post(routes.saturn.Upsert, {
				id: saturnActiveTemplate.id,
				name: saturnActiveTemplate.name,
				content,
			});
		} catch (e) {
			//
		}
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

			onChangeBaseSymbolContracts([
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

	const onBeforeUnload = (e: BeforeUnloadEvent) => {
		if (saturnActiveTemplate === null) e.preventDefault();
	};

	useLayoutEffect(() => {
		window.addEventListener('beforeunload', onBeforeUnload);

		return () => {
			window.removeEventListener('beforeunload', onBeforeUnload);
		};
	}, [saturnActiveTemplate]);

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

			onChangeSymbol(baseSymbolISIN);
			if (Array.isArray(options) && options.length > 0) {
				onChangeBaseSymbolContracts([...options, ...Array(4 - options.length).fill(null)]);
			} else {
				onChangeBaseSymbolContracts([null, null, null, null]);
			}
		} catch (e) {
			//
		}
	}, [saturnActiveTemplate]);

	useLayoutEffect(() => {
		const removeHandler = ipcMain.handle('saturn_contract_added', onContractAdded);
		return () => removeHandler();
	}, [JSON.stringify(baseSymbolContracts)]);

	useLayoutEffect(() => {
		if (!activeTemplate) return;
		dispatch(setSaturnActiveTemplate(activeTemplate));
	}, [activeTemplate]);

	useLayoutEffect(() => {
		try {
			updateTemplate();
		} catch (e) {
			//
		}
	}, [JSON.stringify(baseSymbolContracts), baseSymbolActiveTab]);

	return (
		<div className='flex flex-1 gap-8 overflow-hidden pb-8'>
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
					setActiveTab={(tabId) => onChangeBaeSymbolActiveTab(tabId)}
				/>
			</div>

			<div style={{ flex: '7' }} className='relative gap-8 overflow-auto rounded flex-column'>
				<SymbolContracts
					baseSymbol={baseSymbolInfo}
					setBaseSymbol={(value) => onChangeSymbol(value)}
					baseSymbolContracts={baseSymbolContracts}
					setBaseSymbolContracts={(value) => onChangeBaseSymbolContracts(value)}
				/>
			</div>
		</div>
	);
};

export default Layout;

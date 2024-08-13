import axios from '@/api/axios';
import { symbolInfoQueryFn } from '@/api/queries/symbolQuery';
import routes from '@/api/routes';
import LocalstorageInstance from '@/classes/Localstorage';
import { useAppDispatch, useAppSelector } from '@/features/hooks';
import { setAddSaturnTemplateModal } from '@/features/slices/modalSlice';
import { getSaturnActiveTemplate, setSaturnActiveTemplate } from '@/features/slices/uiSlice';
import { useQueryClient } from '@tanstack/react-query';
import dynamic from 'next/dynamic';
import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import ContractSkeletonLoading from './SymbolContracts/ContractSkeletonLoading';
import Toolbar from './Toolbar';

const SymbolContracts = dynamic(() => import('./SymbolContracts'), {
	ssr: false,
	loading: () => (
		<>
			<ContractSkeletonLoading />
			<ContractSkeletonLoading />
			<ContractSkeletonLoading />
			<ContractSkeletonLoading />
		</>
	),
});

const SymbolInfo = dynamic(() => import('./SymbolInfo'), {
	ssr: false,
	loading: () => (
		<div
			style={{
				flex: '5',
			}}
			className='relative size-full flex-1 rounded skeleton'
		/>
	),
});

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

	const saturnActiveTemplate = useAppSelector(getSaturnActiveTemplate);

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
		const l = baseSymbolContracts.filter((item) => item !== null).length;
		if (saturnActiveTemplate === null && l > 0) e.preventDefault();
	};

	const saveTemplate = () => {
		if (!baseSymbolInfo) return;

		const { symbolISIN, symbolTitle } = baseSymbolInfo;

		dispatch(
			setAddSaturnTemplateModal({
				baseSymbolISIN: symbolISIN,
				baseSymbolTitle: symbolTitle,
				activeTab: baseSymbolActiveTab,
				options: baseSymbolContracts.filter(Boolean) as Saturn.ContentOption[],
			}),
		);
	};

	useEffect(() => {
		const c = new AbortController();
		window.addEventListener('beforeunload', onBeforeUnload, {
			signal: c.signal,
		});

		return () => {
			c.abort();
		};
	}, [saturnActiveTemplate, baseSymbolContracts]);

	useEffect(() => {
		try {
			const contractISIN = searchParams.get('contractISIN');
			if (!contractISIN || saturnActiveTemplate) throw new Error();

			fetchContractISIN(contractISIN);
		} catch (e) {
			//
		}
	}, []);

	useEffect(() => {
		if (selectedSymbol) LocalstorageInstance.set('selected_symbol', selectedSymbol);
	}, [selectedSymbol]);

	useEffect(() => {
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

	useEffect(() => {
		if (!activeTemplate) return;
		dispatch(setSaturnActiveTemplate(activeTemplate));
	}, [activeTemplate]);

	useEffect(() => {
		try {
			updateTemplate();
		} catch (e) {
			//
		}
	}, [JSON.stringify(baseSymbolContracts), baseSymbolActiveTab]);

	return (
		<div className='flex flex-1 gap-8 overflow-hidden flex-column xl:flex-row'>
			<SymbolInfo
				symbol={baseSymbolInfo}
				activeTab={baseSymbolActiveTab}
				setActiveTab={(tabId) => onChangeBaeSymbolActiveTab(tabId)}
			/>

			<div style={{ flex: '7' }} className='gap-8 rounded flex-column'>
				<Toolbar saveTemplate={saveTemplate} />

				<div className='relative flex-1 gap-8 overflow-auto rounded pl-8 flex-column'>
					<SymbolContracts
						baseSymbol={baseSymbolInfo}
						setBaseSymbol={(value) => onChangeSymbol(value)}
						baseSymbolContracts={baseSymbolContracts}
						setBaseSymbolContracts={(value) => onChangeBaseSymbolContracts(value)}
					/>
				</div>
			</div>
		</div>
	);
};

export default Layout;

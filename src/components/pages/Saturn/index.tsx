'use client';

import { useActiveTemplateQuery } from '@/api/queries/saturnQueries';
import { useSymbolInfoQuery } from '@/api/queries/symbolQuery';
import LocalstorageInstance from '@/classes/Localstorage';
import Loading from '@/components/common/Loading';
import Main from '@/components/layout/Main';
import Orders from '@/components/layout/Orders';
import { defaultSymbolISIN } from '@/constants';
import { useAppDispatch } from '@/features/hooks';
import { setAddSaturnTemplateModal } from '@/features/slices/modalSlice';
import { setSymbolInfoPanel } from '@/features/slices/panelSlice';
import { useTranslations } from 'next-intl';
import dynamic from 'next/dynamic';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'react-toastify';
import Toolbar from './Toolbar';

const Layout = dynamic(() => import('./Layout'), {
	ssr: false,
	loading: () => <Loading />,
});

const Saturn = () => {
	const t = useTranslations();

	const dispatch = useAppDispatch();

	const searchParams = useSearchParams();

	const [selectedSymbol, setSelectedSymbol] = useState<string>(
		searchParams.get('symbolISIN') ?? LocalstorageInstance.get('selected_symbol', defaultSymbolISIN),
	);

	const [baseSymbolActiveTab, setBaseSymbolActiveTab] = useState<Saturn.SymbolTab>('tab_market_depth');

	const [baseSymbolContracts, setBaseSymbolContracts] = useState<TSaturnBaseSymbolContracts>([
		null,
		null,
		null,
		null,
	]);

	const { data: baseSymbolInfo, isLoading: isLoadingBaseSymbolInfo } = useSymbolInfoQuery({
		queryKey: ['symbolInfoQuery', typeof selectedSymbol === 'string' ? selectedSymbol : defaultSymbolISIN],
	});

	const { data: activeTemplate, isLoading: isLoadingActiveTemplate } = useActiveTemplateQuery({
		queryKey: ['useActiveTemplate'],
		enabled: Boolean(!searchParams.get('symbolISIN') && !searchParams.get('symbolISIN')),
	});

	const onChangeSymbol = (symbol: Symbol.Search | null) => {
		if (!symbol) {
			toast.error(t('alerts.symbol_not_found'));
			return;
		}

		dispatch(setSymbolInfoPanel(symbol.symbolISIN));
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
				<Layout
					selectedSymbol={selectedSymbol}
					onChangeSymbol={setSelectedSymbol}
					baseSymbolActiveTab={baseSymbolActiveTab}
					onChangeBaeSymbolActiveTab={setBaseSymbolActiveTab}
					baseSymbolContracts={baseSymbolContracts}
					onChangeBaseSymbolContracts={setBaseSymbolContracts}
					baseSymbolInfo={baseSymbolInfo!}
					activeTemplate={activeTemplate!}
				/>
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

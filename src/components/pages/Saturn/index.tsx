'use client';

import { useActiveTemplateQuery } from '@/api/queries/saturnQueries';
import { useSymbolInfoQuery } from '@/api/queries/symbolQuery';
import LocalstorageInstance from '@/classes/Localstorage';
import Loading from '@/components/common/Loading';
import Main from '@/components/layout/Main';
import { defaultSymbolISIN } from '@/constants';
import { useAppSelector } from '@/features/hooks';
import { getIsLoggedIn } from '@/features/slices/userSlice';
import { useTranslations } from 'next-intl';
import dynamic from 'next/dynamic';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';

const Layout = dynamic(() => import('./Layout'), {
	ssr: false,
	loading: () => <Loading />,
});

const Saturn = () => {
	const t = useTranslations();

	const searchParams = useSearchParams();

	const isLoggedIn = useAppSelector(getIsLoggedIn);

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
		enabled: isLoggedIn && Boolean(!searchParams.get('symbolISIN') && !searchParams.get('symbolISIN')),
	});

	if (isLoadingBaseSymbolInfo || isLoadingActiveTemplate) {
		return (
			<Main>
				<Loading />
			</Main>
		);
	}

	return (
		<Main className='gap-8 !pb-0 !pl-0 !pr-8'>
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
		</Main>
	);
};

export default Saturn;

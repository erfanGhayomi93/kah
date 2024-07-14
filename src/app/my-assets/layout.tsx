'use client';

import LocalstorageInstance from '@/classes/Localstorage';
import Main from '@/components/layout/Main';
import Toolbar from '@/components/pages/MyAssets/Toolbar';
import { usePathname, useRouter } from '@/navigation';
import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

const Layout = ({ children }: { children: ReactNode }) => {
	const searchParams = useSearchParams();

	const pathname = usePathname();

	const router = useRouter();

	useEffect(() => {
		const priceBasis = searchParams.get('pb');
		const showInvolvedInStrategy = searchParams.get('str');
		const showSoldSymbols = searchParams.get('ss');
		const useCommissions = searchParams.get('com');

		let needsToChange = false;
		const params = new URLSearchParams(searchParams.toString());

		if (
			priceBasis === null ||
			(priceBasis !== 'LastTradePrice' && priceBasis !== 'ClosingPrice' && priceBasis !== 'BestLimitPrice')
		) {
			needsToChange = true;
			params.set('pb', 'LastTradePrice');
		}

		if (
			showInvolvedInStrategy === null ||
			(showInvolvedInStrategy !== 'true' && showInvolvedInStrategy !== 'false')
		) {
			needsToChange = true;
			params.set('str', 'true');
		}

		if (showSoldSymbols === null || (showSoldSymbols !== 'true' && showSoldSymbols !== 'false')) {
			needsToChange = true;
			params.set('ss', 'true');
		}

		if (useCommissions === null || (useCommissions !== 'true' && useCommissions !== 'false')) {
			needsToChange = true;
			params.set('com', LocalstorageInstance.get('use_trade_commission', true) ? 'true' : 'false');
		}

		if (needsToChange) router.replace(`${pathname}?${params.toString()}`);
	}, [searchParams, pathname]);

	return (
		<Main className='gap-8'>
			<Toolbar />
			{children}
		</Main>
	);
};

export default Layout;

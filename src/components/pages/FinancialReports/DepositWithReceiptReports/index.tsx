'use client';

import Loading from '@/components/common/Loading';
import Main from '@/components/layout/Main';
import { initialDepositWithReceiptReportsFilters } from '@/constants';
import { useAppDispatch } from '@/features/hooks';
import { setOptionFiltersModal } from '@/features/slices/modalSlice';
import { useDebounce, useInputs } from '@/hooks';
import dynamic from 'next/dynamic';
import { useMemo } from 'react';
import Tabs from '../common/Tabs';

const Table = dynamic(() => import('./Table'), {
	ssr: false,
	loading: () => <Loading />,
});

const DepositWithReceiptReports = () => {
	const dispatch = useAppDispatch();

	const { inputs, setFieldValue, setFieldsValue } =
		useInputs<DepositWithReceiptReports.DepositWithReceiptReportsFilters>(initialDepositWithReceiptReportsFilters);

	const { setDebounce } = useDebounce();

	const onShowFilters = () => {
		// const params: Partial<IOptionFiltersModal> = {};

		// if (filters.symbols) params.initialSymbols = filters.symbols;
		// if (filters.type) params.initialType = filters.type;
		// if (filters.status) params.initialStatus = filters.status;
		// if (filters.dueDays) params.initialDueDays = filters.dueDays;
		// if (filters.delta) params.initialDelta = filters.delta;
		// if (filters.minimumTradesValue) params.initialMinimumTradesValue = filters.minimumTradesValue;

		dispatch(setOptionFiltersModal({}));
	};

	const onExportExcel = () => {
		// try {
		// 	const url =
		// 		watchlistId === -1
		// 			? routes.optionWatchlist.WatchlistExcel
		// 			: routes.optionWatchlist.GetCustomWatchlistExcel;
		// 	const params: Partial<IOptionWatchlistQuery> = {};
		// 	if (filters.minimumTradesValue && Number(filters.minimumTradesValue) >= 0)
		// 		params.MinimumTradeValue = filters.minimumTradesValue;
		// 	if (Array.isArray(filters.symbols) && filters.symbols.length > 0)
		// 		params.SymbolISINs = filters.symbols.map((item) => item.symbolISIN);
		// 	if (Array.isArray(filters.type) && filters.type.length > 0) params.OptionType = filters.type;
		// 	if (Array.isArray(filters.status) && filters.status.length > 0) params.IOTM = filters.status;
		// 	if (filters.dueDays && filters.dueDays[1] >= filters.dueDays[0]) {
		// 		if (filters.dueDays[0] > 0) params.FromDueDays = String(filters.dueDays[0]);
		// 		if (filters.dueDays[1] < 365) params.ToDueDays = String(filters.dueDays[1]);
		// 	}
		// 	if (filters.delta && filters.delta[1] >= filters.delta[0]) {
		// 		if (filters.delta[0] > -1) params.FromDelta = String(filters.delta[0]);
		// 		if (filters.delta[1] < 1) params.ToDelta = String(filters.delta[1]);
		// 	}
		// 	if (watchlistId !== -1) params.Id = String(watchlistId);
		// 	downloadFile(url, 'دیده‌بان کهکشان', params);
		// } catch (e) {
		// 	//
		// }
	};

	const filtersCount = useMemo(() => {
		const badgeCount = 0;

		// if (filters.minimumTradesValue && Number(filters.minimumTradesValue) >= 0) badgeCount++;

		// if (Array.isArray(filters.symbols) && filters.symbols.length > 0) badgeCount++;

		// if (Array.isArray(filters.type) && filters.type.length > 0) badgeCount++;

		// if (Array.isArray(filters.status) && filters.status.length > 0) badgeCount++;

		// if (filters.dueDays) {
		// 	if (filters.dueDays[0] > 0) badgeCount++;
		// 	if (filters.dueDays[1] < 365) badgeCount++;
		// }

		// if (filters.delta) {
		// 	if (filters.delta[0] > -1) badgeCount++;
		// 	if (filters.delta[1] < 1) badgeCount++;
		// }

		return badgeCount;
	}, [JSON.stringify(inputs ?? {})]);

	return (
		<Main className='gap-16 bg-white !pt-16'>
			<div className='flex-justify-between'>
				<Tabs />
				{/* <Actions
					filtersCount={filtersCount}
					onShowFilters={onShowFilters}
					onExportExcel={() => setDebounce(onExportExcel, 500)}
				/> */}
			</div>

			<div className='relative flex-1 overflow-hidden'>
				<Table filters={inputs} setFilters={setFieldValue} />
			</div>
		</Main>
	);
};

export default DepositWithReceiptReports;

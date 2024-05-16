'use client';

import Loading from '@/components/common/Loading';
import Main from '@/components/layout/Main';
import { defaultOrdersReportsColumns, initialOrdersReportsFilters } from '@/constants';
import { useAppDispatch, useAppSelector } from '@/features/hooks';
import { getBrokerURLs } from '@/features/slices/brokerSlice';
import { setOrdersReportsFiltersModal } from '@/features/slices/modalSlice';
import { setManageColumnsPanel } from '@/features/slices/panelSlice';
import { getBrokerIsSelected, getIsLoggedIn } from '@/features/slices/userSlice';
import { type RootState } from '@/features/store';
import { useDebounce, useInputs, useLocalstorage } from '@/hooks';
import { useRouter } from '@/navigation';
import { downloadFileQueryParams, toISOStringWithoutChangeTime } from '@/utils/helpers';
import { createSelector } from '@reduxjs/toolkit';
import { useTranslations } from 'next-intl';
import dynamic from 'next/dynamic';
import { useEffect, useMemo } from 'react';
import Tabs from '../common/Tabs';
import Toolbar from './Toolbar';

const Table = dynamic(() => import('./Table'), {
	ssr: false,
	loading: () => <Loading />,
});

const getStates = createSelector(
	(state: RootState) => state,
	(state) => ({
		isLoggedIn: getIsLoggedIn(state),
		brokerIsSelected: getBrokerIsSelected(state),
		urls: getBrokerURLs(state),
	}),
);

const OrdersReports = () => {
	const t = useTranslations();

	const dispatch = useAppDispatch();

	const router = useRouter();

	const { inputs, setFieldValue, setFieldsValue } =
		useInputs<OrdersReports.IOrdersReportsFilters>(initialOrdersReportsFilters);

	const [columnsVisibility, setColumnsVisibility] = useLocalstorage('orders_reports_column', defaultOrdersReportsColumns);

	const { setDebounce } = useDebounce();

	const { brokerIsSelected, isLoggedIn, urls } = useAppSelector(getStates);

	const onShowFilters = () => {
		const params: Partial<OrdersReports.IOrdersReportsFilters> = {};

		if (inputs.symbol) params.symbol = inputs.symbol;
		if (inputs.fromDate) params.fromDate = inputs.fromDate;
		if (inputs.toDate) params.toDate = inputs.toDate;
		if (inputs.side) params.side = inputs.side;
		if (inputs.status) params.status = inputs.status;

		dispatch(setOrdersReportsFiltersModal(params));
	};

	const filtersCount = useMemo(() => {
		let badgeCount = 0;

		if (inputs.symbol) badgeCount++;

		if (inputs.side) badgeCount++;

		if (Array.isArray(inputs.status) && inputs.status.length > 0) badgeCount++;

		return badgeCount;
	}, [JSON.stringify(inputs ?? {})]);

	const onExportExcel = () => {
		try {
			const fromDate: Date = new Date(inputs.fromDate);
			const toDate: Date = new Date(inputs.toDate);

			const params = new URLSearchParams();

			params.append('QueryOption.PageNumber', String(inputs.pageNumber));
			params.append('QueryOption.PageSize', String(inputs.pageSize));
			params.append('DateOption.FromDate', toISOStringWithoutChangeTime(fromDate));
			params.append('DateOption.ToDate', toISOStringWithoutChangeTime(toDate));
			if (inputs.symbol) params.append('SymbolISIN', inputs.symbol.symbolISIN);
			if (inputs.side !== 'All') params.append('OrderSide', inputs.side);
			if (inputs.status.length > 0) inputs.status.forEach((st) => {
				params.append('OMSOrderState', st.id);
			});

			if (!urls) throw new Error('broker_error');

			downloadFileQueryParams(
				urls.getOrderExportOrders,
				`orders-history-${fromDate.getFullYear()}${fromDate.getMonth() + 1}${fromDate.getDate()}-${toDate.getFullYear()}${toDate.getMonth() + 1}${toDate.getDate()}.csv`,
				params
			);
		} catch (e) {
			//
		}
	};

	const onManageColumns = () => {
		dispatch(
			setManageColumnsPanel({
				initialColumns: defaultOrdersReportsColumns,
				columns: columnsVisibility,
				title: t('orders_reports_page.manage_columns'),
				onColumnChanged: (_, columns) => setColumnsVisibility(columns),
				onReset: () => setColumnsVisibility(defaultOrdersReportsColumns),
			}),
		);
	};

	useEffect(() => {
		if (!isLoggedIn || !brokerIsSelected) {
			router.push('/');
		}
	}, []);

	if (!isLoggedIn || !brokerIsSelected) return <Loading />;

	return (
		<Main className='gap-16 bg-white !pt-16'>
			<div className='flex-justify-between'>
				<Tabs />
				<Toolbar
					filtersCount={filtersCount}
					onShowFilters={onShowFilters}
					onExportExcel={() => setDebounce(onExportExcel, 500)}
					onManageColumns={onManageColumns}
				/>
			</div>

			<div className='relative flex-1 overflow-hidden'>
				<Table
					columnsVisibility={columnsVisibility}
					setColumnsVisibility={setColumnsVisibility}
					filters={inputs}
					setFilters={setFieldValue}
					setFieldsValue={setFieldsValue}
				/>
			</div>
		</Main>
	);
};

export default OrdersReports;

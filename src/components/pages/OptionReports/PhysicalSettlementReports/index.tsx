'use client';

import Loading from '@/components/common/Loading';
import Main from '@/components/layout/Main';
import { defaultPhysicalSettlementReportsColumns, initialCashSettlementReportsFilters } from '@/constants';
import { useAppDispatch, useAppSelector } from '@/features/hooks';
import { getBrokerURLs } from '@/features/slices/brokerSlice';
import { setPhysicalSettlementReportsFiltersModal } from '@/features/slices/modalSlice';
import { setManageColumnsPanel } from '@/features/slices/panelSlice';
import { getBrokerIsSelected, getIsLoggedIn } from '@/features/slices/userSlice';
import { type RootState } from '@/features/store';
import { useDebounce, useInputs, useLocalstorage } from '@/hooks';
import { useRouter } from '@/navigation';
import { createSelector } from '@reduxjs/toolkit';
import { useTranslations } from 'next-intl';
import dynamic from 'next/dynamic';
import { useEffect, useMemo } from 'react';
import Tabs from '../common/Tabs';
import Toolbar from '../common/Toolbar';

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

const PhysicalSettlementReports = () => {
	const t = useTranslations();

	const dispatch = useAppDispatch();

	const router = useRouter();

	const { inputs, setFieldValue, setFieldsValue } =
		useInputs<PhysicalSettlementReports.IPhysicalSettlementReportsFilters>(initialCashSettlementReportsFilters);

	const [columnsVisibility, setColumnsVisibility] = useLocalstorage(
		'physical_settlement_column',
		defaultPhysicalSettlementReportsColumns,
	);

	const { setDebounce } = useDebounce();

	const { brokerIsSelected, isLoggedIn } = useAppSelector(getStates);

	const onShowFilters = () => {
		const params: Partial<PhysicalSettlementReports.IPhysicalSettlementReportsFilters> = {};

		if (inputs.symbol) params.symbol = inputs.symbol;
		if (inputs.date) params.date = inputs.date;
		if (inputs.fromDate) params.fromDate = inputs.fromDate;
		if (inputs.toDate) params.toDate = inputs.toDate;
		if (inputs.contractStatus) params.contractStatus = inputs.contractStatus;
		if (inputs.requestStatus) params.requestStatus = inputs.requestStatus;
		if (inputs.settlementRequestType) params.settlementRequestType = inputs.settlementRequestType;

		dispatch(setPhysicalSettlementReportsFiltersModal(params));
	};

	const filtersCount = useMemo(() => {
		let badgeCount = 0;

		if (inputs.symbol) badgeCount++;

		if (inputs.contractStatus !== 'All') badgeCount++;

		if (Array.isArray(inputs.requestStatus) && inputs.requestStatus.length > 0) badgeCount++;
		if (Array.isArray(inputs.settlementRequestType) && inputs.settlementRequestType.length > 0) badgeCount++;

		return badgeCount;
	}, [JSON.stringify(inputs ?? {})]);

	const onExportExcel = () => {
		try {
			//
		} catch (e) {
			//
		}
	};

	const onManageColumns = () => {
		dispatch(
			setManageColumnsPanel({
				columns: columnsVisibility,
				title: t('physical_settlement_reports_page.manage_columns'),
				onColumnChanged: (_, columns) => setColumnsVisibility(columns),
				onReset: () => setColumnsVisibility(defaultPhysicalSettlementReportsColumns),
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
					filters={inputs}
					setFilters={setFieldValue}
					setFieldsValue={setFieldsValue}
				/>
			</div>
		</Main>
	);
};

export default PhysicalSettlementReports;

'use client';

import Loading from '@/components/common/Loading';
import Main from '@/components/layout/Main';
import { defaultPhysicalSettlementReportsColumns } from '@/constants/columns';
import { initialCashSettlementReportsFilters } from '@/constants/filters';
import { useAppDispatch, useAppSelector } from '@/features/hooks';
import { getBrokerURLs } from '@/features/slices/brokerSlice';
import { setManageColumnsModal, setPhysicalSettlementReportsFiltersModal } from '@/features/slices/modalSlice';
import { getBrokerIsSelected, getIsLoggedIn } from '@/features/slices/userSlice';
import { type RootState } from '@/features/store';
import { useDebounce, useInputs, useLocalstorage } from '@/hooks';
import { createSelector } from '@reduxjs/toolkit';
import { useTranslations } from 'next-intl';
import dynamic from 'next/dynamic';
import { useMemo } from 'react';
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
			setManageColumnsModal({
				initialColumns: defaultPhysicalSettlementReportsColumns,
				columns: columnsVisibility,
				title: t('physical_settlement_reports_page.manage_columns'),
				onColumnsChanged: (columns) =>
					setColumnsVisibility(
						columns as Array<IManageColumn<PhysicalSettlementReports.TPhysicalSettlementReportsColumns>>,
					),
				onReset: () => setColumnsVisibility(defaultPhysicalSettlementReportsColumns),
			}),
		);
	};

	if (!isLoggedIn || !brokerIsSelected) return <Loading />;

	return (
		<Main>
			<div className='h-full gap-16 rounded bg-white px-24 pt-24 flex-column darkness:bg-gray-50'>
				<div className='flex-justify-between'>
					<Tabs />
					<Toolbar
						filtersCount={filtersCount}
						onShowFilters={onShowFilters}
						onExportExcel={() => setDebounce(onExportExcel, 500)}
						onManageColumns={onManageColumns}
					/>
				</div>

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

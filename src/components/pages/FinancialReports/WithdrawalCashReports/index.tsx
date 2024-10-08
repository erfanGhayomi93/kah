'use client';

import Loading from '@/components/common/Loading';
import Main from '@/components/layout/Main';
import { defaultWithdrawalCashReportsColumn } from '@/constants/columns';
import { initialWithdrawalCashReportsFilters } from '@/constants/filters';
import { useAppDispatch, useAppSelector } from '@/features/hooks';
import { getBrokerURLs } from '@/features/slices/brokerSlice';
import { setManageColumnsModal, setWithdrawalCashReportsFiltersModal } from '@/features/slices/modalSlice';
import { getBrokerIsSelected, getIsLoggedIn } from '@/features/slices/userSlice';
import { type RootState } from '@/features/store';
import { useDebounce, useInputs, useLocalstorage } from '@/hooks';
import { downloadFileQueryParams, toISOStringWithoutChangeTime } from '@/utils/helpers';
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

const WithdrawalCashReports = () => {
	const t = useTranslations();

	const dispatch = useAppDispatch();

	const { inputs, setFieldValue, setFieldsValue } = useInputs<WithdrawalCashReports.WithdrawalCashReportsFilters>(
		initialWithdrawalCashReportsFilters,
	);

	const [columnsVisibility, setColumnsVisibility] = useLocalstorage(
		'withdrawalCash_column',
		defaultWithdrawalCashReportsColumn,
	);

	const { setDebounce } = useDebounce();

	const { brokerIsSelected, isLoggedIn, urls } = useAppSelector(getStates);

	const onShowFilters = () => {
		const params: Partial<WithdrawalCashReports.WithdrawalCashReportsFilters> = {};

		if (inputs.fromPrice) params.fromPrice = inputs.fromPrice;
		if (inputs.toPrice) params.toPrice = inputs.toPrice;
		if (inputs.status) params.status = inputs.status;
		if (inputs.banks) params.banks = inputs.banks;
		if (inputs.date) params.date = inputs.date;

		dispatch(setWithdrawalCashReportsFiltersModal(params));
	};

	const filtersCount = useMemo(() => {
		let badgeCount = 0;

		if (inputs.fromPrice) badgeCount++;

		if (inputs.toPrice) badgeCount++;

		if (Array.isArray(inputs.banks) && inputs.banks.length > 0) badgeCount++;

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
			params.append('StartDate', toISOStringWithoutChangeTime(fromDate));
			params.append('EndDate', toISOStringWithoutChangeTime(toDate));

			if (inputs.fromPrice) params.append('MinAmount', String(inputs.fromPrice));
			if (inputs.toPrice) params.append('MaxAmount', String(inputs.toPrice));

			inputs.status.forEach((st) => params.append('Statuses', st));
			inputs.banks.forEach(({ id }) => params.append('AccountIds', String(id)));

			if (!urls) throw new Error('broker_error');

			downloadFileQueryParams(
				urls.AccountWithdrawalExcel,
				`withdrawal-${fromDate.getFullYear()}${fromDate.getMonth() + 1}${fromDate.getDate()}-${toDate.getFullYear()}${toDate.getMonth() + 1}${toDate.getDate()}.csv`,
				params,
			);
		} catch (e) {
			//
		}
	};

	const onManageColumns = () => {
		dispatch(
			setManageColumnsModal({
				initialColumns: defaultWithdrawalCashReportsColumn,
				columns: columnsVisibility,
				title: t('withdrawal_cash_reports_page.manage_columns'),
				onColumnsChanged: (columns) =>
					setColumnsVisibility(
						columns as Array<IManageColumn<WithdrawalCashReports.TWithdrawalCashReportsColumns>>,
					),
				onReset: () => setColumnsVisibility(defaultWithdrawalCashReportsColumn),
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

export default WithdrawalCashReports;

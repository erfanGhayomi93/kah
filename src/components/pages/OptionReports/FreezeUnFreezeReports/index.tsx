'use client';

import ipcMain from '@/classes/IpcMain';
import Loading from '@/components/common/Loading';
import Main from '@/components/layout/Main';
import { defaultFreezeUnFreezeReportsColumns } from '@/constants/columns';
import { initialFreezeUnFreezeReportsFilters } from '@/constants/filters';
import { useAppDispatch, useAppSelector } from '@/features/hooks';
import { getBrokerURLs } from '@/features/slices/brokerSlice';
import { setFreezeUnFreezeReportsFiltersModal, setManageColumnsModal } from '@/features/slices/modalSlice';
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

const FreezeUnFreezeReports = () => {
	const t = useTranslations();

	const dispatch = useAppDispatch();

	const router = useRouter();

	const { inputs, setFieldValue, setFieldsValue } = useInputs<FreezeUnFreezeReports.IFreezeUnFreezeReportsFilters>(
		initialFreezeUnFreezeReportsFilters,
	);

	const [columnsVisibility, setColumnsVisibility] = useLocalstorage(
		'freezeUnfreeze_column',
		defaultFreezeUnFreezeReportsColumns,
	);

	const { setDebounce } = useDebounce();

	const { brokerIsSelected, isLoggedIn, urls } = useAppSelector(getStates);

	const onShowFilters = () => {
		const params: Partial<FreezeUnFreezeReports.IFreezeUnFreezeReportsFilters> = {};

		if (inputs.symbol) params.symbol = inputs.symbol;
		if (inputs.date) params.date = inputs.date;
		if (inputs.fromDate) params.fromDate = inputs.fromDate;
		if (inputs.toDate) params.toDate = inputs.toDate;
		if (inputs.requestState) params.requestState = inputs.requestState;

		dispatch(setFreezeUnFreezeReportsFiltersModal(params));
	};

	const filtersCount = useMemo(() => {
		let badgeCount = 0;

		if (inputs.symbol) badgeCount++;

		if (Array.isArray(inputs.requestState) && inputs.requestState.length > 0) badgeCount++;

		return badgeCount;
	}, [JSON.stringify(inputs ?? {})]);

	const onExportExcel = () => {
		try {
			if (!urls) throw new Error('broker_error');

			const fromDate: Date = new Date(inputs.fromDate);
			const toDate: Date = new Date(inputs.toDate);

			const params = new URLSearchParams();

			params.append('QueryOption.PageNumber', String(inputs.pageNumber));
			params.append('QueryOption.PageSize', String(inputs.pageSize));
			params.append('DateOption.FromDate', toISOStringWithoutChangeTime(fromDate));
			params.append('DateOption.ToDate', toISOStringWithoutChangeTime(toDate));

			if (inputs.symbol) params.append('SymbolISIN', inputs.symbol.symbolISIN);

			if (inputs.requestState) params.append('RequestState', inputs.requestState);

			downloadFileQueryParams(
				urls.FreezeExportExcel,
				`freezeUnfreeze-${fromDate.getFullYear()}${fromDate.getMonth() + 1}${fromDate.getDate()}-${toDate.getFullYear()}${toDate.getMonth() + 1}${toDate.getDate()}.csv`,
				params,
			);
		} catch (e) {
			//
		}
	};

	const onManageColumns = () => {
		dispatch(
			setManageColumnsModal({
				initialColumns: defaultFreezeUnFreezeReportsColumns,
				columns: columnsVisibility,
				title: t('freeze_and_unfreeze_reports_page.manage_columns'),
				onColumnsChanged: (columns) =>
					setColumnsVisibility(
						columns as Array<IManageColumn<FreezeUnFreezeReports.TFreezeUnFreezeReportsColumns>>,
					),
				onReset: () => setColumnsVisibility(defaultFreezeUnFreezeReportsColumns),
			}),
		);
	};

	useEffect(() => {
		ipcMain.handle('broker:logged_out', () => {
			router.push('/');
		});
	}, []);

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

export default FreezeUnFreezeReports;

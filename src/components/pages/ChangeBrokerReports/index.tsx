'use client';

import ipcMain from '@/classes/IpcMain';
import Loading from '@/components/common/Loading';
import Main from '@/components/layout/Main';
import { defaultChangeBrokerReportsColumns } from '@/constants/columns';
import { initialChangeBrokerReportsFilters } from '@/constants/filters';
import { useAppDispatch, useAppSelector } from '@/features/hooks';
import { getBrokerURLs } from '@/features/slices/brokerSlice';
import { setChangeBrokerReportsFiltersModal, setManageColumnsModal } from '@/features/slices/modalSlice';
import { getBrokerIsSelected, getIsLoggedIn } from '@/features/slices/userSlice';
import { type RootState } from '@/features/store';
import { useDebounce, useInputs, useLocalstorage } from '@/hooks';
import { useRouter } from '@/navigation';
import { downloadFileQueryParams, toISOStringWithoutChangeTime } from '@/utils/helpers';
import { createSelector } from '@reduxjs/toolkit';
import { useTranslations } from 'next-intl';
import dynamic from 'next/dynamic';
import { useEffect, useMemo } from 'react';
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

const ChangeBrokerReports = () => {
	const t = useTranslations();

	const dispatch = useAppDispatch();

	const router = useRouter();

	const { inputs, setFieldValue, setFieldsValue } = useInputs<ChangeBrokerReports.IChangeBrokerReportsFilters>(
		initialChangeBrokerReportsFilters,
	);

	const [columnsVisibility, setColumnsVisibility] = useLocalstorage(
		'changeBroker_column',
		defaultChangeBrokerReportsColumns,
	);

	const { setDebounce } = useDebounce();

	const { brokerIsSelected, isLoggedIn, urls } = useAppSelector(getStates);

	const onShowFilters = () => {
		const params: Partial<ChangeBrokerReports.IChangeBrokerReportsFilters> = {};

		if (inputs.symbol) params.symbol = inputs.symbol;
		if (inputs.fromDate) params.fromDate = inputs.fromDate;
		if (inputs.toDate) params.toDate = inputs.toDate;
		if (inputs.date) params.date = inputs.date;
		if (inputs.attachment) params.attachment = inputs.attachment;
		if (inputs.status) params.status = inputs.status;

		dispatch(setChangeBrokerReportsFiltersModal(params));
	};

	const filtersCount = useMemo(() => {
		let badgeCount = 0;

		if (inputs.symbol) badgeCount++;

		if (inputs.attachment) badgeCount++;

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

			inputs.status.forEach((st) => params.append('Statuses', st));

			if (!urls) throw new Error('broker_error');

			downloadFileQueryParams(
				urls.getChangeBrokerExportFilteredCSV,
				`change-broker-${fromDate.getFullYear()}${fromDate.getMonth() + 1}${fromDate.getDate()}-${toDate.getFullYear()}${toDate.getMonth() + 1}${toDate.getDate()}.csv`,
				params,
			);
		} catch (e) {
			//
		}
	};

	const onManageColumns = () => {
		dispatch(
			setManageColumnsModal({
				initialColumns: defaultChangeBrokerReportsColumns,
				columns: columnsVisibility,
				title: t('change_broker_reports_page.manage_columns'),
				onColumnChanged: (columns) =>
					setColumnsVisibility(
						columns as Array<IManageColumn<ChangeBrokerReports.TChangeBrokerReportsColumns>>,
					),
				onReset: () => setColumnsVisibility(defaultChangeBrokerReportsColumns),
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
		<Main className='darkBlue:bg-gray-50 gap-16 bg-white dark:bg-gray-50'>
			<div className='flex-justify-between'>
				<span className='text-xl font-medium text-gray-500'>{t('change_broker_reports_page.title_page')}</span>
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

export default ChangeBrokerReports;

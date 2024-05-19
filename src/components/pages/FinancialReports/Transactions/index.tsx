'use client';

import Loading from '@/components/common/Loading';
import Main from '@/components/layout/Main';
import { defaultTransactionColumns, initialTransactionsFilters } from '@/constants';
import { useAppDispatch, useAppSelector } from '@/features/hooks';
import { getBrokerURLs } from '@/features/slices/brokerSlice';
import { setTransactionsFiltersModal } from '@/features/slices/modalSlice';
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

const Transactions = () => {
	const t = useTranslations();

	const dispatch = useAppDispatch();

	const router = useRouter();

	const { inputs, setFieldValue, setFieldsValue } =
		useInputs<Transaction.ITransactionsFilters>(initialTransactionsFilters);


	const [columnsVisibility, setColumnsVisibility] = useLocalstorage('transaction_column', defaultTransactionColumns);

	const { setDebounce } = useDebounce();

	const { brokerIsSelected, isLoggedIn, urls } = useAppSelector(getStates);

	const onShowFilters = () => {
		const params: Partial<Transaction.ITransactionsFilters> = {};

		if (inputs.symbol) params.symbol = inputs.symbol;
		if (inputs.fromPrice) params.fromPrice = inputs.fromPrice;
		if (inputs.toPrice) params.toPrice = inputs.toPrice;
		if (inputs.fromDate) params.fromDate = inputs.fromDate;
		if (inputs.toDate) params.toDate = inputs.toDate;
		if (inputs.groupMode) params.groupMode = inputs.groupMode;
		if (inputs.transactionType) params.transactionType = inputs.transactionType;
		if (inputs.date) params.date = inputs.date;

		dispatch(setTransactionsFiltersModal(params));
	};

	const filtersCount = useMemo(() => {
		let badgeCount = 0;

		if (inputs.symbol) badgeCount++;

		if (inputs.fromPrice) badgeCount++;

		if (inputs.toPrice) badgeCount++;

		if (Array.isArray(inputs.transactionType) && inputs.transactionType.length > 0) badgeCount++;

		return badgeCount;
	}, [JSON.stringify(inputs ?? {})]);

	const onExportExcel = () => {
		try {
			const fromDate: Date = new Date(inputs.fromDate);
			const toDate: Date = new Date(inputs.toDate);

			const params = new URLSearchParams();

			params.append('QueryOption.PageNumber', String(inputs.pageNumber));
			params.append('QueryOption.PageSize', String(inputs.pageSize));
			params.append('FromDate', toISOStringWithoutChangeTime(fromDate));
			params.append('ToDate', toISOStringWithoutChangeTime(toDate));
			params.append('GroupMode', String(inputs.groupMode));
			if (inputs.symbol?.symbolISIN) params.append('SymbolISIN', inputs.symbol.symbolISIN);
			if (inputs.fromPrice) params.append('FromPrice', String(inputs.fromPrice));
			if (inputs.toPrice) params.append('ToPrice', String(inputs.toPrice));
			inputs.transactionType.forEach(({ id }) => params.append('TransactionType', id));

			if (!urls) throw new Error('broker_error');

			downloadFileQueryParams(
				urls.getCustomerTurnOverCSVExport,
				`transactions-${fromDate.getFullYear()}${fromDate.getMonth() + 1}${fromDate.getDate()}-${toDate.getFullYear()}${toDate.getMonth() + 1}${toDate.getDate()}.csv`,
				params,
			);
		} catch (e) {
			//
		}
	};

	const onManageColumns = () => {
		dispatch(
			setManageColumnsPanel({
				initialColumns: defaultTransactionColumns,
				columns: columnsVisibility,
				title: t('transactions_page.manage_columns'),
				onColumnChanged: (_, columns) => setColumnsVisibility(columns),
				onReset: () => setColumnsVisibility(defaultTransactionColumns),
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
					setFieldValue={setFieldValue}
					setFieldsValue={setFieldsValue}
				/>
			</div>
		</Main>
	);
};

export default Transactions;

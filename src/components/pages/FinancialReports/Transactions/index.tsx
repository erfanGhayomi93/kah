'use client';

import Loading from '@/components/common/Loading';
import Main from '@/components/layout/Main';
import { defaultTransactionColumns } from '@/constants/columns';
import { initialTransactionsFilters } from '@/constants/filters';
import { useAppDispatch, useAppSelector } from '@/features/hooks';
import { getBrokerURLs } from '@/features/slices/brokerSlice';
import { setManageColumnsModal, setTransactionsFiltersModal } from '@/features/slices/modalSlice';
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

const Transactions = () => {
	const t = useTranslations();

	const dispatch = useAppDispatch();

	const { inputs, setFieldValue, setFieldsValue } =
		useInputs<Transaction.ITransactionsFilters>(initialTransactionsFilters);

	const [columnsVisibility, setColumnsVisibility] = useLocalstorage('transaction_column', defaultTransactionColumns);

	const { setDebounce } = useDebounce();

	const { brokerIsSelected, isLoggedIn, urls } = useAppSelector(getStates);

	const onShowFilters = () => {
		const params: Partial<Transaction.ITransactionsFilters> = {};

		if (inputs.symbol) params.symbol = inputs.symbol;
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
			inputs.transactionType.forEach(({ id }) => params.append('TransactionType', id));

			if (!urls) throw new Error('broker_error');

			downloadFileQueryParams(
				urls.AccountTransactionsExcel,
				`transactions-${fromDate.getFullYear()}${fromDate.getMonth() + 1}${fromDate.getDate()}-${toDate.getFullYear()}${toDate.getMonth() + 1}${toDate.getDate()}.csv`,
				params,
			);
		} catch (e) {
			//
		}
	};

	const onManageColumns = () => {
		dispatch(
			setManageColumnsModal({
				initialColumns: defaultTransactionColumns,
				columns: columnsVisibility,
				title: t('transactions_page.manage_columns'),
				onColumnsChanged: (columns) =>
					setColumnsVisibility(columns as Array<IManageColumn<Transaction.TTransactionColumns>>),
				onReset: () => setColumnsVisibility(defaultTransactionColumns),
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
					setFieldValue={setFieldValue}
					setFieldsValue={setFieldsValue}
				/>
			</div>
		</Main>
	);
};

export default Transactions;

'use client';

import Loading from '@/components/common/Loading';
import Main from '@/components/layout/Main';
import { initialTransactionsFilters } from '@/constants';
import { useAppDispatch, useAppSelector } from '@/features/hooks';
import { setTransactionsFiltersModal } from '@/features/slices/modalSlice';
import { useDebounce, useInputs } from '@/hooks';
import { useRouter } from '@/navigation';
import dynamic from 'next/dynamic';
import { useEffect, useMemo } from 'react';
import Tabs from '../common/Tabs';
import Toolbar from './Toolbar';

const Table = dynamic(() => import('./Table'), {
	ssr: false,
	loading: () => <Loading />,
});

const Transactions = () => {
	const dispatch = useAppDispatch();

	const router = useRouter();

	const { inputs, setFieldValue, setFieldsValue } =
		useInputs<Transaction.ITransactionsFilters>(initialTransactionsFilters);

	const { setDebounce } = useDebounce();

	const { brokerIsSelected, loggedIn } = useAppSelector((state) => state.user);

	const onShowFilters = () => {
		const params: Partial<Transaction.ITransactionsFilters> = {};

		if (inputs.symbol) params.symbol = inputs.symbol;
		if (inputs.fromPrice) params.fromPrice = inputs.fromPrice;
		if (inputs.toPrice) params.toPrice = inputs.toPrice;
		if (inputs.fromDate) params.fromDate = inputs.fromDate;
		if (inputs.toPrice) params.toDate = inputs.toPrice;
		if (inputs.groupMode) params.groupMode = inputs.groupMode;

		dispatch(setTransactionsFiltersModal(params));
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

	useEffect(() => {
		if (!loggedIn || !brokerIsSelected) {
			router.push('/');
		}
	}, []);

	if (!loggedIn || !brokerIsSelected) return <Loading />;

	return (
		<Main className='gap-16 bg-white !pt-16'>
			<div className='flex-justify-between'>
				<Tabs />
				<Toolbar
					filtersCount={filtersCount}
					onShowFilters={onShowFilters}
					// onExportExcel={() => setDebounce(onExportExcel, 500)}
				/>
			</div>

			<div className='relative flex-1 overflow-hidden'>
				<Table filters={inputs} setFilters={setFieldValue} setFieldsValue={setFieldsValue} />
			</div>
		</Main>
	);
};

export default Transactions;

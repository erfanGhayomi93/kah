import { initialTransactionsFilters } from '@/constants/filters';
import { useAppDispatch, useAppSelector } from '@/features/hooks';
import { getTransactionsFiltersModal, setTransactionsFiltersModal } from '@/features/slices/modalSlice';
import { type ITransactionsFiltersModal } from '@/features/slices/types/modalSlice.interfaces';
import { useTranslations } from 'next-intl';
import { forwardRef, useState } from 'react';
import styled from 'styled-components';
import Modal, { Header } from '../Modal';
import Form from './Form';

const Div = styled.div`
	width: 560px;
`;

interface TransactionsFiltersModalProps extends IBaseModalConfiguration {}

const TransactionsFiltersModal = forwardRef<HTMLDivElement, TransactionsFiltersModalProps>((props, ref) => {
	const t = useTranslations();

	const dispatch = useAppDispatch();

	const initialModalFilters = useAppSelector(getTransactionsFiltersModal) as Partial<ITransactionsFiltersModal>;

	const [filters, setFilters] = useState<Omit<Transaction.ITransactionsFilters, 'pageNumber' | 'pageSize'>>({
		symbol: initialModalFilters?.symbol ?? initialTransactionsFilters.symbol,
		date: initialModalFilters?.date ?? initialTransactionsFilters.date,
		fromDate: initialModalFilters?.fromDate ?? initialTransactionsFilters.fromDate,
		toDate: initialModalFilters?.toDate ?? initialTransactionsFilters.toDate,
		fromPrice: initialModalFilters?.fromPrice ?? initialTransactionsFilters.fromPrice,
		toPrice: initialModalFilters?.toPrice ?? initialTransactionsFilters.toPrice,
		groupMode: initialModalFilters?.groupMode ?? initialTransactionsFilters.groupMode,
		transactionType: initialModalFilters?.transactionType ?? initialTransactionsFilters.transactionType,
	});

	const onCloseModal = () => {
		dispatch(setTransactionsFiltersModal(null));
	};

	const onClear = () => {
		setFilters(initialTransactionsFilters);
	};

	return (
		<Modal transparent top='14%' onClose={onCloseModal} {...props} ref={ref}>
			<Div className='darkBlue:bg-gray-50 gap-40 bg-white flex-column dark:bg-gray-50'>
				<Header label={t('transactions_page.filter_title_modal')} onClose={onCloseModal} onClear={onClear} />
				<Form filters={filters} setFilters={setFilters} />
			</Div>
		</Modal>
	);
});

export default TransactionsFiltersModal;

import { initialWithdrawalCashReportsFilters } from '@/constants/filters';
import { useAppDispatch, useAppSelector } from '@/features/hooks';
import {
	getWithdrawalCashReportsFiltersModal,
	setWithdrawalCashReportsFiltersModal,
} from '@/features/slices/modalSlice';
import { type IWithdrawalCashReportsFiltersModal } from '@/features/slices/types/modalSlice.interfaces';
import { useTranslations } from 'next-intl';
import { forwardRef, useState } from 'react';
import styled from 'styled-components';
import Modal, { Header } from '../Modal';
import Form from './Form';

const Div = styled.div`
	width: 560px;
`;

interface WithdrawalCashFiltersModalProps extends IBaseModalConfiguration {}

const WithdrawalCashFiltersModal = forwardRef<HTMLDivElement, WithdrawalCashFiltersModalProps>((props, ref) => {
	const t = useTranslations();

	const dispatch = useAppDispatch();

	const initialModalFilters = useAppSelector(
		getWithdrawalCashReportsFiltersModal,
	) as Partial<IWithdrawalCashReportsFiltersModal>;

	const [filters, setFilters] = useState<
		Omit<WithdrawalCashReports.WithdrawalCashReportsFilters, 'pageNumber' | 'pageSize'>
	>({
		date: initialModalFilters?.date ?? initialWithdrawalCashReportsFilters.date,
		fromDate: initialModalFilters?.fromDate ?? initialWithdrawalCashReportsFilters.fromDate,
		toDate: initialModalFilters?.toDate ?? initialWithdrawalCashReportsFilters.toDate,
		fromPrice: initialModalFilters?.fromPrice ?? initialWithdrawalCashReportsFilters.fromPrice,
		toPrice: initialModalFilters?.toPrice ?? initialWithdrawalCashReportsFilters.toPrice,
		banks: initialModalFilters?.banks ?? initialWithdrawalCashReportsFilters.banks,
		status: initialModalFilters?.status ?? initialWithdrawalCashReportsFilters.status,
	});

	const onCloseModal = () => {
		dispatch(setWithdrawalCashReportsFiltersModal(null));
	};

	const onClear = () => {
		setFilters(initialWithdrawalCashReportsFilters);
	};

	return (
		<Modal transparent top='14%' onClose={onCloseModal} {...props} ref={ref}>
			<Div className='gap-40 bg-white flex-column darkBlue:bg-gray-50 dark:bg-gray-50'>
				<Header
					label={t('withdrawal_cash_reports_page.filter_title_modal')}
					onClose={onCloseModal}
					onClear={onClear}
				/>
				<Form filters={filters} setFilters={setFilters} />
			</Div>
		</Modal>
	);
});

export default WithdrawalCashFiltersModal;

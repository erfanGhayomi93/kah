import { initialDepositWithReceiptReportsFilters } from '@/constants';
import { useAppDispatch, useAppSelector } from '@/features/hooks';
import {
	getDepositWithReceiptReportsFiltersModal,
	setDepositWithReceiptReportsFiltersModal,
} from '@/features/slices/modalSlice';
import { type IDepositWithReceiptReportsFiltersModal } from '@/features/slices/types/modalSlice.interfaces';
import { useTranslations } from 'next-intl';
import { forwardRef, useState } from 'react';
import styled from 'styled-components';
import Modal, { Header } from '../Modal';
import Form from './Form';

const Div = styled.div`
	width: 560px;
`;

interface DepositWithReceiptFiltersModalProps extends IBaseModalConfiguration { }

const DepositWithReceiptFiltersModal = forwardRef<HTMLDivElement, DepositWithReceiptFiltersModalProps>((props, ref) => {
	const t = useTranslations();

	const dispatch = useAppDispatch();

	const initialModalFilters = useAppSelector(
		getDepositWithReceiptReportsFiltersModal,
	) as Partial<IDepositWithReceiptReportsFiltersModal>;

	const [filters, setFilters] = useState<
		Omit<DepositWithReceiptReports.DepositWithReceiptReportsFilters, 'pageNumber' | 'pageSize'>
	>({
		date: initialModalFilters?.date ?? initialDepositWithReceiptReportsFilters.date,
		fromDate: initialModalFilters?.fromDate ?? initialDepositWithReceiptReportsFilters.fromDate,
		toDate: initialModalFilters?.toDate ?? initialDepositWithReceiptReportsFilters.toDate,
		fromPrice: initialModalFilters?.fromPrice ?? initialDepositWithReceiptReportsFilters.fromPrice,
		toPrice: initialModalFilters?.toPrice ?? initialDepositWithReceiptReportsFilters.toPrice,
		status: initialModalFilters?.status ?? initialDepositWithReceiptReportsFilters.status,
		attachment: initialModalFilters?.attachment ?? initialDepositWithReceiptReportsFilters.attachment,
		receiptNumber: initialModalFilters?.receiptNumber ?? initialDepositWithReceiptReportsFilters.receiptNumber,
	});

	const onCloseModal = () => {
		dispatch(setDepositWithReceiptReportsFiltersModal(null));
	};

	const onClear = () => {
		setFilters(initialDepositWithReceiptReportsFilters);
	};

	return (
		<Modal transparent top='14%' onClose={onCloseModal} {...props} ref={ref}>
			<Div className='gap-40 bg-white flex-column'>
				<Header
					label={t('deposit_with_receipt_reports_page.filter_title_modal')}
					onClose={onCloseModal}
					onClear={onClear}
				/>
				<Form filters={filters} setFilters={setFilters} />
			</Div>
		</Modal>
	);
});

export default DepositWithReceiptFiltersModal;

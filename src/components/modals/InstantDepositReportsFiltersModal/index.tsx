import { initialInstantDepositReportsFilters } from '@/constants';
import { useAppDispatch, useAppSelector } from '@/features/hooks';
import {
	getInstantDepositReportsFiltersModal,
	setInstantDepositReportsFiltersModal,
} from '@/features/slices/modalSlice';
import { type IInstantDepositReportsFiltersModal } from '@/features/slices/types/modalSlice.interfaces';
import { useTranslations } from 'next-intl';
import { forwardRef, useState } from 'react';
import styled from 'styled-components';
import Modal, { Header } from '../Modal';
import Form from './Form';

const Div = styled.div`
	width: 560px;
`;

interface InstantDepositReportsFiltersModalProps extends IBaseModalConfiguration {}

const InstantDepositFiltersModal = forwardRef<HTMLDivElement, InstantDepositReportsFiltersModalProps>((props, ref) => {
	const t = useTranslations();

	const dispatch = useAppDispatch();

	const initialModalFilters = useAppSelector(
		getInstantDepositReportsFiltersModal,
	) as Partial<IInstantDepositReportsFiltersModal>;

	const [filters, setFilters] = useState<
		Omit<InstantDepositReports.IInstantDepositReportsFilters, 'pageNumber' | 'pageSize'>
	>({
		date: initialModalFilters?.date ?? initialInstantDepositReportsFilters.date,
		fromDate: initialModalFilters?.fromDate ?? initialInstantDepositReportsFilters.fromDate,
		toDate: initialModalFilters?.toDate ?? initialInstantDepositReportsFilters.toDate,
		fromPrice: initialModalFilters?.fromPrice ?? initialInstantDepositReportsFilters.fromPrice,
		toPrice: initialModalFilters?.toPrice ?? initialInstantDepositReportsFilters.toPrice,
		providers: initialModalFilters?.providers ?? initialInstantDepositReportsFilters.providers,
		status: initialModalFilters?.status ?? initialInstantDepositReportsFilters.status,
	});

	const onCloseModal = () => {
		dispatch(setInstantDepositReportsFiltersModal(null));
	};

	const onClear = () => {
		setFilters(initialInstantDepositReportsFilters);
	};

	return (
		<Modal transparent top='14%' onClose={onCloseModal} {...props} ref={ref}>
			<Div className='gap-40 bg-white flex-column'>
				<Header
					label={t('instant_deposit_reports_page.filter_title_modal')}
					onClose={onCloseModal}
					onClear={onClear}
				/>
				<Form filters={filters} setFilters={setFilters} />
			</Div>
		</Modal>
	);
});

export default InstantDepositFiltersModal;

import { initialFreezeUnFreezeReportsFilters, initialTransactionsFilters } from '@/constants/filters';
import { useAppDispatch, useAppSelector } from '@/features/hooks';
import {
	getFreezeUnFreezeReportsFiltersModal,
	setFreezeUnFreezeReportsFiltersModal,
} from '@/features/slices/modalSlice';
import { type IFreezeUnFreezeReportsFiltersModal } from '@/features/slices/types/modalSlice.interfaces';
import { useTranslations } from 'next-intl';
import { forwardRef, useState } from 'react';
import styled from 'styled-components';
import Modal, { Header } from '../Modal';
import Form from './Form';

const Div = styled.div`
	width: 560px;
`;

interface FreezeUnFreezeReportsFiltersModalProps extends IBaseModalConfiguration {}

const FreezeUnFreezeReportsFiltersModal = forwardRef<HTMLDivElement, FreezeUnFreezeReportsFiltersModalProps>(
	(props, ref) => {
		const t = useTranslations();

		const dispatch = useAppDispatch();

		const initialModalFilters = useAppSelector(
			getFreezeUnFreezeReportsFiltersModal,
		) as Partial<IFreezeUnFreezeReportsFiltersModal>;

		const [filters, setFilters] = useState<
			Omit<FreezeUnFreezeReports.IFreezeUnFreezeReportsFilters, 'pageNumber' | 'pageSize'>
		>({
			symbol: initialModalFilters?.symbol ?? initialFreezeUnFreezeReportsFilters.symbol,
			date: initialModalFilters?.date ?? initialTransactionsFilters.date,
			fromDate: initialModalFilters?.fromDate ?? initialTransactionsFilters.fromDate,
			toDate: initialModalFilters?.toDate ?? initialTransactionsFilters.toDate,
			requestState: initialModalFilters?.requestState ?? initialFreezeUnFreezeReportsFilters.requestState,
		});
		const onCloseModal = () => {
			dispatch(setFreezeUnFreezeReportsFiltersModal(null));
		};

		const onClear = () => {
			setFilters(initialFreezeUnFreezeReportsFilters);
		};

		return (
			<Modal transparent top='14%' onClose={onCloseModal} {...props} ref={ref}>
				<Div className='gap-40 bg-white flex-column'>
					<Header
						label={t('freeze_and_unfreeze_reports_page.filter_title_modal')}
						onClose={onCloseModal}
						onClear={onClear}
					/>
					<Form filters={filters} setFilters={setFilters} />
				</Div>
			</Modal>
		);
	},
);

export default FreezeUnFreezeReportsFiltersModal;

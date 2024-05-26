import { initialChangeBrokerReportsFilters } from '@/constants';
import { useAppDispatch, useAppSelector } from '@/features/hooks';
import { getChangeBrokerReportsFiltersModal, setChangeBrokerReportsFiltersModal } from '@/features/slices/modalSlice';
import { type IChangeBrokerReportsFiltersModal } from '@/features/slices/types/modalSlice.interfaces';
import { useTranslations } from 'next-intl';
import { forwardRef, useState } from 'react';
import styled from 'styled-components';
import Modal, { Header } from '../Modal';
import Form from './Form';

const Div = styled.div`
	width: 560px;
`;

interface ChangeBrokerReportsFiltersModalProps extends IBaseModalConfiguration {}

const ChangeBrokerReportsFiltersModal = forwardRef<HTMLDivElement, ChangeBrokerReportsFiltersModalProps>(
	(props, ref) => {
		const t = useTranslations();

		const dispatch = useAppDispatch();

		const initialModalFilters = useAppSelector(
			getChangeBrokerReportsFiltersModal,
		) as Partial<IChangeBrokerReportsFiltersModal>;

		const [filters, setFilters] = useState<
			Omit<ChangeBrokerReports.IChangeBrokerReportsFilters, 'pageNumber' | 'pageSize'>
		>({
			symbol: initialModalFilters?.symbol ?? initialChangeBrokerReportsFilters.symbol,
			date: initialModalFilters?.date ?? initialChangeBrokerReportsFilters.date,
			fromDate: initialModalFilters?.fromDate ?? initialChangeBrokerReportsFilters.fromDate,
			toDate: initialModalFilters?.toDate ?? initialChangeBrokerReportsFilters.toDate,
			attachment: initialModalFilters?.attachment ?? initialChangeBrokerReportsFilters.attachment,
			status: initialModalFilters?.status ?? initialChangeBrokerReportsFilters.status,
		});

		const onCloseModal = () => {
			dispatch(setChangeBrokerReportsFiltersModal(null));
		};

		const onClear = () => {
			setFilters(initialChangeBrokerReportsFilters);
		};

		return (
			<Modal transparent top='14%' onClose={onCloseModal} {...props} ref={ref}>
				<Div className='gap-40 bg-white flex-column'>
					<Header
						label={t('change_broker_reports_page.filter_title_modal')}
						onClose={onCloseModal}
						onClear={onClear}
					/>
					<Form filters={filters} setFilters={setFilters} />
				</Div>
			</Modal>
		);
	},
);

export default ChangeBrokerReportsFiltersModal;

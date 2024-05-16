import { initialCashSettlementReportsFilters, initialPhysicalSettlementReportsFilters } from '@/constants';
import { useAppDispatch, useAppSelector } from '@/features/hooks';
import { getPhysicalSettlementReportsFiltersModal, setPhysicalSettlementReportsFiltersModal } from '@/features/slices/modalSlice';
import { type IPhysicalSettlementReportsFilters } from '@/features/slices/types/modalSlice.interfaces';
import { useTranslations } from 'next-intl';
import { forwardRef, useState } from 'react';
import styled from 'styled-components';
import Modal, { Header } from '../Modal';
import Form from './Form';

const Div = styled.div`
	width: 560px;
`;

interface PhysicalSettlementReportsFiltersModalProps extends IBaseModalConfiguration { }

const PhysicalSettlementReportsFiltersModal = forwardRef<HTMLDivElement, PhysicalSettlementReportsFiltersModalProps>((props, ref) => {
	const t = useTranslations();

	const dispatch = useAppDispatch();

	const initialModalFilters = useAppSelector(getPhysicalSettlementReportsFiltersModal) as Partial<IPhysicalSettlementReportsFilters>;

	const [filters, setFilters] = useState<Omit<PhysicalSettlementReports.IPhysicalSettlementReportsFilters, 'pageNumber' | 'pageSize'>>({
		symbol: initialModalFilters?.symbol ?? initialCashSettlementReportsFilters.symbol,
		date: initialModalFilters?.date ?? initialCashSettlementReportsFilters.date,
		fromDate: initialModalFilters?.fromDate ?? initialCashSettlementReportsFilters.fromDate,
		toDate: initialModalFilters?.toDate ?? initialCashSettlementReportsFilters.toDate,
		contractStatus: initialModalFilters?.contractStatus ?? initialCashSettlementReportsFilters.contractStatus,
		settlementRequestType: initialModalFilters?.settlementRequestType ?? initialCashSettlementReportsFilters.settlementRequestType,
		requestStatus: initialModalFilters?.requestStatus ?? initialCashSettlementReportsFilters.requestStatus
	});
	const onCloseModal = () => {
		dispatch(setPhysicalSettlementReportsFiltersModal(null));
	};

	const onClear = () => {
		setFilters(initialPhysicalSettlementReportsFilters);
	};

	return (
		<Modal transparent top='14%' onClose={onCloseModal} {...props} ref={ref}>
			<Div className='gap-40 bg-white flex-column'>
				<Header
					label={t('physical_settlement_reports_page.filter_title_modal')}
					onClose={onCloseModal}
					onClear={onClear}
				/>
				<Form filters={filters} setFilters={setFilters} />
			</Div>
		</Modal>
	);
});

export default PhysicalSettlementReportsFiltersModal;

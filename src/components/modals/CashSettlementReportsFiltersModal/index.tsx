import { initialCashSettlementReportsFilters } from '@/constants';
import { useAppDispatch, useAppSelector } from '@/features/hooks';
import {
	getCashSettlementReportsFiltersModal,
	setCashSettlementReportsFiltersModal,
} from '@/features/slices/modalSlice';
import { type ICashSettlementReportsFilters } from '@/features/slices/types/modalSlice.interfaces';
import { useTranslations } from 'next-intl';
import { forwardRef, useState } from 'react';
import styled from 'styled-components';
import Modal, { Header } from '../Modal';
import Form from './Form';

const Div = styled.div`
	width: 560px;
`;

interface CashSettlementReportsFiltersModalProps extends IBaseModalConfiguration {}

const CashSettlementReportsFiltersModal = forwardRef<HTMLDivElement, CashSettlementReportsFiltersModalProps>(
	(props, ref) => {
		const t = useTranslations();

		const dispatch = useAppDispatch();

		const initialModalFilters = useAppSelector(
			getCashSettlementReportsFiltersModal,
		) as Partial<ICashSettlementReportsFilters>;

		const [filters, setFilters] = useState<
			Omit<CashSettlementReports.ICashSettlementReportsFilters, 'pageNumber' | 'pageSize'>
		>({
			symbol: initialModalFilters?.symbol ?? initialCashSettlementReportsFilters.symbol,
			date: initialModalFilters?.date ?? initialCashSettlementReportsFilters.date,
			fromDate: initialModalFilters?.fromDate ?? initialCashSettlementReportsFilters.fromDate,
			toDate: initialModalFilters?.toDate ?? initialCashSettlementReportsFilters.toDate,
			contractStatus: initialModalFilters?.contractStatus ?? initialCashSettlementReportsFilters.contractStatus,
			settlementRequestType:
				initialModalFilters?.settlementRequestType ?? initialCashSettlementReportsFilters.settlementRequestType,
			requestStatus: initialModalFilters?.requestStatus ?? initialCashSettlementReportsFilters.requestStatus,
		});
		const onCloseModal = () => {
			dispatch(setCashSettlementReportsFiltersModal(null));
		};

		const onClear = () => {
			setFilters(initialCashSettlementReportsFilters);
		};

		return (
			<Modal transparent top='14%' onClose={onCloseModal} {...props} ref={ref}>
				<Div className='gap-40 bg-white flex-column'>
					<Header
						label={t('cash_settlement_reports_page.filter_title_modal')}
						onClose={onCloseModal}
						onClear={onClear}
					/>
					<Form filters={filters} setFilters={setFilters} />
				</Div>
			</Modal>
		);
	},
);

export default CashSettlementReportsFiltersModal;

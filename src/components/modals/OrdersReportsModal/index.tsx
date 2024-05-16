import { initialOrdersReportsFilters } from '@/constants';
import { useAppDispatch, useAppSelector } from '@/features/hooks';
import { getOrdersReportsFiltersModal, setOrdersReportsFiltersModal } from '@/features/slices/modalSlice';
import { type IOrdersReportsFilters } from '@/features/slices/types/modalSlice.interfaces';
import { useTranslations } from 'next-intl';
import { forwardRef, useState } from 'react';
import styled from 'styled-components';
import Modal, { Header } from '../Modal';
import Form from './Form';

const Div = styled.div`
	width: 560px;
`;

interface OrdersFiltersModalProps extends IBaseModalConfiguration { }

const OrdersReportsFiltersModal = forwardRef<HTMLDivElement, OrdersFiltersModalProps>((props, ref) => {
	const t = useTranslations();

	const dispatch = useAppDispatch();

	const initialModalFilters = useAppSelector(getOrdersReportsFiltersModal) as Partial<IOrdersReportsFilters>;

	const [filters, setFilters] = useState<Omit<OrdersReports.IOrdersReportsFilters, 'pageNumber' | 'pageSize'>>({
		symbol: initialModalFilters?.symbol ?? initialOrdersReportsFilters.symbol,
		date: initialModalFilters?.date ?? initialOrdersReportsFilters.date,
		fromDate: initialModalFilters?.fromDate ?? initialOrdersReportsFilters.fromDate,
		toDate: initialModalFilters?.toDate ?? initialOrdersReportsFilters.toDate,
		side: initialModalFilters?.side ?? initialOrdersReportsFilters.side,
		status: initialModalFilters?.status ?? initialOrdersReportsFilters.status
	});

	const onCloseModal = () => {
		dispatch(setOrdersReportsFiltersModal(null));
	};

	const onClear = () => {
		setFilters(initialOrdersReportsFilters);
	};

	return (
		<Modal transparent top='14%' onClose={onCloseModal} {...props} ref={ref}>
			<Div className='gap-40 bg-white flex-column'>
				<Header
					label={t('orders_reports_page.filter_title_modal')}
					onClose={onCloseModal}
					onClear={onClear}
				/>
				<Form filters={filters} setFilters={setFilters} />
			</Div>
		</Modal>
	);
});

export default OrdersReportsFiltersModal;

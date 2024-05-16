import { initialTradesReportsFilters } from '@/constants';
import { useAppDispatch, useAppSelector } from '@/features/hooks';
import { getTradesReportsFiltersModal, setTradesReportsFiltersModal } from '@/features/slices/modalSlice';
import { type ITradesReportsFilters } from '@/features/slices/types/modalSlice.interfaces';
import { useTranslations } from 'next-intl';
import { forwardRef, useState } from 'react';
import styled from 'styled-components';
import Modal, { Header } from '../Modal';
import Form from './Form';

const Div = styled.div`
	width: 560px;
`;

interface TradeReportsFiltersModalProps extends IBaseModalConfiguration { }

const TradeReportsFiltersModal = forwardRef<HTMLDivElement, TradeReportsFiltersModalProps>((props, ref) => {
	const t = useTranslations();

	const dispatch = useAppDispatch();

	const initialModalFilters = useAppSelector(getTradesReportsFiltersModal) as Partial<ITradesReportsFilters>;

	const [filters, setFilters] = useState<Omit<TradesReports.ITradesReportsFilters, 'pageNumber' | 'pageSize'>>({
		symbol: initialModalFilters?.symbol ?? initialTradesReportsFilters.symbol,
		date: initialModalFilters?.date ?? initialTradesReportsFilters.date,
		fromDate: initialModalFilters?.fromDate ?? initialTradesReportsFilters.fromDate,
		toDate: initialModalFilters?.toDate ?? initialTradesReportsFilters.toDate,
		side: initialModalFilters?.side ?? initialTradesReportsFilters.side,
	});

	const onCloseModal = () => {
		dispatch(setTradesReportsFiltersModal(null));
	};

	const onClear = () => {
		setFilters(initialTradesReportsFilters);
	};

	return (
		<Modal transparent top='14%' onClose={onCloseModal} {...props} ref={ref}>
			<Div className='gap-40 bg-white flex-column'>
				<Header
					label={t('trades_reports_page.filter_title_modal')}
					onClose={onCloseModal}
					onClear={onClear}
				/>
				<Form filters={filters} setFilters={setFilters} />
			</Div>
		</Modal>
	);
});

export default TradeReportsFiltersModal;

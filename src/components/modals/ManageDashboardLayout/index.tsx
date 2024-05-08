import Switch from '@/components/common/Inputs/Switch';
import { useAppDispatch, useAppSelector } from '@/features/hooks';
import { setManageDashboardLayoutModal } from '@/features/slices/modalSlice';
import { type IManageDashboardLayoutModal } from '@/features/slices/types/modalSlice.interfaces';
import { getDashboardGridLayout, setDashboardGridLayout } from '@/features/slices/uiSlice';
import { useTranslations } from 'next-intl';
import { forwardRef, useMemo, useState } from 'react';
import styled from 'styled-components';
import Modal, { Header } from '../Modal';

const Div = styled.div`
	width: 400px;
	display: flex;
	flex-direction: column;
`;

interface ManageDashboardLayoutProps extends IManageDashboardLayoutModal {}

const ManageDashboardLayout = forwardRef<HTMLDivElement, ManageDashboardLayoutProps>((props, ref) => {
	const t = useTranslations();

	const dispatch = useAppDispatch();

	const grid = useAppSelector(getDashboardGridLayout);

	const [visibleItems, setVisibleItems] = useState(
		Object.fromEntries(grid.map((item) => [item.id, !item.hidden])) as Record<TDashboardSections, boolean>,
	);

	const onCloseModal = () => {
		dispatch(setManageDashboardLayoutModal(null));
	};

	const onChange = (id: TDashboardSections, v: boolean) => {
		setVisibleItems((prev) => ({
			...prev,
			[id]: v,
		}));
	};

	const onSubmit = () => {
		const newGrid = grid.map((item) => ({
			...item,
			hidden: !visibleItems[item.id],
		}));

		dispatch(setDashboardGridLayout(newGrid));

		onCloseModal();
	};

	const items = useMemo<Array<{ id: TDashboardSections; title: string }>>(
		() => [
			{ id: 'market_view', title: t('home.market_view') },
			{ id: 'market_state', title: t('home.market_state') },
			{ id: 'best', title: t('home.best') },
			{ id: 'user_progress_bar', title: t('home.user_progress_bar') },
			{ id: 'compare_transaction_value', title: t('home.compare_transaction_value') },
			{ id: 'option_contracts', title: t('home.option_contracts') },
			{ id: 'option_trades_value', title: t('home.option_trades_value') },
			{ id: 'option_market_process', title: t('home.option_market_process') },
			{ id: 'individual_and_legal', title: t('home.individual_and_legal') },
			{ id: 'price_changes_watchlist', title: t('home.price_changes_watchlist') },
			{ id: 'open_positions_process', title: t('home.open_positions_process') },
			{ id: 'new_and_old', title: t('home.new_and_old') },
			{ id: 'top_base_assets', title: t('home.top_base_assets') },
			{ id: 'due_dates', title: t('home.due_dates') },
			{ id: 'meetings', title: t('home.meetings') },
			{ id: 'recent_activities', title: t('home.recent_activities') },
		],
		[visibleItems],
	);

	return (
		<Modal
			top='50%'
			style={{ modal: { transform: 'translate(-50%, -50%)' } }}
			ref={ref}
			onClose={onCloseModal}
			{...props}
		>
			<Div className='bg-white flex-column'>
				<Header label={t('manage_dashboard_layout_modal.title')} onClose={onCloseModal} />

				<div className='flex-1 justify-between gap-16 p-16 flex-column'>
					<ul className='flex-1 flex-column'>
						{items.map((item) => (
							<li key={item.id} className='h-40 flex-justify-between'>
								<span className='text-gray-1000'>{item.title}</span>
								<Switch
									checked={Boolean(visibleItems[item.id])}
									onChange={(v) => onChange(item.id, v)}
								/>
							</li>
						))}
					</ul>

					<button
						type='button'
						onClick={onSubmit}
						style={{ flex: '0 0 4rem' }}
						className='rounded flex-justify-center btn-primary'
					>
						{t('common.confirm')}
					</button>
				</div>
			</Div>
		</Modal>
	);
});

export default ManageDashboardLayout;

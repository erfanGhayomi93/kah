import Switch from '@/components/common/Inputs/Switch';
import { initialDashboardGridState } from '@/constants';
import { useAppDispatch, useAppSelector } from '@/features/hooks';
import { setManageDashboardLayoutModal } from '@/features/slices/modalSlice';
import { type IManageDashboardLayoutModal } from '@/features/slices/types/modalSlice.interfaces';
import { getDashboardGridLayout, setDashboardGridLayout } from '@/features/slices/uiSlice';
import { useTranslations } from 'next-intl';
import { forwardRef, useMemo, useState } from 'react';
import styled from 'styled-components';
import Modal, { Header } from '../Modal';

const Div = styled.div`
	width: 570px;
	display: flex;
	flex-direction: column;
`;

interface ILayoutItem {
	id: TDashboardSections;
	title: string;
}

interface ListProps {
	data: ILayoutItem[];
	checked: (id: TDashboardSections) => boolean;
	onChange: (id: TDashboardSections, v: boolean) => void;
}

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

	const onResetModal = () => {
		setVisibleItems(initialDashboardGridState);
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

	const [items1, items2] = useMemo<[ILayoutItem[], ILayoutItem[]]>(
		() => [
			[
				{ id: 'market_view', title: t('home.market_view') },
				{ id: 'market_state', title: t('home.market_state') },
				{ id: 'best', title: t('home.best') },
				{ id: 'option_contracts', title: t('home.option_contracts') },
				{ id: 'compare_transaction_value', title: t('home.compare_transaction_value') },
				{ id: 'option_market_process', title: t('home.option_market_process') },
				{ id: 'option_trades_value', title: t('home.option_trades_value') },
				{ id: 'open_positions_process', title: t('home.open_positions_process') },
			],
			[
				{ id: 'individual_and_legal', title: t('home.individual_and_legal') },
				{ id: 'price_changes_watchlist', title: t('home.price_changes_watchlist') },
				{ id: 'new_and_old', title: t('home.new_and_old') },
				{ id: 'top_base_assets', title: t('home.top_base_assets') },
				{ id: 'due_dates', title: t('home.due_dates') },
				{ id: 'meetings', title: t('home.meetings') },
				{ id: 'recent_activities', title: t('home.recent_activities') },
				// { id: 'user_progress_bar', title: t('home.user_progress_bar') },
			],
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
				<Header
					onReset={onResetModal}
					label={t('manage_dashboard_layout_modal.title')}
					onClose={onCloseModal}
				/>

				<div className='flex-1 justify-between gap-24 p-24 flex-column'>
					<div className='flex gap-24 rounded bg-white p-8 shadow-card'>
						<List
							data={items1}
							checked={(id) => Boolean(visibleItems[id])}
							onChange={(id, v) => onChange(id, v)}
						/>
						<List
							data={items2}
							checked={(id) => Boolean(visibleItems[id])}
							onChange={(id, v) => onChange(id, v)}
						/>
					</div>

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

const List = ({ data, checked, onChange }: ListProps) => (
	<ul className='flex-1 flex-column'>
		{data.map((item) => (
			<li key={item.id} className='h-40 flex-justify-between'>
				<span className='text-gray-1000'>{item.title}</span>
				<Switch checked={checked(item.id)} onChange={(v) => onChange(item.id, v)} />
			</li>
		))}
	</ul>
);

export default ManageDashboardLayout;

import Switch from '@/components/common/Inputs/Switch';
import { useAppDispatch } from '@/features/hooks';
import { setManageDashboardLayoutModal } from '@/features/slices/modalSlice';
import { type IManageDashboardLayoutModal } from '@/features/slices/modalSlice.interfaces';
import { useTranslations } from 'next-intl';
import { forwardRef, useMemo } from 'react';
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

	const onCloseModal = () => {
		dispatch(setManageDashboardLayoutModal(null));
	};

	const onChange = (id: TDashboardSections, v: boolean) => {
		//
	};

	const items = useMemo<Array<{ id: TDashboardSections; title: string; checked: boolean }>>(
		() => [
			{ id: 'market_view', title: t('home.market_view'), checked: true },
			{ id: 'market_state', title: t('home.market_state'), checked: true },
			{ id: 'best', title: t('home.best'), checked: true },
			{ id: 'user_progress_bar', title: t('home.user_progress_bar'), checked: true },
			{ id: 'compare_transaction_value', title: t('home.compare_transaction_value'), checked: true },
			{ id: 'option_contracts', title: t('home.option_contracts'), checked: true },
			{ id: 'option_trades_value', title: t('home.option_trades_value'), checked: true },
			{ id: 'option_market_process', title: t('home.option_market_process'), checked: true },
			{ id: 'individual_and_legal', title: t('home.individual_and_legal'), checked: true },
			{ id: 'price_changes_watchlist', title: t('home.price_changes_watchlist'), checked: true },
			{ id: 'open_positions_process', title: t('home.open_positions_process'), checked: true },
			{ id: 'meetings', title: t('home.meetings'), checked: true },
			{ id: 'new_and_old', title: t('home.new_and_old'), checked: true },
			{ id: 'top_base_assets', title: t('home.top_base_assets'), checked: true },
			{ id: 'recent_activities', title: t('home.recent_activities'), checked: true },
			{ id: 'due_dates', title: t('home.due_dates'), checked: true },
		],
		[],
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
								<Switch checked={item.checked} onChange={(v) => onChange(item.id, v)} />
							</li>
						))}
					</ul>

					<button
						style={{ flex: '0 0 4rem' }}
						type='button'
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

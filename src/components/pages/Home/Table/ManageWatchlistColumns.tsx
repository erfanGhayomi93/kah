import { XSVG } from '@/components/icons';
import { useAppDispatch, useAppSelector } from '@/features/hooks';
import { getManageOptionColumns, toggleManageOptionColumns } from '@/features/slices/uiSlice';
import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
	position: fixed;
	width: 47.2rem;
	height: calc(100% - 12.4rem);
	top: 8rem;
	left: 0;
	gap: 2.4rem;
	display: flex;
	flex-direction: column;
	border-radius: 0 1.6rem 1.6rem 0;
	padding: 1.6rem 0;
	box-shadow: 0px 2px 10px 1px rgba(0, 0, 0, 0.2);
	transform: translateX(-100%);
	-webkit-transform: translateX(-100%);
	-moz-transform: translateX(-100%);
`;

const Button = styled.button`
	display: flex;
	justify-content: center;
	align-items: center;
	width: 12rem;
	font-weight: 500;
	height: 4rem;
	border-radius: 0.8rem;
`;

const ManageWatchlistColumns = () => {
	const t = useTranslations();

	const dispatch = useAppDispatch();

	const isEnable = useAppSelector(getManageOptionColumns);

	const [rendered, setRendered] = useState(false);

	const [columns, setColumns] = useState<
		Array<{ id: string; title: string; items: Array<{ id: string; title: string; hide: boolean }> }>
	>([
		{
			id: 'symbol_info',
			title: t('manage_option_watchlist_columns.symbol_info'),
			items: [
				{ id: 'column_symbol', title: t('manage_option_watchlist_columns.column_symbol'), hide: true },
				{ id: 'column_days_left', title: t('manage_option_watchlist_columns.column_days_left'), hide: false },
				{ id: 'column_price_applied', title: t('manage_option_watchlist_columns.column_price_applied'), hide: true },
				{ id: 'column_option_full_name', title: t('manage_option_watchlist_columns.column_option_full_name'), hide: false },
				{ id: 'column_base_name', title: t('manage_option_watchlist_columns.column_base_name'), hide: true },
				{ id: 'column_contract_size', title: t('manage_option_watchlist_columns.column_contract_size'), hide: true },
				{
					id: 'column_total_trades_number',
					title: t('manage_option_watchlist_columns.column_total_trades_number'),
					hide: true,
				},
				{ id: 'column_due_date', title: t('manage_option_watchlist_columns.column_due_date'), hide: true },
				{ id: 'column_option_type', title: t('manage_option_watchlist_columns.column_option_type'), hide: false },
				{ id: 'column_initial_margin', title: t('manage_option_watchlist_columns.column_initial_margin'), hide: false },
				{ id: 'column_required_margin', title: t('manage_option_watchlist_columns.column_required_margin'), hide: false },
			],
		},
		{
			id: 'table_details',
			title: t('manage_option_watchlist_columns.table_details'),
			items: [
				{ id: 'column_total_trades_value', title: t('manage_option_watchlist_columns.column_total_trades_value'), hide: true },
				{ id: 'column_last_price', title: t('manage_option_watchlist_columns.column_last_price'), hide: true },
				{ id: 'column_last_base_price', title: t('manage_option_watchlist_columns.column_last_base_price'), hide: false },
				{ id: 'column_break_even_price', title: t('manage_option_watchlist_columns.column_break_even_price'), hide: false },
				{ id: 'column_lever', title: t('manage_option_watchlist_columns.column_lever'), hide: true },
				{ id: 'column_open_positions', title: t('manage_option_watchlist_columns.column_open_positions'), hide: true },
				{ id: 'column_volume', title: t('manage_option_watchlist_columns.column_volume'), hide: true },
				{ id: 'column_best_buy', title: t('manage_option_watchlist_columns.column_best_buy'), hide: false },
				{ id: 'column_better_sell', title: t('manage_option_watchlist_columns.column_better_sell'), hide: true },
				{ id: 'column_final_price', title: t('manage_option_watchlist_columns.column_final_price'), hide: true },
				{ id: 'column_gap', title: t('manage_option_watchlist_columns.column_gap'), hide: true },
				{ id: 'column_final_base_price', title: t('manage_option_watchlist_columns.column_final_base_price'), hide: false },
			],
		},
		{
			id: 'formula',
			title: t('manage_option_watchlist_columns.formula'),
			items: [
				{ id: 'column_delta', title: t('manage_option_watchlist_columns.column_delta'), hide: true },
				{ id: 'column_iv', title: t('manage_option_watchlist_columns.column_iv'), hide: false },
				{ id: 'column_status', title: t('manage_option_watchlist_columns.column_status'), hide: true },
				{ id: 'column_black_shoals', title: t('manage_option_watchlist_columns.column_black_shoals'), hide: true },
				{ id: 'column_hv', title: t('manage_option_watchlist_columns.column_hv'), hide: false },
				{ id: 'column_time_value', title: t('manage_option_watchlist_columns.column_time_value'), hide: true },
				{ id: 'column_theta', title: t('manage_option_watchlist_columns.column_theta'), hide: false },
				{
					id: 'column_black_shoals_discrepancy',
					title: t('manage_option_watchlist_columns.column_black_shoals_discrepancy'),
					hide: true,
				},
				{ id: 'column_gamma', title: t('manage_option_watchlist_columns.column_gamma'), hide: true },
				{ id: 'column_face', title: t('manage_option_watchlist_columns.column_face'), hide: false },
				{ id: 'column_vega', title: t('manage_option_watchlist_columns.column_vega'), hide: true },
			],
		},
	]);

	const onClose = () => {
		dispatch(toggleManageOptionColumns(false));
	};

	const setHide = (categoryIndex: number, itemIndex: number, hide: boolean) => {
		try {
			const cols = JSON.parse(JSON.stringify(columns));
			cols[categoryIndex].items[itemIndex].hide = hide;

			setColumns(cols);
		} catch (e) {
			//
		}
	};

	useEffect(() => {
		if (isEnable) setRendered(true);
	}, [isEnable]);

	return (
		<Wrapper className={clsx('bg-white', isEnable ? 'left-to-right' : rendered && 'right-to-left')}>
			<div className='relative flex-justify-center'>
				<h1 className='text-2xl font-bold text-gray-100'>{t('manage_option_watchlist_columns.title')}</h1>
				<button className='absolute left-32 text-gray-100' type='button' onClick={onClose}>
					<XSVG width='1.6rem' height='1.6rem' />
				</button>
			</div>

			<div className='gap-16 overflow-auto px-32 flex-column'>
				{columns.map((category, categoryIndex) => (
					<div key={category.id} className={clsx('gap-16 pb-16 flex-column', categoryIndex < 2 && 'border-b border-b-gray-400')}>
						<h2 className='text-lg font-medium'>{category.title}</h2>

						<div className='just flex flex-wrap gap-16'>
							{category.items.map((item, itemIndex) => (
								<Button
									onClick={() => setHide(categoryIndex, itemIndex, !item.hide)}
									type='button'
									key={item.id}
									className={clsx(item.hide ? 'bg-white text-gray-200 shadow-sm' : 'bg-primary-200 text-white')}
								>
									{item.title}
								</Button>
							))}
						</div>
					</div>
				))}
			</div>
		</Wrapper>
	);
};

export default ManageWatchlistColumns;

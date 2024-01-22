import { useOptionSymbolColumnsQuery } from '@/api/queries/optionQueries';
import { RefreshSVG, XSVG } from '@/components/icons';
import { useAppDispatch, useAppSelector } from '@/features/hooks';
import { getManageOptionColumns, toggleManageOptionColumns } from '@/features/slices/uiSlice';
import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import { useEffect, useMemo, useRef, useState } from 'react';
import styled from 'styled-components';

const Wrapper = styled.div<{ isEnabled: boolean }>`
	position: fixed;
	width: 47.2rem;
	height: calc(100% - 12.4rem);
	top: 8rem;
	left: 0;
	gap: 1.6rem;
	display: flex;
	flex-direction: column;
	border-radius: 0 1.6rem 1.6rem 0;
	padding: 0 0 1.6rem 0;
	z-index: 9;
	box-shadow: 0px 2px 10px 1px rgba(0, 0, 0, 0.2);
	animation: ${({ isEnabled }) =>
		`${isEnabled ? 'left-to-right' : 'right-to-left'} ease-in-out ${
			isEnabled ? '700ms' : '600ms'
		} 1 alternate forwards`};
`;

const Button = styled.button`
	display: flex;
	justify-content: center;
	align-items: center;
	width: 12rem;
	font-weight: 500;
	height: 4rem;
	border-radius: 0.8rem;
	transition:
		color 250ms,
		background-color 250ms;
	-webkit-transition:
		color 250ms,
		background-color 250ms;
	-moz-transition:
		color 250ms,
		background-color 250ms;
`;

const ManageWatchlistColumns = () => {
	const controllerRef = useRef<AbortController | null>(null);

	const wrapperRef = useRef<HTMLDivElement>(null);

	const t = useTranslations();

	const dispatch = useAppDispatch();

	const isEnable = useAppSelector(getManageOptionColumns);

	const initialData = useMemo<
		Array<{ id: string; title: string; items: Array<{ id: string; title: string; hide: boolean }> }>
	>(
		() => [
			{
				id: 'symbol_info',
				title: t('manage_option_watchlist_columns.symbol_info'),
				items: [
					{ id: 'column_symbol', title: t('manage_option_watchlist_columns.column_symbol'), hide: true },
					{
						id: 'column_days_left',
						title: t('manage_option_watchlist_columns.column_days_left'),
						hide: false,
					},
					{
						id: 'column_price_applied',
						title: t('manage_option_watchlist_columns.column_price_applied'),
						hide: true,
					},
					{
						id: 'column_option_full_name',
						title: t('manage_option_watchlist_columns.column_option_full_name'),
						hide: false,
					},
					{
						id: 'column_base_name',
						title: t('manage_option_watchlist_columns.column_base_name'),
						hide: true,
					},
					{
						id: 'column_contract_size',
						title: t('manage_option_watchlist_columns.column_contract_size'),
						hide: true,
					},
					{
						id: 'column_total_trades_number',
						title: t('manage_option_watchlist_columns.column_total_trades_number'),
						hide: true,
					},
					{ id: 'column_due_date', title: t('manage_option_watchlist_columns.column_due_date'), hide: true },
					{
						id: 'column_option_type',
						title: t('manage_option_watchlist_columns.column_option_type'),
						hide: false,
					},
					{
						id: 'column_initial_margin',
						title: t('manage_option_watchlist_columns.column_initial_margin'),
						hide: false,
					},
					{
						id: 'column_required_margin',
						title: t('manage_option_watchlist_columns.column_required_margin'),
						hide: false,
					},
				],
			},
			{
				id: 'table_details',
				title: t('manage_option_watchlist_columns.table_details'),
				items: [
					{
						id: 'column_total_trades_value',
						title: t('manage_option_watchlist_columns.column_total_trades_value'),
						hide: true,
					},
					{
						id: 'column_last_price',
						title: t('manage_option_watchlist_columns.column_last_price'),
						hide: true,
					},
					{
						id: 'column_last_base_price',
						title: t('manage_option_watchlist_columns.column_last_base_price'),
						hide: false,
					},
					{
						id: 'column_final_base_price',
						title: t('manage_option_watchlist_columns.column_final_base_price'),
						hide: false,
					},
					{ id: 'column_status', title: t('manage_option_watchlist_columns.column_status'), hide: true },
					{
						id: 'column_open_positions',
						title: t('manage_option_watchlist_columns.column_open_positions'),
						hide: true,
					},
					{ id: 'column_volume', title: t('manage_option_watchlist_columns.column_volume'), hide: true },
					{ id: 'column_best_buy', title: t('manage_option_watchlist_columns.column_best_buy'), hide: false },
					{
						id: 'column_better_sell',
						title: t('manage_option_watchlist_columns.column_better_sell'),
						hide: true,
					},
					{
						id: 'column_final_price',
						title: t('manage_option_watchlist_columns.column_final_price'),
						hide: true,
					},
					{ id: 'column_gap', title: t('manage_option_watchlist_columns.column_gap'), hide: true },
				],
			},
			{
				id: 'formula',
				title: t('manage_option_watchlist_columns.formula'),
				items: [
					{ id: 'column_delta', title: t('manage_option_watchlist_columns.column_delta'), hide: true },
					{ id: 'column_iv', title: t('manage_option_watchlist_columns.column_iv'), hide: false },
					{ id: 'column_lever', title: t('manage_option_watchlist_columns.column_lever'), hide: true },
					{
						id: 'column_black_shoals',
						title: t('manage_option_watchlist_columns.column_black_shoals'),
						hide: true,
					},
					{ id: 'column_hv', title: t('manage_option_watchlist_columns.column_hv'), hide: false },
					{
						id: 'column_time_value',
						title: t('manage_option_watchlist_columns.column_time_value'),
						hide: true,
					},
					{ id: 'column_theta', title: t('manage_option_watchlist_columns.column_theta'), hide: false },
					{
						id: 'column_black_shoals_discrepancy',
						title: t('manage_option_watchlist_columns.column_black_shoals_discrepancy'),
						hide: true,
					},
					{ id: 'column_gamma', title: t('manage_option_watchlist_columns.column_gamma'), hide: true },
					{ id: 'column_face', title: t('manage_option_watchlist_columns.column_face'), hide: false },
					{ id: 'column_vega', title: t('manage_option_watchlist_columns.column_vega'), hide: true },
					{
						id: 'column_break_even_price',
						title: t('manage_option_watchlist_columns.column_break_even_price'),
						hide: false,
					},
				],
			},
		],
		[],
	);

	const [rendered, setRendered] = useState(isEnable);

	const [columns, setColumns] = useState(initialData);

	const { data } = useOptionSymbolColumnsQuery({
		queryKey: ['optionSymbolColumnsQuery'],
		enabled: rendered,
	});

	const onClose = () => {
		abort();
		dispatch(toggleManageOptionColumns(false));
	};

	const onRefresh = () => {
		setColumns(initialData);
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

	const abort = () => {
		if (controllerRef.current) controllerRef.current.abort();
	};

	const onDocumentClick = (e: MouseEvent) => {
		const eTarget = e.target as HTMLDivElement;
		const eWrapper = wrapperRef.current;
		if (!eWrapper || !eTarget) return;

		if (eTarget.isEqualNode(eWrapper) || eWrapper.contains(eTarget)) return;

		onClose();
		abort();
	};

	useEffect(() => {
		const eWrapper = wrapperRef.current;
		if (!eWrapper || !isEnable) return;

		controllerRef.current = new AbortController();
		document.addEventListener('click', onDocumentClick, {
			signal: controllerRef.current.signal,
		});
	}, [wrapperRef.current, rendered]);

	useEffect(() => {
		if (!isEnable) setTimeout(() => setRendered(false), 600);
		else setRendered(true);
	}, [isEnable]);

	if (!rendered) return null;

	return (
		<Wrapper isEnabled={isEnable} ref={wrapperRef} className='overflow-auto bg-white'>
			<div className='sticky top-0 w-full bg-white px-32 pt-16'>
				<div className='border-b border-b-gray-400 pb-16 flex-justify-between'>
					<h1 className='text-2xl font-bold text-gray-100'>{t('manage_option_watchlist_columns.title')}</h1>

					<div className='flex gap-24'>
						<button className='text-gray-100' type='button' onClick={onRefresh}>
							<RefreshSVG width='2.4rem' height='2.4rem' />
						</button>
						<button className='text-gray-100' type='button' onClick={onClose}>
							<XSVG width='1.6rem' height='1.6rem' />
						</button>
					</div>
				</div>
			</div>

			<div className='gap-16 px-32 flex-column'>
				{columns.map((category, categoryIndex) => (
					<div
						key={category.id}
						className={clsx('gap-16 pb-16 flex-column', categoryIndex < 2 && 'border-b border-b-gray-400')}
					>
						<h2 className='text-lg font-medium text-gray-100'>{category.title}</h2>

						<div className='flex-wrap gap-16 flex-justify-between'>
							{category.items.map((item, itemIndex) => (
								<Button
									onClick={() => setHide(categoryIndex, itemIndex, !item.hide)}
									type='button'
									key={item.id}
									className={clsx(
										item.hide
											? 'bg-white text-gray-200 shadow-sm hover:bg-primary-200 hover:text-white'
											: 'btn-choose',
									)}
								>
									{item.title}
								</Button>
							))}

							{[...Array(12 - category.items.length)].map((_, index) => (
								<div className='flex-1' key={index} />
							))}
						</div>
					</div>
				))}
			</div>
		</Wrapper>
	);
};

export default ManageWatchlistColumns;

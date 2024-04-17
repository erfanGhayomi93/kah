'use client';

import ipcMain from '@/classes/IpcMain';
import ErrorBoundary from '@/components/common/ErrorBoundary';
import Main from '@/components/layout/Main';
import { type initialDashboardGrid } from '@/constants';
import { useAppDispatch, useAppSelector } from '@/features/hooks';
import { getDashboardGridLayout, setDashboardGridLayout } from '@/features/slices/uiSlice';
import { useTranslations } from 'next-intl';
import dynamic from 'next/dynamic';
import { useEffect, useMemo } from 'react';
import { type Layout, type Layouts, Responsive, WidthProvider } from 'react-grid-layout';
import { toast } from 'react-toastify';
import Loading from './components/Loading';
import EditLayoutButton from './EditLayoutButton';

const Best = dynamic(() => import('./components/Best'), {
	loading: () => <Loading />,
});

const CompareTransactionValue = dynamic(() => import('./components/CompareTransactionValue'), {
	loading: () => <Loading />,
});

const Custom = dynamic(() => import('./components/Custom'), {
	loading: () => <Loading />,
});

const DueDates = dynamic(() => import('./components/DueDates'), {
	loading: () => <Loading />,
});

const IndividualAndLegal = dynamic(() => import('./components/IndividualAndLegal'), {
	loading: () => <Loading />,
});

const MarketState = dynamic(() => import('./components/MarketState'), {
	loading: () => <Loading />,
});

const MarketView = dynamic(() => import('./components/MarketView'), {
	loading: () => <Loading />,
});

const Meetings = dynamic(() => import('./components/Meetings'), {
	loading: () => <Loading />,
});

const NewAndOld = dynamic(() => import('./components/NewAndOld'), {
	loading: () => <Loading />,
});

const OpenPositionsProcess = dynamic(() => import('./components/OpenPositionsProcess'), {
	loading: () => <Loading />,
});

const OptionContracts = dynamic(() => import('./components/OptionContracts'), {
	loading: () => <Loading />,
});

const OptionMarketProcess = dynamic(() => import('./components/OptionMarketProcess'), {
	loading: () => <Loading />,
});

const OptionTradesValue = dynamic(() => import('./components/OptionTradesValue'), {
	loading: () => <Loading />,
});

const PriceChangesWatchlist = dynamic(() => import('./components/PriceChangesWatchlist'), {
	loading: () => <Loading />,
});

const RecentActivities = dynamic(() => import('./components/RecentActivities'), {
	loading: () => <Loading />,
});

const TopBaseAssets = dynamic(() => import('./components/TopBaseAssets'), {
	loading: () => <Loading />,
});

const UserProgressBar = dynamic(() => import('./components/UserProgressBar'), {
	loading: () => <Loading />,
});

const SECTIONS_MARGIN: [number, number] = [16, 16];
const ResponsiveGridLayout = WidthProvider(Responsive);

const Dashboard = () => {
	const t = useTranslations();

	const dispatch = useAppDispatch();

	const grid = useAppSelector(getDashboardGridLayout);

	const getSectionHeight = (originalHeight: number) => (originalHeight + SECTIONS_MARGIN[1]) / 17;

	const getDesktopLayout = (grid: IDashboardGrid[]) => {
		const MAX_WIDTH = 3;

		const layout: Layout[] = [];
		const l = grid.length;

		let y = 0;
		let x = 0;
		let c = MAX_WIDTH;

		let pairs: typeof layout = [];
		for (let i = 0; i < l; i++) {
			const item = grid[i];
			const iItem = {
				i: item.id,
				h: getSectionHeight(item.h),
				w: item.w,
				x,
				y,
			};

			pairs.push(iItem);

			x += item.w;
			c -= item.w;

			let availableWidth = c;
			for (let j = i + 1; j < l; j++) {
				const pairItem = grid[j];
				const jItem = {
					i: pairItem.id,
					h: getSectionHeight(pairItem.h),
					w: pairItem.w,
					x,
					y,
				};

				x += item.w;
				availableWidth -= pairItem.w;

				if (availableWidth === 0) {
					pairs.push(jItem);
					i = j;
					break;
				} else if (availableWidth < 0) {
					availableWidth += pairItem.w;
					continue;
				} else {
					pairs.push(jItem);
				}
			}

			layout.push(...pairs);
			pairs = [];
			c = MAX_WIDTH;
			x = 0;
			y += 1;
		}

		return layout;
	};

	const getMobileLayout = (grid: IDashboardGrid[]): Layout[] => {
		const layout: Layout[] = [];

		const l = grid.length;
		let y = 0;

		for (let i = 0; i < l; i++) {
			const item = grid[i];
			const newItem = {
				i: item.id,
				h: getSectionHeight(item.h),
				w: item.w,
				x: 1,
				y,
			};

			layout.push(newItem);

			y += newItem.h;
		}

		return layout;
	};

	const getGridLayouts = (): Layouts => {
		let initialLayout = JSON.parse(JSON.stringify(grid)) as typeof initialDashboardGrid;
		initialLayout = initialLayout.filter((item) => !item.hidden);
		initialLayout.sort((a, b) => a.i - b.i);

		return {
			lg: getDesktopLayout(initialLayout),
			sm: getMobileLayout(initialLayout),
		};
	};

	const onHideSection = ({ id, hidden }: IpcMainChannels['home.hide_section']) => {
		const newGrid = grid.map((item) => (item.id === id ? { ...item, hidden } : item));
		const visibleSectionsLength = newGrid.filter((item) => !item.hidden).length;

		if (visibleSectionsLength <= 1) {
			toast.error(t('alerts.can_not_hide_every_sections'));
			return;
		}

		dispatch(setDashboardGridLayout(newGrid));
	};

	const cells = useMemo(() => {
		const result: Partial<Record<TDashboardSections, boolean>> = {};

		for (let i = 0; i < grid.length; i++) {
			const item = grid[i];
			result[item.id] = item.hidden;
		}

		return result;
	}, [grid]);

	useEffect(() => {
		const removeCallback = ipcMain.handle('home.hide_section', onHideSection);

		return () => {
			removeCallback();
		};
	}, [grid]);

	return (
		<Main className='gap-8 !p-0'>
			<div className='size-full'>
				<ResponsiveGridLayout
					className='w-full ltr'
					layouts={getGridLayouts()}
					margin={SECTIONS_MARGIN}
					breakpoints={{ lg: 1366, sm: 0 }}
					containerPadding={[8, 16]}
					cols={{ lg: 3, sm: 1 }}
					useCSSTransforms
					isDraggable={false}
					isDroppable={false}
					isResizable={false}
					compactType='vertical'
					allowOverlap={false}
					rowHeight={1}
				>
					{!cells.market_view && (
						<div key='market_view'>
							<ErrorBoundary>
								<MarketView />
							</ErrorBoundary>
						</div>
					)}

					{!cells.market_state && (
						<div key='market_state'>
							<ErrorBoundary>
								<MarketState />
							</ErrorBoundary>
						</div>
					)}

					{!cells.best && (
						<div key='best'>
							<ErrorBoundary>
								<Best />
							</ErrorBoundary>
						</div>
					)}

					{!cells.user_progress_bar && (
						<div key='user_progress_bar'>
							<ErrorBoundary>
								<UserProgressBar />
							</ErrorBoundary>
						</div>
					)}

					{!cells.compare_transaction_value && (
						<div key='compare_transaction_value'>
							<ErrorBoundary>
								<CompareTransactionValue />
							</ErrorBoundary>
						</div>
					)}

					{!cells.option_contracts && (
						<div key='option_contracts'>
							<ErrorBoundary>
								<OptionContracts />
							</ErrorBoundary>
						</div>
					)}

					{!cells.option_trades_value && (
						<div key='option_trades_value'>
							<ErrorBoundary>
								<OptionTradesValue />
							</ErrorBoundary>
						</div>
					)}

					{!cells.option_market_process && (
						<div key='option_market_process'>
							<ErrorBoundary>
								<OptionMarketProcess />
							</ErrorBoundary>
						</div>
					)}

					{!cells.individual_and_legal && (
						<div key='individual_and_legal'>
							<ErrorBoundary>
								<IndividualAndLegal />
							</ErrorBoundary>
						</div>
					)}

					{!cells.price_changes_watchlist && (
						<div key='price_changes_watchlist'>
							<ErrorBoundary>
								<PriceChangesWatchlist />
							</ErrorBoundary>
						</div>
					)}

					{!cells.open_positions_process && (
						<div key='open_positions_process'>
							<ErrorBoundary>
								<OpenPositionsProcess />
							</ErrorBoundary>
						</div>
					)}

					{!cells.meetings && (
						<div key='meetings'>
							<ErrorBoundary>
								<Meetings />
							</ErrorBoundary>
						</div>
					)}

					{!cells.new_and_old && (
						<div key='new_and_old'>
							<ErrorBoundary>
								<NewAndOld />
							</ErrorBoundary>
						</div>
					)}

					{!cells.top_base_assets && (
						<div key='top_base_assets'>
							<ErrorBoundary>
								<TopBaseAssets />
							</ErrorBoundary>
						</div>
					)}

					{!cells.recent_activities && (
						<div key='recent_activities'>
							<ErrorBoundary>
								<RecentActivities />
							</ErrorBoundary>
						</div>
					)}

					{!cells.due_dates && (
						<div key='due_dates'>
							<ErrorBoundary>
								<DueDates />
							</ErrorBoundary>
						</div>
					)}

					{!cells.custom && (
						<div key='custom'>
							<ErrorBoundary>
								<Custom />
							</ErrorBoundary>
						</div>
					)}
				</ResponsiveGridLayout>
			</div>

			<EditLayoutButton />
		</Main>
	);
};

export default Dashboard;

import ipcMain from '@/classes/IpcMain';
import Main from '@/components/layout/Main';
import { initialHomeGrid } from '@/constants';
import { useTranslations } from 'next-intl';
import { useEffect, useMemo, useState } from 'react';
import { type Layout, type Layouts, Responsive, WidthProvider } from 'react-grid-layout';
import { toast } from 'react-toastify';
import Best from './components/Best';
import CompareTransactionValue from './components/CompareTransactionValue';
import Custom from './components/Custom';
import DueDates from './components/DueDates';
import IndividualAndLegal from './components/IndividualAndLegal';
import MarketStatus from './components/MarketStatus';
import MarketView from './components/MarketView';
import Meetings from './components/Meetings';
import NewAndOld from './components/NewAndOld';
import OpenPositionsProcess from './components/OpenPositionsProcess';
import OptionContracts from './components/OptionContracts';
import OptionMarketProcess from './components/OptionMarketProcess';
import OptionTradesValue from './components/OptionTradesValue';
import PriceChangesWatchlist from './components/PriceChangesWatchlist';
import RecentActivities from './components/RecentActivities';
import TopBaseAssets from './components/TopBaseAssets';
import UserProgressBar from './components/UserProgressBar';

const SECTIONS_MARGIN: [number, number] = [16, 16];
const ResponsiveGridLayout = WidthProvider(Responsive);

const Home = () => {
	const t = useTranslations();

	const [grid, setGrid] = useState(initialHomeGrid);

	const getSectionHeight = (originalHeight: number) => (originalHeight + SECTIONS_MARGIN[1]) / 17;

	const getGridLayouts = (): Layouts => {
		const layout: Layout[] = [];

		let initialLayout = JSON.parse(JSON.stringify(grid)) as typeof initialHomeGrid;
		initialLayout = initialLayout.filter((item) => !item.hidden);
		initialLayout.sort((a, b) => a.i - b.i);

		const l = initialLayout.length;
		let y = 0;
		let c = 0;

		for (let i = 0; i < l; i++) {
			const item = initialLayout[i];
			c += item.w;

			const newItem = {
				i: item.id,
				h: getSectionHeight(item.h),
				w: item.w,
				x: c - item.w,
				y,
			};

			layout.push(newItem);

			if (c >= 3) {
				y += newItem.h;
				c = 0;
			}
		}

		return {
			xl: layout,
			lg: layout,
			sm: layout,
		};
	};

	const onHideSection = ({ id, hidden }: IpcMainChannels['home.hide_section']) => {
		const newGrid = grid.map((item) => (item.id === id ? { ...item, hidden } : item));
		const visibleSectionsLength = newGrid.filter((item) => !item.hidden).length;

		if (visibleSectionsLength <= 1) {
			toast.error(t('alerts.can_not_hide_every_sections'));
			return;
		}

		setGrid(newGrid);
	};

	const cells = useMemo(() => {
		const result: Partial<Record<THomeSections, boolean>> = {};

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
					breakpoints={{ xl: 1440, lg: 1024, sm: 0 }}
					containerPadding={[16, 16]}
					cols={{ xl: 3, lg: 3, sm: 1 }}
					useCSSTransforms={false}
					isDraggable={false}
					isDroppable={false}
					isResizable={false}
					compactType='vertical'
					allowOverlap={false}
					rowHeight={1}
				>
					{!cells.market_view && (
						<div key='market_view'>
							<MarketView />
						</div>
					)}

					{!cells.market_status && (
						<div key='market_status'>
							<MarketStatus />
						</div>
					)}

					{!cells.best && (
						<div key='best'>
							<Best />
						</div>
					)}

					{!cells.user_progress_bar && (
						<div key='user_progress_bar'>
							<UserProgressBar />
						</div>
					)}

					{!cells.compare_transaction_value && (
						<div key='compare_transaction_value'>
							<CompareTransactionValue />
						</div>
					)}

					{!cells.option_contracts && (
						<div key='option_contracts'>
							<OptionContracts />
						</div>
					)}

					{!cells.option_trades_value && (
						<div key='option_trades_value'>
							<OptionTradesValue />
						</div>
					)}

					{!cells.option_market_process && (
						<div key='option_market_process'>
							<OptionMarketProcess />
						</div>
					)}

					{!cells.individual_and_legal && (
						<div key='individual_and_legal'>
							<IndividualAndLegal />
						</div>
					)}

					{!cells.price_changes_watchlist && (
						<div key='price_changes_watchlist'>
							<PriceChangesWatchlist />
						</div>
					)}

					{!cells.open_positions_process && (
						<div key='open_positions_process'>
							<OpenPositionsProcess />
						</div>
					)}

					{!cells.meetings && (
						<div key='meetings'>
							<Meetings />
						</div>
					)}

					{!cells.new_and_old && (
						<div key='new_and_old'>
							<NewAndOld />
						</div>
					)}

					{!cells.top_base_assets && (
						<div key='top_base_assets'>
							<TopBaseAssets />
						</div>
					)}

					{!cells.recent_activities && (
						<div key='recent_activities'>
							<RecentActivities />
						</div>
					)}

					{!cells.due_dates && (
						<div key='due_dates'>
							<DueDates />
						</div>
					)}

					{!cells.custom && (
						<div key='custom'>
							<Custom />
						</div>
					)}
				</ResponsiveGridLayout>
			</div>
		</Main>
	);
};

export default Home;

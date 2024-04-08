import Main from '@/components/layout/Main';
import { type Layout, type Layouts, Responsive, WidthProvider } from 'react-grid-layout';
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
	const getSectionHeight = (originalHeight: number) => (originalHeight + SECTIONS_MARGIN[1]) / 17;

	const getGridLayouts = (): Layouts => {
		const rowHeights = [
			{ h: getSectionHeight(352), y: 0 },
			{ h: getSectionHeight(424), y: getSectionHeight(352) },
			{ h: getSectionHeight(384), y: getSectionHeight(776) },
			{ h: getSectionHeight(336), y: getSectionHeight(1160) },
			{ h: getSectionHeight(376), y: getSectionHeight(1496) },
			{ h: getSectionHeight(376), y: getSectionHeight(1872) },
			{ h: getSectionHeight(376), y: getSectionHeight(2248) },
		];

		const l: Layout[] = [
			// 1
			{ x: 0, y: rowHeights[0].y, w: 2, h: rowHeights[0].h, i: 'market_view' },
			{ x: 2, y: rowHeights[0].y, w: 1, h: rowHeights[0].h, i: 'market_status' },
			// 2
			{ x: 0, y: rowHeights[1].y, w: 2, h: rowHeights[1].h, i: 'best' },
			{ x: 2, y: rowHeights[1].y, w: 1, h: rowHeights[1].h, i: 'user_progress_bar' },
			// 3
			{ x: 0, y: rowHeights[2].y, w: 2, h: rowHeights[2].h, i: 'compare_transaction_value' },
			{ x: 2, y: rowHeights[2].y, w: 1, h: rowHeights[2].h, i: 'option_contracts' },
			// 4
			{ x: 0, y: rowHeights[3].y, w: 2, h: rowHeights[3].h, i: 'option_trades_value' },
			{ x: 2, y: rowHeights[3].y, w: 1, h: rowHeights[3].h, i: 'option_market_process' },
			// 5
			{ x: 0, y: rowHeights[4].y, w: 1, h: rowHeights[4].h, i: 'individual_and_legal' },
			{ x: 1, y: rowHeights[4].y, w: 1, h: rowHeights[4].h, i: 'price_changes_watchlist' },
			{ x: 2, y: rowHeights[4].y, w: 1, h: rowHeights[4].h, i: 'open_positions_process' },
			// 6
			{ x: 0, y: rowHeights[5].y, w: 1, h: rowHeights[5].h, i: 'meetings' },
			{ x: 1, y: rowHeights[5].y, w: 1, h: rowHeights[5].h, i: 'new_and_old' },
			{ x: 2, y: rowHeights[5].y, w: 1, h: rowHeights[5].h, i: 'top_base_assets' },
			// 7
			{ x: 0, y: rowHeights[6].y, w: 1, h: rowHeights[6].h, i: 'custom' },
			{ x: 1, y: rowHeights[6].y, w: 1, h: rowHeights[6].h, i: 'recent_activities' },
			{ x: 2, y: rowHeights[6].y, w: 1, h: rowHeights[6].h, i: 'due_dates' },
		];

		return {
			xl: l,
			lg: l,
			sm: l,
		};
	};

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
					useCSSTransforms
					isDraggable={false}
					isDroppable={false}
					isResizable={false}
					compactType='vertical'
					allowOverlap={false}
					rowHeight={1}
				>
					<div key='market_view'>
						<MarketView />
					</div>
					<div key='market_status'>
						<MarketStatus />
					</div>
					<div key='best'>
						<Best />
					</div>
					<div key='user_progress_bar'>
						<UserProgressBar />
					</div>
					<div key='compare_transaction_value'>
						<CompareTransactionValue />
					</div>
					<div key='option_contracts'>
						<OptionContracts />
					</div>
					<div key='option_trades_value'>
						<OptionTradesValue />
					</div>
					<div key='option_market_process'>
						<OptionMarketProcess />
					</div>
					<div key='individual_and_legal'>
						<IndividualAndLegal />
					</div>
					<div key='price_changes_watchlist'>
						<PriceChangesWatchlist />
					</div>
					<div key='open_positions_process'>
						<OpenPositionsProcess />
					</div>
					<div key='meetings'>
						<Meetings />
					</div>
					<div key='new_and_old'>
						<NewAndOld />
					</div>
					<div key='top_base_assets'>
						<TopBaseAssets />
					</div>
					<div key='recent_activities'>
						<RecentActivities />
					</div>
					<div key='due_dates'>
						<DueDates />
					</div>
					<div key='custom'>
						<Custom />
					</div>
				</ResponsiveGridLayout>
			</div>
		</Main>
	);
};

export default Home;

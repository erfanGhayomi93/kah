import { useSymbolInfoQuery } from '@/api/queries/symbolQuery';
import ErrorBoundary from '@/components/common/ErrorBoundary';
import Loading from '@/components/common/Loading';
import { SettingSliderSVG, XSVG } from '@/components/icons';
import { useAppDispatch, useAppSelector } from '@/features/hooks';
import { setSymbolInfoPanelSetting } from '@/features/slices/modalSlice';
import { getSymbolInfoPanelGridLayout, setSymbolInfoPanelGridLayout } from '@/features/slices/uiSlice';
import { useCallback, useRef } from 'react';
import GridLayout, { type Layout } from 'react-grid-layout';
import BaseSymbolContracts from './components/BaseSymbolContracts';
import Chart from './components/Chart';
import IndividualAndLegal from './components/IndividualAndLegal';
import MarketDepth from './components/MarketDepth';
import Messages from './components/Messages';
import OpenPositions from './components/OpenPositions';
import OptionBaseSymbolInformation from './components/OptionBaseSymbolInformation';
import OptionDetail from './components/OptionDetail';
import Quotes from './components/Quotes';
import SameSectorSymbol from './components/SameSectorSymbol';
import SymbolDetail from './components/SymbolDetails';
import SymbolInformation from './components/SymbolInformation';

interface ContainerProps {
	symbolISIN: string;
	close: () => void;
}

const MARGIN_BETWEEN_SECTIONS = 16;

const Container = ({ symbolISIN, close }: ContainerProps) => {
	const gridRef = useRef<GridLayout | null>(null);

	const dispatch = useAppDispatch();

	const { data: symbolData, isLoading } = useSymbolInfoQuery({
		queryKey: ['symbolInfoQuery', symbolISIN],
	});

	const symbolInfoPanelGridLayout = useAppSelector(getSymbolInfoPanelGridLayout);

	const onToggleSymbolDetail = (isExpand: boolean) => {
		const l = JSON.parse(JSON.stringify(symbolInfoPanelGridLayout)) as typeof symbolInfoPanelGridLayout;
		const i = l.findIndex((item) => item.id === 'symbol_detail');

		if (i === -1) return;

		l[i].height = isExpand ? 808 : 448;
		dispatch(setSymbolInfoPanelGridLayout(l));
	};

	const onToggleOptionDetail = (isExpand: boolean) => {
		const l = JSON.parse(JSON.stringify(symbolInfoPanelGridLayout)) as typeof symbolInfoPanelGridLayout;
		const i = l.findIndex((item) => item.id === 'option_detail');

		if (i === -1) return;

		l[i].height = isExpand ? 628 : 468;
		dispatch(setSymbolInfoPanelGridLayout(l));
	};

	const openSetting = () => {
		dispatch(
			setSymbolInfoPanelSetting({
				isOption: Boolean(symbolData?.isOption),
			}),
		);
	};

	const getSectionHeight = (originalHeight: number) => (originalHeight + MARGIN_BETWEEN_SECTIONS) / 17;

	const getGridLayout = () => {
		const layout = symbolInfoPanelGridLayout.filter((item) => {
			return item.hidden === false && (!('isOption' in item) || item.isOption === symbolData?.isOption);
		});
		layout.sort((a, b) => a.i - b.i);

		let prevRow: Layout | null = null;
		return layout.map((item) => {
			prevRow = {
				i: item.id,
				x: 0,
				w: 320,
				y: prevRow === null ? 0 : prevRow.y + prevRow.h,
				h: getSectionHeight(item.expand ? item.height : 40),
			};

			return prevRow;
		});
	};

	const onLayoutChange = (newLayout: Layout[]) => {
		const source = [...newLayout].sort((a, b) => a.y - b.y);
		let layout = JSON.parse(JSON.stringify(symbolInfoPanelGridLayout)) as typeof symbolInfoPanelGridLayout;

		layout = layout.map((item) => ({
			...item,
			i: source.findIndex(({ i }) => i === item.id),
		}));

		dispatch(setSymbolInfoPanelGridLayout(layout));
	};

	const isNotHidden = useCallback(
		(id: TSymbolInfoPanelSections) => {
			return !symbolInfoPanelGridLayout.find((item) => item.id === id)?.hidden;
		},
		[symbolInfoPanelGridLayout],
	);

	const isOption = Boolean(symbolData?.isOption);

	return (
		<div className='h-full pl-8 pr-16 flex-column'>
			<div style={{ flex: '0 0 5.6rem' }} className='flex-justify-between'>
				<button type='button' onClick={close}>
					<XSVG width='2rem' className='icon-hover' height='2rem' />
				</button>

				<button type='button' className='icon-hover' onClick={openSetting}>
					<SettingSliderSVG width='2.4rem' height='2.4rem' />
				</button>
			</div>

			{isLoading && (
				<div
					style={{
						left: '1.6rem',
						height: 'calc(100% - 1.6rem)',
						bottom: '1.6rem',
						width: 'calc(100% - 3.2rem)',
						backdropFilter: 'blur(2px)',
					}}
					className='absolute top-0 rounded'
				>
					<Loading />
				</div>
			)}

			{symbolData && (
				<div className='flex-column'>
					<div className='gap-16 flex-column'>
						<ErrorBoundary>
							<SymbolInformation symbolData={symbolData} />
						</ErrorBoundary>

						{isOption && (
							<ErrorBoundary>
								<OptionBaseSymbolInformation symbolData={symbolData} />
							</ErrorBoundary>
						)}
					</div>

					<div className='relative'>
						<GridLayout
							ref={gridRef}
							className='layout'
							draggableHandle='.drag-handler'
							useCSSTransforms
							isResizable={false}
							compactType='vertical'
							width={368}
							allowOverlap={false}
							cols={1}
							margin={[0, MARGIN_BETWEEN_SECTIONS]}
							rowHeight={1}
							layout={getGridLayout()}
							onLayoutChange={onLayoutChange}
						>
							{isOption
								? [
										isNotHidden('option_detail') && (
											<div key='option_detail'>
												<ErrorBoundary>
													<OptionDetail
														onExpand={onToggleOptionDetail}
														symbolData={symbolData}
													/>
												</ErrorBoundary>
											</div>
										),

										isNotHidden('market_depth') && (
											<div key='market_depth'>
												<ErrorBoundary>
													<MarketDepth symbolISIN={symbolISIN} />
												</ErrorBoundary>
											</div>
										),
									]
								: [
										isNotHidden('symbol_detail') && (
											<div key='symbol_detail'>
												<ErrorBoundary>
													<SymbolDetail
														symbolData={symbolData}
														onExpand={onToggleSymbolDetail}
													/>
												</ErrorBoundary>
											</div>
										),

										isNotHidden('base_symbol_contracts') && (
											<div key='base_symbol_contracts'>
												<ErrorBoundary>
													<BaseSymbolContracts symbolISIN={symbolISIN} />
												</ErrorBoundary>
											</div>
										),

										isNotHidden('user_open_positions') && (
											<div key='user_open_positions'>
												<ErrorBoundary>
													<OpenPositions symbolISIN={symbolISIN} />
												</ErrorBoundary>
											</div>
										),

										isNotHidden('quotes') && (
											<div key='quotes'>
												<ErrorBoundary>
													<Quotes symbolISIN={symbolISIN} />
												</ErrorBoundary>
											</div>
										),
									]}

							{isNotHidden('individual_and_legal') && (
								<div key='individual_and_legal'>
									<ErrorBoundary>
										<IndividualAndLegal symbolData={symbolData} />
									</ErrorBoundary>
								</div>
							)}

							{!isOption && [
								isNotHidden('chart') && (
									<div key='chart'>
										<ErrorBoundary>
											<Chart symbolISIN={symbolISIN} />
										</ErrorBoundary>
									</div>
								),

								isNotHidden('same_sector_symbols') && (
									<div key='same_sector_symbols'>
										<ErrorBoundary>
											<SameSectorSymbol symbolISIN={symbolISIN} />
										</ErrorBoundary>
									</div>
								),

								isNotHidden('supervisor_messages') && (
									<div key='supervisor_messages'>
										<ErrorBoundary>
											<Messages symbolISIN={symbolISIN} />
										</ErrorBoundary>
									</div>
								),
							]}
						</GridLayout>
					</div>
				</div>
			)}
		</div>
	);
};

export default Container;

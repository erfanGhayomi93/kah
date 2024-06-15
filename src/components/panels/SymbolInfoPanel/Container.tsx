import { useSymbolInfoQuery } from '@/api/queries/symbolQuery';
import ErrorBoundary from '@/components/common/ErrorBoundary';
import Loading from '@/components/common/Loading';
import { SettingSliderSVG, XSVG } from '@/components/icons';
import { useAppDispatch, useAppSelector } from '@/features/hooks';
import { setSymbolInfoPanelSettingModal } from '@/features/slices/modalSlice';
import { getSymbolInfoPanelGridLayout, setSymbolInfoPanelGridLayout } from '@/features/slices/uiSlice';
import dynamic from 'next/dynamic';
import { useMemo } from 'react';
import GridLayout, { type Layout } from 'react-grid-layout';
import SymbolInformation from './components/SymbolInformation';

const BaseSymbolContracts = dynamic(() => import('./components/BaseSymbolContracts'), {
	loading: () => <div className='h-full rounded skeleton' />,
});

const Chart = dynamic(() => import('./components/Chart'), {
	loading: () => <div className='h-full rounded skeleton' />,
});

const IndividualAndLegal = dynamic(() => import('./components/IndividualAndLegal'), {
	loading: () => <div className='h-full rounded skeleton' />,
});

const MarketDepth = dynamic(() => import('./components/MarketDepth'), {
	loading: () => <div className='h-full rounded skeleton' />,
});

const Messages = dynamic(() => import('./components/Messages'), {
	loading: () => <div className='h-full rounded skeleton' />,
});

const OpenPositions = dynamic(() => import('./components/OpenPositions'), {
	loading: () => <div className='h-full rounded skeleton' />,
});

const OptionBaseSymbolInformation = dynamic(() => import('./components/OptionBaseSymbolInformation'), {
	loading: () => <div className='h-full rounded skeleton' />,
});

const OptionDetail = dynamic(() => import('./components/OptionDetail'), {
	loading: () => <div className='h-full rounded skeleton' />,
});

const Quotes = dynamic(() => import('./components/Quotes'), {
	loading: () => <div className='h-full rounded skeleton' />,
});

const SameSectorSymbol = dynamic(() => import('./components/SameSectorSymbol'), {
	loading: () => <div className='h-full rounded skeleton' />,
});

const SymbolDetails = dynamic(() => import('./components/SymbolDetails'), {
	loading: () => <div className='h-full rounded skeleton' />,
});

interface ContainerProps {
	symbolISIN: string;
	close: () => void;
}

const MARGIN_BETWEEN_SECTIONS = 16;

const Container = ({ symbolISIN, close }: ContainerProps) => {
	const dispatch = useAppDispatch();

	const { data: symbolData, isLoading } = useSymbolInfoQuery({
		queryKey: ['symbolInfoQuery', symbolISIN],
	});

	const symbolInfoPanelGridLayout = useAppSelector(getSymbolInfoPanelGridLayout);

	const setSectionHeight = (id: TSymbolInfoPanelSections, h: number) => {
		const l = JSON.parse(JSON.stringify(symbolInfoPanelGridLayout)) as typeof symbolInfoPanelGridLayout;
		const i = l.findIndex((item) => item.id === id);

		if (i === -1) return;

		l[i].height = h;
		dispatch(setSymbolInfoPanelGridLayout(l));
	};

	const openSetting = () => {
		dispatch(
			setSymbolInfoPanelSettingModal({
				isOption: Boolean(symbolData?.isOption),
			}),
		);
	};

	const getSectionHeight = (originalHeight: number) => (originalHeight + MARGIN_BETWEEN_SECTIONS) / 17;

	const getGridLayout = () => {
		const layout = symbolInfoPanelGridLayout.filter((item) => {
			return !item.hidden && (!('isOption' in item) || item.isOption === symbolData?.isOption);
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

	const cells = useMemo(() => {
		const result: Partial<Record<TSymbolInfoPanelSections, boolean>> = {};

		for (let i = 0; i < symbolInfoPanelGridLayout.length; i++) {
			const item = symbolInfoPanelGridLayout[i];
			result[item.id] = item.hidden;
		}

		return result;
	}, [symbolInfoPanelGridLayout]);

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
				<div className='bg-light-gray-300 absolute left-0 top-0 size-full rounded'>
					<Loading />
				</div>
			)}

			{symbolData && (
				<div className='flex-column'>
					<div className='border-light-gray-200 bg-light-gray-300 sticky left-0 top-0 z-20 gap-16 border-b pb-16 flex-column'>
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
							draggableHandle='.drag-handler'
							useCSSTransforms={false}
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
										!cells.option_detail && (
											<div key='option_detail'>
												<ErrorBoundary>
													<OptionDetail
														setHeight={(h) => setSectionHeight('option_detail', h)}
														symbolData={symbolData}
													/>
												</ErrorBoundary>
											</div>
										),

										!cells.market_depth && (
											<div key='market_depth'>
												<ErrorBoundary>
													<MarketDepth
														symbolISIN={symbolISIN}
														lowThreshold={symbolData.lowThreshold}
														highThreshold={symbolData.highThreshold}
													/>
												</ErrorBoundary>
											</div>
										),
									]
								: [
										!cells.symbol_detail && (
											<div key='symbol_detail'>
												<ErrorBoundary>
													<SymbolDetails
														symbolData={symbolData}
														setHeight={(h) => setSectionHeight('symbol_detail', h)}
													/>
												</ErrorBoundary>
											</div>
										),

										!cells.base_symbol_contracts && (
											<div key='base_symbol_contracts'>
												<ErrorBoundary>
													<BaseSymbolContracts symbolISIN={symbolISIN} />
												</ErrorBoundary>
											</div>
										),

										!cells.user_open_positions && (
											<div key='user_open_positions'>
												<ErrorBoundary>
													<OpenPositions symbolISIN={symbolISIN} />
												</ErrorBoundary>
											</div>
										),

										!cells.quotes && (
											<div key='quotes'>
												<ErrorBoundary>
													<Quotes
														symbolISIN={symbolISIN}
														lowThreshold={symbolData.lowThreshold}
														highThreshold={symbolData.highThreshold}
													/>
												</ErrorBoundary>
											</div>
										),
									]}

							{!cells.individual_and_legal && (
								<div key='individual_and_legal'>
									<ErrorBoundary>
										<IndividualAndLegal symbolData={symbolData} />
									</ErrorBoundary>
								</div>
							)}

							{!cells.chart && (
								<div key='chart'>
									<ErrorBoundary>
										<Chart isOption={isOption} symbolISIN={symbolISIN} />
									</ErrorBoundary>
								</div>
							)}

							{!isOption && [
								!cells.same_sector_symbols && (
									<div key='same_sector_symbols'>
										<ErrorBoundary>
											<SameSectorSymbol symbolISIN={symbolISIN} />
										</ErrorBoundary>
									</div>
								),

								!cells.supervisor_messages && (
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

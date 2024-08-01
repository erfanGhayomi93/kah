import { useSymbolInfoQuery } from '@/api/queries/symbolQuery';
import ErrorBoundary from '@/components/common/ErrorBoundary';
import Loading from '@/components/common/Loading';
import { SettingSliderSVG, XSVG } from '@/components/icons';
import { useAppDispatch, useAppSelector } from '@/features/hooks';
import { setSymbolInfoPanelSettingModal } from '@/features/slices/modalSlice';
import { getSymbolInfoPanelGridLayout, setSymbolInfoPanelGridLayout } from '@/features/slices/uiSlice';
import { useSubscription } from '@/hooks';
import { subscribeSymbolInfo } from '@/utils/subscriptions';
import { useQueryClient } from '@tanstack/react-query';
import { type ItemUpdate } from 'lightstreamer-client-web';
import dynamic from 'next/dynamic';
import { useEffect, useMemo } from 'react';
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
	loading: () => <div className='h-48 rounded skeleton' />,
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

	const queryClient = useQueryClient();

	const { subscribe } = useSubscription();

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

	const getFieldName = (n: string): keyof Symbol.Info | null => {
		const keys: Record<string, keyof Symbol.Info> = {
			totalTradeValue: 'tradeValue',
			totalNumberOfSharesTraded: 'tradeVolume',
			closingPriceVarReferencePrice: 'closingPriceVarReferencePrice',
			baseVolume: 'baseVolume',
			lastTradedPrice: 'lastTradedPrice',
			totalNumberOfTrades: 'tradeCount',
			lastTradedPriceVar: 'lastTradedPrice',
			lastTradedPriceVarPercent: 'tradePriceVarPreviousTradePercent',
			closingPrice: 'closingPrice',
			closingPriceVarPercent: 'closingPriceVarReferencePricePercent',
			lastTradeDateTime: 'lastTradeDate',
			lowestTradePriceOfTradingDay: 'lowPrice',
			highestTradePriceOfTradingDay: 'highPrice',
			symbolState: 'symbolTradeState',
		};

		return keys?.[n] ?? null;
	};

	const onSymbolUpdate = (updateInfo: ItemUpdate) => {
		try {
			const queryKey = ['symbolInfoQuery', symbolISIN];
			const visualData = JSON.parse(JSON.stringify(queryClient.getQueryData(queryKey))) as Symbol.Info;

			if (!visualData) return;

			updateInfo.forEachChangedField((fieldName, _b, value) => {
				try {
					const f = getFieldName(fieldName);

					if (value && f && f in visualData) {
						const valueAsNumber = Number(value);

						// @ts-expect-error: Lightstream returns the wrong data type
						visualData[f as keyof Symbol.Info] = isNaN(valueAsNumber) ? value : valueAsNumber;
					}
				} catch (e) {
					//
				}
			});

			queryClient.setQueryData(queryKey, visualData);
		} catch (e) {
			//
		}
	};

	const cells = useMemo(() => {
		const result: Partial<Record<TSymbolInfoPanelSections, boolean>> = {};

		for (let i = 0; i < symbolInfoPanelGridLayout.length; i++) {
			const item = symbolInfoPanelGridLayout[i];
			result[item.id] = item.hidden;
		}

		return result;
	}, [symbolInfoPanelGridLayout]);

	useEffect(() => {
		const sub = subscribeSymbolInfo(symbolISIN, 'symbolData');
		sub.addEventListener('onItemUpdate', onSymbolUpdate);

		subscribe(sub);
	}, [symbolISIN]);

	const isOption = Boolean(symbolData?.isOption);

	return (
		<div className='h-full pl-8 pr-16 flex-column'>
			<div style={{ flex: '0 0 4.8rem' }} className='flex-justify-between'>
				<button type='button' onClick={close}>
					<XSVG width='2rem' className='icon-hover' height='2rem' />
				</button>

				<button type='button' className='icon-hover' onClick={openSetting}>
					<SettingSliderSVG width='2.4rem' height='2.4rem' />
				</button>
			</div>

			{isLoading && (
				<div className='absolute left-0 top-0 size-full rounded bg-gray-300'>
					<Loading />
				</div>
			)}

			{symbolData && (
				<div className='flex-column'>
					<div className='sticky left-0 top-0 z-20 gap-16 border-b border-gray-200 bg-gray-300 pb-16 pt-8 flex-column'>
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
														yesterdayClosingPrice={symbolData.yesterdayClosingPrice}
													/>
												</ErrorBoundary>
											</div>
										),

										!cells.option_individual_and_legal && (
											<div key='option_individual_and_legal'>
												<ErrorBoundary>
													<IndividualAndLegal symbolData={symbolData} />
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
														yesterdayClosingPrice={symbolData.yesterdayClosingPrice}
													/>
												</ErrorBoundary>
											</div>
										),

										!cells.individual_and_legal && (
											<div key='individual_and_legal'>
												<ErrorBoundary>
													<IndividualAndLegal symbolData={symbolData} />
												</ErrorBoundary>
											</div>
										),
									]}

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

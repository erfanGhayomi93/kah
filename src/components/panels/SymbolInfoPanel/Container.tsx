import { useSymbolInfoQuery } from '@/api/queries/symbolQuery';
import LocalstorageInstance from '@/classes/Localstorage';
import ErrorBoundary from '@/components/common/ErrorBoundary';
import Loading from '@/components/common/Loading';
import { SettingSliderSVG, XSVG } from '@/components/icons';
import { initialSymbolInfoPanelGrid } from '@/constants';
import { useAppDispatch } from '@/features/hooks';
import { setSymbolInfoPanelSetting } from '@/features/slices/modalSlice';
import { useEffect, useRef, useState } from 'react';
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

const Container = ({ symbolISIN, close }: ContainerProps) => {
	const gridRef = useRef<GridLayout | null>(null);

	const dispatch = useAppDispatch();

	const { data: symbolData, isLoading } = useSymbolInfoQuery({
		queryKey: ['symbolInfoQuery', symbolISIN],
	});

	const [layout, setLayout] = useState<Layout[]>(
		symbolData?.isOption
			? LocalstorageInstance.get<Layout[]>(
					'osgl',
					initialSymbolInfoPanelGrid.option,
					(value) => Array.isArray(value) && value.length > 0 && !isNaN(value[0].h),
				)
			: LocalstorageInstance.get<Layout[]>(
					'bsgl',
					initialSymbolInfoPanelGrid.baseSymbol,
					(value) => Array.isArray(value) && value.length > 0 && !isNaN(value[0].h),
				),
	);

	const updateGridLayout = (l: Layout[]) => {
		const gridApi = gridRef.current;
		if (!gridApi) return;

		gridApi.setState({ layout: JSON.parse(JSON.stringify(l)) });
		setLayout(l);
	};

	const onLayoutChange = (l: Layout[]) => {
		setLayout(l);
		LocalstorageInstance.set(isOption ? 'osgl' : 'bsgl', l);
	};

	const onToggleSymbolDetail = (isExpand: boolean) => {
		const l = JSON.parse(JSON.stringify(layout)) as typeof layout;
		const i = layout.findIndex((item) => item.i === 'symbol_detail');

		if (i === -1) return;

		l[i].h = isExpand ? 48.47 : 27.29;

		updateGridLayout(l);
	};

	const openSetting = () => {
		dispatch(
			setSymbolInfoPanelSetting({
				isOption: Boolean(symbolData?.isOption),
			}),
		);
	};

	const isOption = Boolean(symbolData?.isOption);

	useEffect(() => {
		updateGridLayout(isOption ? initialSymbolInfoPanelGrid.option : initialSymbolInfoPanelGrid.baseSymbol);
	}, [isOption]);

	return (
		<div className='h-full px-16 flex-column'>
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
					<ErrorBoundary>
						<SymbolInformation symbolData={symbolData} />
					</ErrorBoundary>

					<div className='relative'>
						<GridLayout
							ref={gridRef}
							onLayoutChange={onLayoutChange}
							className='layout'
							draggableHandle='.drag-handler'
							useCSSTransforms
							isResizable={false}
							compactType='vertical'
							width={360}
							allowOverlap={false}
							cols={1}
							margin={[0, 16]}
							rowHeight={1}
							layout={layout}
						>
							{isOption
								? [
										<div key='option_base_symbol_information'>
											<ErrorBoundary>
												<OptionBaseSymbolInformation />
											</ErrorBoundary>
										</div>,

										<div key='option_detail'>
											<ErrorBoundary>
												<OptionDetail />
											</ErrorBoundary>
										</div>,

										<div key='market_depth'>
											<ErrorBoundary>
												<MarketDepth symbolISIN={symbolISIN} />
											</ErrorBoundary>
										</div>,
									]
								: [
										<div key='symbol_detail'>
											<ErrorBoundary>
												<SymbolDetail
													symbolData={symbolData}
													onToggleSymbolDetail={onToggleSymbolDetail}
												/>
											</ErrorBoundary>
										</div>,

										<div key='base_symbol_contracts'>
											<ErrorBoundary>
												<BaseSymbolContracts symbolISIN={symbolISIN} />
											</ErrorBoundary>
										</div>,

										<div key='user_open_positions'>
											<ErrorBoundary>
												<OpenPositions symbolISIN={symbolISIN} />
											</ErrorBoundary>
										</div>,

										<div key='quotes'>
											<ErrorBoundary>
												<Quotes symbolISIN={symbolISIN} />
											</ErrorBoundary>
										</div>,
									]}

							<div key='individual_and_legal'>
								<ErrorBoundary>
									<IndividualAndLegal symbolData={symbolData} />
								</ErrorBoundary>
							</div>

							{!isOption && [
								<div key='chart'>
									<ErrorBoundary>
										<Chart symbolISIN={symbolISIN} />
									</ErrorBoundary>
								</div>,

								<div key='same_sector_symbols'>
									<ErrorBoundary>
										<SameSectorSymbol symbolISIN={symbolISIN} />
									</ErrorBoundary>
								</div>,

								<div key='supervisor_messages'>
									<ErrorBoundary>
										<Messages symbolISIN={symbolISIN} />
									</ErrorBoundary>
								</div>,
							]}
						</GridLayout>
					</div>
				</div>
			)}
		</div>
	);
};

export default Container;

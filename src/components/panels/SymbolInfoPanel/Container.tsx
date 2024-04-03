import { useSymbolInfoQuery } from '@/api/queries/symbolQuery';
import ErrorBoundary from '@/components/common/ErrorBoundary';
import Loading from '@/components/common/Loading';
import { SettingSliderSVG, XSVG } from '@/components/icons';
import { useState } from 'react';
import GridLayout, { type Layout } from 'react-grid-layout';
import Chart from './components/Chart';
import CoGroupSymbols from './components/CoGroupSymbols';
import Contracts from './components/Contracts';
import IndividualAndLegal from './components/IndividualAndLegal';
import MarketDepth from './components/MarketDepth';
import OpenPositions from './components/OpenPositions';
import OptionBaseSymbolInformation from './components/OptionBaseSymbolInformation';
import OptionDetail from './components/OptionDetail';
import Quotes from './components/Quotes';
import SupervisorMessages from './components/SupervisorMessages';
import SymbolDetail from './components/SymbolDetails';
import SymbolInformation from './components/SymbolInformation';

interface ContainerProps {
	symbolISIN: string;
	close: () => void;
}

const Container = ({ symbolISIN, close }: ContainerProps) => {
	const [layout, setLayout] = useState<Layout[]>([
		{ x: 0, y: 1, w: 1, h: 6.5, i: 'option_base_symbol_information' },
		{ x: 0, y: 2, w: 1, h: 19.765, i: 'option_detail' },
		{ x: 0, y: 3, w: 1, h: 13, i: 'market_depth' },
		{ x: 0, y: 4, w: 1, h: 27.29, i: 'symbol_detail' }, // 48.47
		{ x: 0, y: 5, w: 1, h: 19.765, i: 'contracts' },
		{ x: 0, y: 6, w: 1, h: 19.765, i: 'open_positions' },
		{ x: 0, y: 7, w: 1, h: 17.235, i: 'quotes' },
		{ x: 0, y: 8, w: 1, h: 17.647, i: 'individual_and_legal' },
		{ x: 0, y: 9, w: 1, h: 19.765, i: 'chart' },
		{ x: 0, y: 10, w: 1, h: 19.765, i: 'co_group_symbols' },
		{ x: 0, y: 11, w: 1, h: 19.765, i: 'supervisor_messages' },
	]);

	const { data: symbolData, isFetching } = useSymbolInfoQuery({
		queryKey: ['symbolInfoQuery', symbolISIN],
	});

	const openFeatureToggler = () => {
		//
	};

	const onToggleSymbolDetail = (isExpand: boolean) => {
		const l = [...layout];
		l[3].h = isExpand ? 48.47 : 27.29;

		setLayout(l);
	};

	const isOption = Boolean(symbolData?.isOption);

	return (
		<div className='h-full px-16 flex-column'>
			<div style={{ flex: '0 0 5.6rem' }} className='flex-justify-between'>
				<button type='button' onClick={close}>
					<XSVG width='2rem' className='icon-hover' height='2rem' />
				</button>

				<button type='button' className='icon-hover' onClick={openFeatureToggler}>
					<SettingSliderSVG width='2.4rem' height='2.4rem' />
				</button>
			</div>

			{symbolData && (
				<div className='pb-16 flex-column'>
					<ErrorBoundary>
						<SymbolInformation symbolData={symbolData} />
					</ErrorBoundary>

					<div className='relative'>
						<GridLayout
							className='layout'
							draggableHandle='.drag-handler'
							isResizable={false}
							useCSSTransforms={false}
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
												<SymbolDetail onToggleSymbolDetail={onToggleSymbolDetail} />
											</ErrorBoundary>
										</div>,

										<div key='contracts'>
											<ErrorBoundary>
												<Contracts />
											</ErrorBoundary>
										</div>,

										<div key='open_positions'>
											<ErrorBoundary>
												<OpenPositions />
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
										<Chart />
									</ErrorBoundary>
								</div>,

								<div key='co_group_symbols'>
									<ErrorBoundary>
										<CoGroupSymbols />
									</ErrorBoundary>
								</div>,

								<div key='supervisor_messages'>
									<ErrorBoundary>
										<SupervisorMessages />
									</ErrorBoundary>
								</div>,
							]}
						</GridLayout>
					</div>
				</div>
			)}

			{isFetching && (
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
		</div>
	);
};

export default Container;

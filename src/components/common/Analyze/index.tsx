import ErrorBoundary from '@/components/common/ErrorBoundary';
import Loading from '@/components/common/Loading';
import Tabs from '@/components/common/Tabs/Tabs';
import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import dynamic from 'next/dynamic';

const AnalyzeChart = dynamic(() => import('./AnalyzeChart'), {
	loading: () => <Loading />,
});

const AnalyzeGreeksTable = dynamic(() => import('./AnalyzeGreeksTable'), {
	loading: () => <Loading />,
});

interface AnalyzeProps
	extends Pick<IAnalyzeInputs, 'minPrice' | 'maxPrice' | 'dueDays' | 'bep' | 'income' | 'cost' | 'contractSize'> {
	chartData: IAnalyzeInputs['data'];
	contracts: TSymbolStrategy[];
	baseAssets: number;
	height?: number;
	onChange: (values: Pick<IAnalyzeInputs, 'minPrice' | 'maxPrice'>) => void;
}

const Analyze = ({
	chartData,
	contracts,
	minPrice,
	maxPrice,
	cost,
	income,
	contractSize,
	dueDays,
	baseAssets,
	height,
	bep,
	onChange,
}: AnalyzeProps) => {
	const t = useTranslations('analyze_modal');

	const TABS = [
		{
			id: 'normal',
			title: t('performance'),
			render: () => (
				<div style={{ minHeight: height, maxHeight: height }} className='relative'>
					<ErrorBoundary>
						<AnalyzeChart
							cost={cost}
							income={income}
							contractSize={contractSize}
							dueDays={dueDays}
							data={chartData}
							baseAssets={baseAssets}
							maxPrice={maxPrice}
							minPrice={minPrice}
							height={height ? height - 56 : undefined}
							bep={bep}
							onChange={onChange}
						/>
					</ErrorBoundary>
				</div>
			),
		},
		{
			id: 'strategy',
			title: t('greeks'),
			render: () => (
				<div style={{ minHeight: height, maxHeight: height }} className='relative'>
					<ErrorBoundary>
						<AnalyzeGreeksTable contracts={contracts} />
					</ErrorBoundary>
				</div>
			),
		},
	];

	return (
		<Tabs
			data={TABS}
			defaultActiveTab='normal'
			renderTab={(item, activeTab) => (
				<button
					className={clsx(
						'h-48 px-16 transition-colors flex-justify-center',
						item.id === activeTab ? 'font-medium text-light-gray-700' : 'text-light-gray-500',
					)}
					type='button'
				>
					{item.title}
				</button>
			)}
		/>
	);
};

export default Analyze;

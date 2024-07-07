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
	extends Pick<IAnalyzeInputs, 'minPrice' | 'maxPrice' | 'dueDays' | 'bep' | 'cost' | 'contractSize'> {
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
				<div style={{ height }} className='relative py-16'>
					<ErrorBoundary>
						<AnalyzeChart
							cost={cost}
							contractSize={contractSize}
							dueDays={dueDays}
							data={chartData}
							baseAssets={baseAssets}
							maxPrice={maxPrice}
							minPrice={minPrice}
							onChange={onChange}
							height={!height ? undefined : height - 88}
							bep={bep}
						/>
					</ErrorBoundary>
				</div>
			),
		},
		{
			id: 'strategy',
			title: t('greeks'),
			render: () => (
				<div style={{ height }} className='relative py-16'>
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

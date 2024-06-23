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

interface AnalyzeProps {
	contracts: TSymbolStrategy[];
	chartData: Array<Record<'x' | 'y', number>>;
	bep: number[];
	minPrice: number;
	maxPrice: number;
	baseAssets: number;
	height?: number;
	onChange: (values: Partial<Record<'minPrice' | 'maxPrice', number>>) => void;
}

const Analyze = ({ chartData, contracts, minPrice, maxPrice, baseAssets, height, bep, onChange }: AnalyzeProps) => {
	const t = useTranslations('analyze_modal');

	const TABS = [
		{
			id: 'normal',
			title: t('performance'),
			render: () => (
				<div style={{ height }} className='relative py-16'>
					<ErrorBoundary>
						<AnalyzeChart
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

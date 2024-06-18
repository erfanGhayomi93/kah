import ErrorBoundary from '@/components/common/ErrorBoundary';
import Loading from '@/components/common/Loading';
import Tabs from '@/components/common/Tabs/Tabs';
import { useInputs } from '@/hooks';
import useAnalyze from '@/hooks/useAnalyze';
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
	useCommission: boolean;
	minPrice?: number;
	maxPrice?: number;
	chartHeight?: number;
	baseAssets: number;
}

const Analyze = ({ contracts, minPrice, maxPrice, baseAssets, chartHeight, useCommission }: AnalyzeProps) => {
	const t = useTranslations('analyze_modal');

	const { inputs, setFieldsValue } = useInputs<IAnalyzeInputs>(
		{
			minPrice: minPrice ?? 0,
			maxPrice: maxPrice ?? 0,
			baseAssets,
		},
		true,
	);

	const {
		data,
		maxPrice: newMaxPrice,
		minPrice: newMinPrice,
	} = useAnalyze(contracts, {
		baseAssets: inputs.baseAssets,
		maxPrice: inputs.maxPrice,
		minPrice: inputs.minPrice,
		useCommission,
	});

	const TABS = [
		{
			id: 'normal',
			title: t('performance'),
			render: () => (
				<div style={{ height: '40rem' }} className='relative py-16'>
					<ErrorBoundary>
						<AnalyzeChart
							data={data}
							baseAssets={inputs.baseAssets}
							maxPrice={newMaxPrice}
							minPrice={newMinPrice}
							onChange={setFieldsValue}
							height={chartHeight}
						/>
					</ErrorBoundary>
				</div>
			),
		},
		{
			id: 'strategy',
			title: t('greeks'),
			render: () => (
				<div style={{ height: '40rem' }} className='relative py-16'>
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
						item.id === activeTab ? 'text-light-gray-700 font-medium' : 'text-light-gray-500',
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

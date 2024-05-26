import ErrorBoundary from '@/components/common/ErrorBoundary';
import Loading from '@/components/common/Loading';
import Tabs from '@/components/common/Tabs/Tabs';
import { useInputs } from '@/hooks';
import useAnalyze from '@/hooks/useAnalyze';
import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import dynamic from 'next/dynamic';

const PerformanceChart = dynamic(() => import('./PerformanceChart'), {
	loading: () => <Loading />,
});

const GreeksTable = dynamic(() => import('./GreeksTable'), {
	loading: () => <Loading />,
});

interface AnalyzeProps {
	contracts: TSymbolStrategy[];
	useCommission: boolean;
	minPrice?: number;
	maxPrice?: number;
	baseAssets: number;
}

const Analyze = ({ contracts, minPrice, maxPrice, baseAssets, useCommission }: AnalyzeProps) => {
	const t = useTranslations('analyze_modal');

	const { inputs, setFieldsValue } = useInputs<IAnalyzeInputs>({
		minPrice: minPrice ?? 0,
		maxPrice: maxPrice ?? 0,
		baseAssets,
	});

	const { data } = useAnalyze(contracts, {
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
						<PerformanceChart data={data} inputs={inputs} onChange={setFieldsValue} />
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
						<GreeksTable contracts={contracts} />
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
						item.id === activeTab ? 'font-medium text-gray-900' : 'text-gray-700',
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

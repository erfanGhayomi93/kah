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
	height?: number;
	baseAssets: number;
	manually?: IAnalyzeInputs;
}

const Analyze = ({ contracts, minPrice, maxPrice, baseAssets, height, useCommission, manually }: AnalyzeProps) => {
	const t = useTranslations('analyze_modal');

	const { inputs, setFieldsValue } = useInputs<Record<'minPrice' | 'maxPrice', number>>(
		{
			minPrice: minPrice ?? 0,
			maxPrice: maxPrice ?? 0,
		},
		true,
	);

	const {
		data,
		maxPrice: newMaxPrice,
		minPrice: newMinPrice,
		bep,
	} = useAnalyze(contracts, {
		enabled: manually === undefined,
		baseAssets,
		maxPrice: inputs.maxPrice,
		minPrice: inputs.minPrice,
		useCommission,
	});

	const TABS = [
		{
			id: 'normal',
			title: t('performance'),
			render: () => (
				<div style={{ height }} className='relative py-16'>
					<ErrorBoundary>
						<AnalyzeChart
							data={data}
							baseAssets={baseAssets}
							maxPrice={newMaxPrice}
							minPrice={newMinPrice}
							onChange={setFieldsValue}
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

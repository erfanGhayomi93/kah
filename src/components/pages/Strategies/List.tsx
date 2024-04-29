'use client';

import { useGetAllStrategyQuery } from '@/api/queries/strategyQuery';
import Loading from '@/components/common/Loading';
import NoData from '@/components/common/NoData';
import { useAppSelector } from '@/features/hooks';
import { getStrategyTrend } from '@/features/slices/tabSlice';
import { useMemo } from 'react';
import StrategyItem from './StrategyItem';

const List = () => {
	const strategyTrend = useAppSelector(getStrategyTrend);

	const { data, isLoading } = useGetAllStrategyQuery({
		queryKey: ['getAllStrategyQuery'],
	});

	const filteredStrategies = useMemo<Strategy.GetAll[]>(() => {
		if (!data?.length) return [];

		if (strategyTrend === 'all') return data;

		return data.filter((item) => item.tags.includes(strategyTrend));
	}, [strategyTrend, data]);

	if (isLoading)
		return (
			<div className='relative flex-1 rounded bg-white'>
				<Loading />
			</div>
		);

	if (!filteredStrategies?.length)
		return (
			<div className='flex-1 rounded bg-white'>
				<div style={{ marginTop: '9.6rem' }}>
					<NoData />
				</div>
			</div>
		);

	return (
		<div className='relative flex h-full flex-wrap rounded bg-white px-8 py-24'>
			{filteredStrategies.map((item) => (
				<StrategyItem key={item.id} {...item} />
			))}
		</div>
	);
};

export default List;

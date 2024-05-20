'use client';

import { useGetAllStrategyQuery } from '@/api/queries/strategyQuery';
import Loading from '@/components/common/Loading';
import NoData from '@/components/common/NoData';
import { useAppSelector } from '@/features/hooks';
import { getStrategyTrend } from '@/features/slices/tabSlice';
import { useMemo } from 'react';
import StrategyItem from './Item';

const List = () => {
	const strategyTrend = useAppSelector(getStrategyTrend);

	const { data, isLoading } = useGetAllStrategyQuery({
		queryKey: ['getAllStrategyQuery'],
	});

	const filteredStrategies = useMemo<Strategy.GetAll[]>(() => {
		if (!data?.length) return [];

		if (strategyTrend === 'All') return data;

		return data.filter((item) => item.tags.includes(strategyTrend));
	}, [strategyTrend, data]);

	if (isLoading) return <Loading />;

	if (!filteredStrategies?.length)
		return (
			<div className='absolute center'>
				<NoData />
			</div>
		);

	return filteredStrategies.map((item) => <StrategyItem key={item.id} {...item} />);
};

export default List;

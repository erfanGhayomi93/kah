'use client';

import { useGetAllStrategyQuery } from '@/api/queries/strategyQuery';
import Main from '@/components/layout/Main';
import { useMemo } from 'react';
import Descriptions from './Descriptions';
import Table from './Table';

export interface ISelectItem {
	id: TPriceBasis;
	title: string;
}

interface StrategyProps {
	id: Strategy.Type;
}

const Strategy = ({ id }: StrategyProps) => {
	const { data } = useGetAllStrategyQuery({
		queryKey: ['getAllStrategyQuery'],
	});

	const strategy = useMemo(() => {
		if (!data?.length) return null;

		return data.find((item) => item.type === id) ?? null;
	}, [data]);

	if (!strategy) return null;

	return (
		<Main className='!px-8'>
			<Descriptions strategy={strategy} />
			<Table strategy={strategy} />
		</Main>
	);
};

export default Strategy;

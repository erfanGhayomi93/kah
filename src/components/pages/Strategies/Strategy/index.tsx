'use client';

import { useGetAllStrategyQuery } from '@/api/queries/strategyQuery';
import Main from '@/components/layout/Main';
import dynamic from 'next/dynamic';
import { useMemo } from 'react';

interface StrategyProps {
	id: Strategy.Type;
}

const CoveredCall = dynamic(() => import('./Strategies/CoveredCall'));
const LongCall = dynamic(() => import('./Strategies/LongCall'));
const LongPut = dynamic(() => import('./Strategies/LongPut'));
const ProtectivePut = dynamic(() => import('./Strategies/ProtectivePut'));
const BullCallSpread = dynamic(() => import('./Strategies/BullCallSpread'));
const LongStraddle = dynamic(() => import('./Strategies/LongStraddle'));
const Conversion = dynamic(() => import('./Strategies/Conversion'));
const BearPutSpread = dynamic(() => import('./Strategies/BearPutSpread'));

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
			{id === 'CoveredCall' && <CoveredCall {...strategy} />}

			{id === 'LongCall' && <LongCall {...strategy} />}

			{id === 'LongPut' && <LongPut {...strategy} />}

			{id === 'ProtectivePut' && <ProtectivePut {...strategy} />}

			{id === 'BullCallSpread' && <BullCallSpread {...strategy} />}

			{id === 'LongStraddle' && <LongStraddle {...strategy} />}

			{id === 'Conversion' && <Conversion {...strategy} />}

			{id === 'BearPutSpread' && <BearPutSpread {...strategy} />}
		</Main>
	);
};

export default Strategy;

'use client';

import dynamic from 'next/dynamic';

interface StrategyProps extends Strategy.GetAll {}

const CoveredCall = dynamic(() => import('./Strategies/CoveredCall'));

const LongCall = dynamic(() => import('./Strategies/LongCall'));

const LongPut = dynamic(() => import('./Strategies/LongPut'));

const ProtectivePut = dynamic(() => import('./Strategies/ProtectivePut'));

const BullCallSpread = dynamic(() => import('./Strategies/BullCallSpread'));

const LongStraddle = dynamic(() => import('./Strategies/LongStraddle'));

const Conversion = dynamic(() => import('./Strategies/Conversion'));

const BearPutSpread = dynamic(() => import('./Strategies/BearPutSpread'));

const Strategy = (strategy: StrategyProps) => {
	const { type } = strategy;

	if (type === 'CoveredCall') return <CoveredCall {...strategy} />;

	if (type === 'LongCall') return <LongCall {...strategy} />;

	if (type === 'LongPut') return <LongPut {...strategy} />;

	if (type === 'ProtectivePut') return <ProtectivePut {...strategy} />;

	if (type === 'BullCallSpread') return <BullCallSpread {...strategy} />;

	if (type === 'LongStraddle') return <LongStraddle {...strategy} />;

	if (type === 'Conversion') return <Conversion {...strategy} />;

	if (type === 'BearPutSpread') return <BearPutSpread {...strategy} />;

	return null;
};

export default Strategy;

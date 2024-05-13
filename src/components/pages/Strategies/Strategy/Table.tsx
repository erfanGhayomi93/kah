'use client';

import Loading from '@/components/common/Loading';
import dynamic from 'next/dynamic';

interface TableProps {
	strategy: Strategy.GetAll;
}

const BullCallSpread = dynamic(() => import('./StrategyTables/BullCallSpread'), {
	loading: () => <Loading />,
});

const CoveredCall = dynamic(() => import('./StrategyTables/CoveredCall'), {
	loading: () => <Loading />,
});

const LongCall = dynamic(() => import('./StrategyTables/LongCall'), {
	loading: () => <Loading />,
});

const LongPut = dynamic(() => import('./StrategyTables/LongPut'), {
	loading: () => <Loading />,
});

const ProtectivePut = dynamic(() => import('./StrategyTables/ProtectivePut'), {
	loading: () => <Loading />,
});

const LongStraddle = dynamic(() => import('./StrategyTables/LongStraddle'), {
	loading: () => <Loading />,
});

const Conversion = dynamic(() => import('./StrategyTables/Conversion'), {
	loading: () => <Loading />,
});

const Table = ({ strategy }: TableProps) => {
	const { type } = strategy;

	return (
		<div className='relative flex-1 gap-16 overflow-hidden rounded bg-white p-16 flex-column'>
			{type === 'CoveredCall' && <CoveredCall {...strategy} />}

			{type === 'LongCall' && <LongCall {...strategy} />}

			{type === 'LongPut' && <LongPut {...strategy} />}

			{type === 'ProtectivePut' && <ProtectivePut {...strategy} />}

			{type === 'BullCallSpread' && <BullCallSpread {...strategy} />}

			{type === 'LongStraddle' && <LongStraddle {...strategy} />}

			{type === 'Conversion' && <Conversion {...strategy} />}
		</div>
	);
};

export default Table;

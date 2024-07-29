'use client';

import Loading from '@/components/common/Loading';
import dynamic from 'next/dynamic';

interface GridProps {
	strategy: Strategy.GetAll;
}

const BullCallSpread = dynamic(() => import('./Strategies/BullCallSpread'), {
	loading: () => <Loading />,
});

const CoveredCall = dynamic(() => import('./Strategies/CoveredCall'), {
	loading: () => <Loading />,
});

const LongCall = dynamic(() => import('./Strategies/LongCall'), {
	loading: () => <Loading />,
});

const LongPut = dynamic(() => import('./Strategies/LongPut'), {
	loading: () => <Loading />,
});

const ProtectivePut = dynamic(() => import('./Strategies/ProtectivePut'), {
	loading: () => <Loading />,
});

const LongStraddle = dynamic(() => import('./Strategies/LongStraddle'), {
	loading: () => <Loading />,
});

const Conversion = dynamic(() => import('./Strategies/Conversion'), {
	loading: () => <Loading />,
});

const Grid = ({ strategy }: GridProps) => {
	const { type } = strategy;

	return (
		<div className='darkBlue:bg-gray-50 relative flex-1 gap-16 overflow-hidden rounded bg-white p-16 flex-column dark:bg-gray-50'>
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

export default Grid;

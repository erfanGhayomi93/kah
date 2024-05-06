'use client';

import Select from '@/components/common/Inputs/Select';
import Switch from '@/components/common/Inputs/Switch';
import Loading from '@/components/common/Loading';
import TableActions from '@/components/common/Toolbar/TableActions';
import { useLocalstorage } from '@/hooks';
import { useTranslations } from 'next-intl';
import dynamic from 'next/dynamic';
import { useMemo, useState } from 'react';

interface ISelectItem {
	id: TPriceBasis;
	title: string;
}

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

const Table = ({ strategy }: TableProps) => {
	const t = useTranslations();

	const [useCommission, setUseCommission] = useLocalstorage('use_commission', true);

	const [priceBasis, setPriceBasis] = useState<ISelectItem>({
		id: 'LastTradePrice',
		title: t('strategy.last_traded_price'),
	});

	const options: ISelectItem[] = useMemo(
		() => [
			{ id: 'LastTradePrice', title: t('strategy.last_traded_price') },
			{ id: 'ClosingPrice', title: t('strategy.closing_price') },
			{ id: 'BestLimit', title: t('strategy.headline') },
		],
		[],
	);

	const { title, type } = strategy;

	return (
		<div className='relative flex-1 gap-16 overflow-hidden rounded bg-white p-16 flex-column'>
			<div style={{ flex: '0 0 4rem' }} className='flex-justify-between'>
				<div className='flex-1 flex-justify-start'>
					<div className='flex gap-4 font-medium text-gray-900'>
						<h1 className='text-base'>{t(`${type}.title`)}</h1>
						<h2 className='text-base text-gray-700'>({title})</h2>
					</div>
				</div>

				<div className='flex-1 gap-24 flex-justify-end'>
					<div className='h-40 gap-8 flex-items-center'>
						<span className='text-tiny font-medium text-gray-900'>{t('strategy.with_commission')}</span>
						<Switch checked={useCommission} onChange={(v) => setUseCommission(v)} />
					</div>

					<div style={{ flex: '0 0 28.4rem' }} className='flex-1 gap-8 flex-justify-end'>
						<Select<ISelectItem>
							defaultValue={priceBasis}
							options={options}
							placeholder={t('strategy.price_basis')}
							onChange={(v) => setPriceBasis(v)}
							getOptionId={(option) => option.id}
							getOptionTitle={(option) => option.title}
						/>

						<TableActions />
					</div>
				</div>
			</div>

			{type === 'CoveredCall' && <CoveredCall priceBasis={priceBasis.id} withCommission={useCommission} />}

			{type === 'LongCall' && <LongCall />}

			{type === 'LongPut' && <LongPut />}

			{type === 'ProtectivePut' && <ProtectivePut />}

			{type === 'BullCallSpread' && <BullCallSpread priceBasis={priceBasis.id} withCommission={useCommission} />}
		</div>
	);
};

export default Table;

'use client';

import NoData from '@/components/common/NoData';
import { useAppDispatch } from '@/features/hooks';
import { setSelectSymbolContractsModal } from '@/features/slices/modalSlice';
import { useTranslations } from 'next-intl';

const StrategyContracts = () => {
	const t = useTranslations('build_strategy');

	const dispatch = useAppDispatch();

	const onContractsChanged = (contracts: Option.Root[], baseSymbolISIN: null | string) => {
		//
	};

	const buildStrategy = () => {
		dispatch(
			setSelectSymbolContractsModal({
				canChangeBaseSymbol: true,
				canSendBaseSymbol: true,
				initialSelectedContracts: [],
				maxContracts: null,
				symbol: null,
				callback: onContractsChanged,
			}),
		);
	};

	return (
		<div
			style={{ width: '30rem', maxWidth: '90%', top: '7.2rem' }}
			className='absolute left-1/2 -translate-x-1/2 gap-24 flex-column'
		>
			<NoData text={t('no_data')} />
			<button onClick={buildStrategy} type='button' className='h-40 rounded font-medium btn-primary'>
				{t('create_your_strategy')}
			</button>
		</div>
	);
};

export default StrategyContracts;

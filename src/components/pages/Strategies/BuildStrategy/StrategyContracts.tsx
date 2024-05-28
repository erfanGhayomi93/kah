'use client';

import NoData from '@/components/common/NoData';
import { useAppDispatch, useAppSelector } from '@/features/hooks';
import { setSelectSymbolContractsModal } from '@/features/slices/modalSlice';
import { getBuiltStrategy, setBuiltStrategy } from '@/features/slices/uiSlice';
import { convertSymbolWatchlistToSymbolBasket, uuidv4 } from '@/utils/helpers';
import { useTranslations } from 'next-intl';

const StrategyContracts = () => {
	const t = useTranslations('build_strategy');

	const dispatch = useAppDispatch();

	const builtStrategy = useAppSelector(getBuiltStrategy);

	const handleContracts = (contracts: Option.Root[], baseSymbol: Symbol.Info | null) => {
		const l = contracts.length;

		const result: TSymbolStrategy[] = [];

		try {
			for (let i = 0; i < l; i++) {
				result.push(convertSymbolWatchlistToSymbolBasket(contracts[i], 'buy'));
			}

			if (baseSymbol) {
				result.push({
					type: 'base',
					id: uuidv4(),
					marketUnit: baseSymbol.marketUnit,
					quantity: 1,
					price: baseSymbol.lastTradedPrice,
					side: 'buy',
					symbol: {
						symbolTitle: baseSymbol.symbolTitle,
						symbolISIN: baseSymbol.symbolISIN,
						baseSymbolPrice: baseSymbol.lastTradedPrice,
					},
				});
			}

			dispatch(setBuiltStrategy(result));
		} catch (e) {
			//
		}
	};

	const buildStrategy = () => {
		dispatch(
			setSelectSymbolContractsModal({
				suppressBaseSymbolChange: false,
				suppressSendBaseSymbol: false,
				callback: handleContracts,
			}),
		);
	};

	if (builtStrategy.length === 0)
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

	return <div />;
};

export default StrategyContracts;

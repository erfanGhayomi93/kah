'use client';

import ErrorBoundary from '@/components/common/ErrorBoundary';
import NoData from '@/components/common/NoData';
import { useAppDispatch, useAppSelector } from '@/features/hooks';
import { setSelectSymbolContractsModal } from '@/features/slices/modalSlice';
import { getBuiltStrategy, setBuiltStrategy } from '@/features/slices/uiSlice';
import { convertSymbolWatchlistToSymbolBasket, uuidv4 } from '@/utils/helpers';
import { useTranslations } from 'next-intl';
import dynamic from 'next/dynamic';
import { useMemo, useState } from 'react';

const StrategyContracts = dynamic(() => import('./StrategyContracts'));

const StrategyDetails = dynamic(() => import('./StrategyDetails'));

const BuildStrategy = () => {
	const t = useTranslations('build_strategy');

	const dispatch = useAppDispatch();

	const builtStrategyContracts = useAppSelector(getBuiltStrategy);

	const [selectedContracts, setSelectedContracts] = useState<string[]>(builtStrategyContracts.map(({ id }) => id));

	const handleContracts = (contracts: Option.Root[], baseSymbol: Symbol.Info | null) => {
		const l = contracts.length;

		const result: TSymbolStrategy[] = [];
		const selectedResult: string[] = [];

		try {
			let contractSize = 0;

			for (let i = 0; i < l; i++) {
				const contract: IOptionStrategy = {
					...convertSymbolWatchlistToSymbolBasket(contracts[i], 'buy'),
					tradeCommission: false,
					strikeCommission: false,
					requiredMargin: false,
					tax: false,
					vDefault: false,
				};
				contractSize = Math.max(contractSize, contract.symbol.contractSize);

				result.push(contract);
				selectedResult.push(contract.id);
			}

			if (baseSymbol) {
				const baseSymbolId = uuidv4();
				result.push({
					type: 'base',
					id: baseSymbolId,
					marketUnit: baseSymbol.marketUnit,
					quantity: 1,
					price: baseSymbol.lastTradedPrice,
					side: 'buy',
					symbol: {
						symbolTitle: baseSymbol.symbolTitle,
						symbolISIN: baseSymbol.symbolISIN,
						baseSymbolPrice: baseSymbol.lastTradedPrice,
						contractSize,
					},
				});
				selectedResult.push(baseSymbolId);
			}

			dispatch(setBuiltStrategy(result));
			setSelectedContracts(selectedResult);
		} catch (e) {
			//
		}
	};

	const upsert = () => {
		const initialBaseSymbolISIN =
			builtStrategyContracts.find((item) => item.type === 'base')?.symbol.symbolISIN ?? undefined;

		const initialSelectedContracts = builtStrategyContracts
			.filter((item) => item.type === 'option')
			.map((item) => item.symbol.symbolISIN);

		dispatch(
			setSelectSymbolContractsModal({
				initialSelectedContracts,
				suppressBaseSymbolChange: false,
				suppressSendBaseSymbol: false,
				initialBaseSymbolISIN,
				initialSelectedBaseSymbol: Boolean(initialBaseSymbolISIN),
				callback: handleContracts,
			}),
		);
	};

	const selectedContractsSymbol = useMemo(() => {
		const result: OrderBasket.Order[] = [];

		for (let i = 0; i < selectedContracts.length; i++) {
			const orderId = selectedContracts[i];
			const order = builtStrategyContracts.find((order) => order.id === orderId);
			if (order) result.push(order);
		}

		return result;
	}, [selectedContracts, builtStrategyContracts]);

	return (
		<div className='relative flex-1 gap-16 overflow-auto rounded bg-white p-24 flex-column'>
			{builtStrategyContracts.length === 0 ? (
				<div
					style={{ width: '30rem', maxWidth: '90%', top: '7.2rem' }}
					className='absolute left-1/2 -translate-x-1/2 gap-24 flex-column'
				>
					<NoData imgName='search-empty.png' text={null} width={176} height={176} />
					<button onClick={upsert} type='button' className='h-40 rounded font-medium btn-primary'>
						{t('create_your_strategy')}
					</button>
				</div>
			) : (
				<ErrorBoundary>
					<StrategyContracts
						contracts={builtStrategyContracts}
						selectedContracts={selectedContracts}
						upsert={upsert}
						setSelectedContracts={setSelectedContracts}
					/>
				</ErrorBoundary>
			)}

			{selectedContractsSymbol.length > 0 && (
				<ErrorBoundary>
					<StrategyDetails contracts={selectedContractsSymbol} />
				</ErrorBoundary>
			)}
		</div>
	);
};

export default BuildStrategy;

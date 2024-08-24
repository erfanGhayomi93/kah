'use client';

import { useOptionInfoMutation } from '@/api/mutations/optionMutations';
import { useSymbolInfoMutation } from '@/api/mutations/symbolMutations';
import ErrorBoundary from '@/components/common/ErrorBoundary';
import Loading from '@/components/common/Loading';
import NoData from '@/components/common/NoData';
import { useAppDispatch, useAppSelector } from '@/features/hooks';
import { setSelectSymbolContractsModal } from '@/features/slices/modalSlice';
import { getBuiltStrategy, setBuiltStrategy } from '@/features/slices/uiSlice';
import { usePathname, useRouter } from '@/navigation';
import { convertSymbolWatchlistToSymbolBasket, uuidv4 } from '@/utils/helpers';
import { useTranslations } from 'next-intl';
import dynamic from 'next/dynamic';
import { useSearchParams } from 'next/navigation';
import { useLayoutEffect, useMemo, useState } from 'react';

const StrategyContracts = dynamic(() => import('./StrategyContracts'));

const StrategyDetails = dynamic(() => import('./StrategyDetails'));

const BuildStrategy = () => {
	const t = useTranslations('build_strategy');

	const dispatch = useAppDispatch();

	const router = useRouter();

	const pathname = usePathname();

	const searchParams = useSearchParams();

	const builtStrategyContracts = useAppSelector(getBuiltStrategy);

	const [selectedContracts, setSelectedContracts] = useState<string[]>(builtStrategyContracts.map(({ id }) => id));

	const { mutateAsync: fetchInitialContracts, isPending: isFetchingContracts } = useOptionInfoMutation();

	const { mutateAsync: fetchSymbolInfo, isPending: isFetchingBaseSymbol } = useSymbolInfoMutation();

	const handleSelectedContracts = (contracts: ISelectedContract[], baseSymbol: Symbol.Info | null) => {
		const l = contracts.length;

		const result: TSymbolStrategy[] = [];
		const selectedResult: string[] = [];
		const params = new URLSearchParams();

		try {
			let contractSize = 0;

			for (let i = 0; i < l; i++) {
				const c = contracts[i];
				const contract: IOptionStrategy = {
					...convertSymbolWatchlistToSymbolBasket(
						{ optionWatchlistData: c.optionWatchlistData, symbolInfo: c.symbolInfo },
						c.side,
					),
					tradeCommission: false,
					strikeCommission: false,
					requiredMargin: false,
					tax: false,
					vDefault: false,
				};
				contractSize = Math.max(contractSize, contract.symbol.contractSize);

				result.push(contract);
				selectedResult.push(contract.id);

				params.set(`contract[${i}]`, `${c.symbolInfo.symbolISIN},${c.side}`);
			}

			if (baseSymbol) {
				const baseSymbolId = uuidv4();
				result.push({
					type: 'base',
					id: baseSymbolId,
					marketUnit: baseSymbol.marketUnit,
					quantity: contractSize,
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
				params.set('baseSymbol', `${baseSymbol.symbolISIN},buy`);
			}

			router.replace(`${pathname}?${params.toString()}`);

			dispatch(setBuiltStrategy(result));
			setSelectedContracts(selectedResult);
		} catch (e) {
			//
		}
	};

	const handleInitialContracts = (contracts: Option.Root[], symbols: Record<string, TBsSides>) => {
		const result: TSymbolStrategy[] = [];

		try {
			let contractSize = 0;

			for (let i = 0; i < contracts.length; i++) {
				const c = contracts[i];
				contractSize = Math.max(contractSize, c.symbolInfo.contractSize);

				result.push({
					...convertSymbolWatchlistToSymbolBasket(
						{ optionWatchlistData: c.optionWatchlistData, symbolInfo: c.symbolInfo },
						symbols[c.symbolInfo.symbolISIN] ?? 'buy',
					),
					tradeCommission: false,
					strikeCommission: false,
					requiredMargin: false,
					tax: false,
					vDefault: false,
				});
			}
		} catch (e) {
			//
		}

		return result;
	};

	const handleInitialBaseSymbol = (
		symbolInfo: Symbol.Info,
		side: TBsSides,
		contractSize: number,
		contracts: TSymbolStrategy[],
	) => {
		try {
			const result: TSymbolStrategy[] = [...contracts];
			const selectedResult: string[] = contracts.map((c) => c.id);

			const id = uuidv4();
			const item: TSymbolStrategy = {
				type: 'base',
				id,
				marketUnit: symbolInfo.marketUnit,
				quantity: contractSize,
				price: symbolInfo.lastTradedPrice,
				side,
				symbol: {
					symbolTitle: symbolInfo.symbolTitle,
					symbolISIN: symbolInfo.symbolISIN,
					baseSymbolPrice: symbolInfo.lastTradedPrice,
					contractSize,
				},
			};

			result.unshift(item);
			selectedResult.push(item.id);

			dispatch(setBuiltStrategy(result));
			setSelectedContracts(selectedResult);
		} catch (e) {
			//
		}
	};

	const upsert = () => {
		const initialBaseSymbol = builtStrategyContracts.find((item) => item.type === 'base') ?? null;

		const initialSelectedContracts: Array<[string, TBsSides]> = builtStrategyContracts
			.filter((item) => item.type === 'option')
			.map((item) => [item.symbol.symbolISIN, item.side]);

		dispatch(
			setSelectSymbolContractsModal({
				initialSelectedContracts,
				suppressBaseSymbolChange: false,
				suppressSendBaseSymbol: false,
				initialBaseSymbol: initialBaseSymbol
					? [initialBaseSymbol.symbol.symbolISIN, initialBaseSymbol.side]
					: undefined,
				initialSelectedBaseSymbol: Boolean(initialBaseSymbol),
				callback: handleSelectedContracts,
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

	useLayoutEffect(() => {
		try {
			const result: Record<string, TBsSides> = {};
			let baseSymbol: null | [string, TBsSides] = null;

			const paramsAsString = decodeURIComponent(searchParams.toString());
			if (!paramsAsString) return;

			const pairs = paramsAsString.split('&');

			for (const pair of pairs) {
				const [key, value] = pair.split('=');
				const [symbolISIN, action] = value.split(',');

				const side: TBsSides = action === 'buy' || action === 'sell' ? action : 'buy';

				if (key === 'baseSymbol') baseSymbol = [symbolISIN, side];
				else result[symbolISIN] = side;
			}

			const symbolsISIN = Object.keys(result);
			if (symbolsISIN.length > 0) {
				fetchInitialContracts(symbolsISIN).then((contracts) => {
					const insertedContracts = handleInitialContracts(contracts, result);

					if (baseSymbol) {
						const contractSize = Math.max(...contracts.map((c) => c.symbolInfo.contractSize));
						fetchSymbolInfo({ symbolISIN: baseSymbol[0] }).then((symbolInfo) =>
							handleInitialBaseSymbol(symbolInfo, baseSymbol[1], contractSize, insertedContracts),
						);
					} else {
						dispatch(setBuiltStrategy(insertedContracts));
						setSelectedContracts(insertedContracts.map((c) => c.id));
					}
				});
			}
		} catch (e) {
			//
		}
	}, []);

	return (
		<div className='relative flex-1 gap-16 overflow-auto rounded bg-white p-24 flex-column darkness:bg-gray-50'>
			{isFetchingContracts || isFetchingBaseSymbol ? (
				<div className='absolute left-0 top-0 z-99 size-full'>
					<Loading />
				</div>
			) : (
				<>
					{builtStrategyContracts.length === 0 ? (
						<div
							style={{ width: '30rem', maxWidth: '90%', top: '7.2rem' }}
							className='absolute left-1/2 -translate-x-1/2 gap-24 flex-column'
						>
							<NoData text={null} width={176} height={176} />
							<button onClick={upsert} type='button' className='h-40 rounded font-medium btn-primary'>
								{t('create_your_strategy')}
							</button>
						</div>
					) : (
						<ErrorBoundary>
							<StrategyContracts
								contracts={builtStrategyContracts}
								selectedContracts={selectedContracts}
								setSelectedContracts={setSelectedContracts}
								upsert={upsert}
							/>
						</ErrorBoundary>
					)}

					{selectedContractsSymbol.length > 0 && (
						<ErrorBoundary>
							<StrategyDetails contracts={selectedContractsSymbol} />
						</ErrorBoundary>
					)}
				</>
			)}
		</div>
	);
};

export default BuildStrategy;

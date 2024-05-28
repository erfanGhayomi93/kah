'use client';

import Button from '@/components/common/Button';
import NoData from '@/components/common/NoData';
import SymbolStrategyTable from '@/components/common/Tables/SymbolStrategyTable';
import { BookmarkSVG } from '@/components/icons';
import { useAppDispatch, useAppSelector } from '@/features/hooks';
import { setSelectSymbolContractsModal } from '@/features/slices/modalSlice';
import { getBuiltStrategy, setBuiltStrategy } from '@/features/slices/uiSlice';
import { useBasketOrderingSystem } from '@/hooks';
import { getBasketAlertMessage } from '@/hooks/useBasketOrderingSystem';
import { convertSymbolWatchlistToSymbolBasket, sepNumbers, uuidv4 } from '@/utils/helpers';
import { useTranslations } from 'next-intl';
import { useMemo, useState } from 'react';
import { toast } from 'react-toastify';

const StrategyContracts = () => {
	const t = useTranslations();

	const dispatch = useAppDispatch();

	const builtStrategy = useAppSelector(getBuiltStrategy);

	const [selectedContracts, setSelectedContracts] = useState<string[]>([]);

	const { submit, submitting } = useBasketOrderingSystem({
		onSent: ({ failedOrders, sentOrders }) => {
			toast.success(t(getBasketAlertMessage(failedOrders.length, sentOrders.length)));
		},
	});

	const handleContracts = (contracts: Option.Root[], baseSymbol: Symbol.Info | null) => {
		const l = contracts.length;

		const result: TSymbolStrategy[] = [];
		const selectedResult: string[] = [];

		try {
			for (let i = 0; i < l; i++) {
				const contract = convertSymbolWatchlistToSymbolBasket(contracts[i], 'buy');

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

	const setContractProperties = (
		id: string,
		values: Partial<Pick<TSymbolStrategy, 'price' | 'quantity' | 'side'>>,
	) => {
		const contracts = JSON.parse(JSON.stringify(builtStrategy)) as TSymbolStrategy[];

		const orderIndex = contracts.findIndex((item) => item.id === id);
		if (orderIndex === -1) return;

		contracts[orderIndex] = {
			...contracts[orderIndex],
			...values,
		};

		dispatch(setBuiltStrategy(contracts));
	};

	const deleteContract = (id: string) => {
		const filteredContracts = builtStrategy.filter((item) => item.id !== id);

		dispatch(setBuiltStrategy(filteredContracts));
		setSelectedContracts(filteredContracts.map(({ id }) => id));
	};

	const storeBuiltStrategy = () => {
		//
	};

	const sendAllStrategyContracts = () => {
		submit(builtStrategy);
	};

	const addToVirtualPortfolio = () => {
		//
	};

	const upsert = () => {
		dispatch(
			setSelectSymbolContractsModal({
				initialSelectedContracts: builtStrategy.map((item) => item.symbol.symbolISIN),
				suppressBaseSymbolChange: false,
				suppressSendBaseSymbol: false,
				callback: handleContracts,
			}),
		);
	};

	const { requiredMargin, tradeCommission, strikeCommission, tax, vDefault } = useMemo(() => {
		const result: Record<'requiredMargin' | 'tradeCommission' | 'strikeCommission' | 'tax' | 'vDefault', number> = {
			requiredMargin: 0,
			tradeCommission: 0,
			strikeCommission: 0,
			tax: 0,
			vDefault: 0,
		};

		for (let i = 0; i < builtStrategy.length; i++) {
			const contract = builtStrategy[i];

			result.requiredMargin += contract.requiredMargin?.value ?? 0;
			result.tradeCommission += contract.tradeCommission?.value ?? 0;
			result.strikeCommission += contract.strikeCommission?.value ?? 0;
			result.tax += contract.tax?.value ?? 0;
			result.vDefault += contract.vDefault?.value ?? 0;
		}

		return result;
	}, [builtStrategy]);

	if (builtStrategy.length === 0)
		return (
			<div
				style={{ width: '30rem', maxWidth: '90%', top: '7.2rem' }}
				className='absolute left-1/2 -translate-x-1/2 gap-24 flex-column'
			>
				<NoData imgName='search-empty.png' text={null} width={176} height={176} />
				<button onClick={upsert} type='button' className='h-40 rounded font-medium btn-primary'>
					{t('build_strategy.create_your_strategy')}
				</button>
			</div>
		);

	return (
		<div className='h-full justify-between py-16 flex-column'>
			<div className='flex-1 overflow-hidden flex-column'>
				<div className='px-16 flex-justify-between'>
					<h1 className='text-base font-medium'>{t('build_strategy.new_strategy')}</h1>
				</div>

				<div className='flex-1 overflow-auto px-8'>
					<SymbolStrategyTable
						selectedContracts={selectedContracts}
						contracts={builtStrategy}
						onSelectionChanged={setSelectedContracts}
						onChange={(id, v) => setContractProperties(id, v)}
						onSideChange={(id, value) => setContractProperties(id, { side: value })}
						onDelete={deleteContract}
						showDetails={false}
						withTradeCommission
						withStrikeCommission
						withContractSize
						withRequiredMargin
						withDefault
						withTax
					/>
				</div>
			</div>

			<div className='justify-between gap-16 bg-white px-16 pt-20 flex-column'>
				<div className='relative h-24 border-t border-t-gray-500'>
					<ul
						style={{ top: '-1.2rem' }}
						className='absolute left-24 gap-8 bg-white px-16 flex-items-center *:gap-4 *:truncate *:pr-8 *:flex-items-center'
					>
						<li className='w-72 justify-end font-medium text-gray-900'>{t('build_strategy.aggregate')}:</li>
						<li className='w-88 text-gray-1000'>
							{sepNumbers(String(requiredMargin))}
							<span className='text-gray-700'>{t('common.rial')}</span>
						</li>
						<li className='w-88 text-gray-1000'>
							{sepNumbers(String(tradeCommission))}
							<span className='text-gray-700'>{t('common.rial')}</span>
						</li>
						<li className='w-88 text-gray-1000'>
							{sepNumbers(String(strikeCommission))}
							<span className='text-gray-700'>{t('common.rial')}</span>
						</li>
						<li className='w-88 text-gray-1000'>
							{sepNumbers(String(tax))}
							<span className='text-gray-700'>{t('common.rial')}</span>
						</li>
						<li className='w-88 text-gray-1000'>
							{sepNumbers(String(vDefault))}
							<span className='text-gray-700'>{t('common.rial')}</span>
						</li>
					</ul>
				</div>

				<div className='gap-8 flex-justify-end *:h-40'>
					<Button onClick={upsert} type='button' className='rounded px-48 btn-primary-outline'>
						{t('build_strategy.upsert')}
					</Button>
					<Button onClick={addToVirtualPortfolio} type='button' className='rounded px-40 btn-primary-outline'>
						{t('build_strategy.add_to_virtual_portfolio')}
					</Button>
					<Button
						onClick={sendAllStrategyContracts}
						loading={submitting}
						type='button'
						className='rounded px-24 btn-primary'
					>
						{t('build_strategy.send_all')}
					</Button>
					<Button
						onClick={storeBuiltStrategy}
						type='button'
						className='btn-primary-hover w-40 rounded border border-gray-500 text-primary-400 transition-colors flex-justify-center'
					>
						<BookmarkSVG />
					</Button>
				</div>
			</div>
		</div>
	);
};

export default StrategyContracts;

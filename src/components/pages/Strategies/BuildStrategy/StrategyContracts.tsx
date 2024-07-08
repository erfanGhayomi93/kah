import { useCommissionsQuery } from '@/api/queries/commonQueries';
import lightStreamInstance from '@/classes/Lightstream';
import type Subscribe from '@/classes/Subscribe';
import Button from '@/components/common/Button';
import Select from '@/components/common/Inputs/Select';
import SymbolStrategyTable, { type TCheckboxes } from '@/components/common/Tables/SymbolStrategyTable';
import { BookmarkSVG, EraserSVG, RefreshSVG } from '@/components/icons';
import { watchlistPriceBasis } from '@/constants';
import { useAppDispatch } from '@/features/hooks';
import { setBuiltStrategy } from '@/features/slices/uiSlice';
import { useBasketOrderingSystem } from '@/hooks';
import { getBasketAlertMessage } from '@/hooks/useBasketOrderingSystem';
import { sepNumbers } from '@/utils/helpers';
import { type ItemUpdate } from 'lightstreamer-client-web';
import { useTranslations } from 'next-intl';
import { useEffect, useMemo, useRef, useState } from 'react';
import { toast } from 'react-toastify';

interface StrategyContractsProps {
	contracts: TSymbolStrategy[];
	selectedContracts: string[];
	setSelectedContracts: (ids: string[]) => void;
	upsert: () => void;
}

interface SumValueProps {
	value: number;
}

interface IUpdatedSymbolPriceInfo {
	bestSellLimitPrice: null | number;
	bestBuyLimitPrice: null | number;
	closingPrice: null | number;
	lastTradedPrice: null | number;
}

const StrategyContracts = ({ contracts, selectedContracts, upsert, setSelectedContracts }: StrategyContractsProps) => {
	const t = useTranslations();

	const dispatch = useAppDispatch();

	const contractsPriceRef = useRef<Record<string, IUpdatedSymbolPriceInfo>>({});

	const subscriptionRef = useRef<Subscribe | null>(null);

	const { submit, submitting } = useBasketOrderingSystem({
		onSent: ({ failedOrders, sentOrders }) => {
			toast.success(t(getBasketAlertMessage(failedOrders.length, sentOrders.length)));
		},
	});

	const [priceBasis, setPriceBasis] = useState<TPriceBasis>('LastTradePrice');

	const { data: commissions } = useCommissionsQuery({
		queryKey: ['commissionQuery'],
	});

	const setContractProperties = (
		id: string,
		values: Partial<Pick<TSymbolStrategy, 'price' | 'quantity' | 'side'>>,
	) => {
		const data = JSON.parse(JSON.stringify(contracts)) as TSymbolStrategy[];

		const orderIndex = data.findIndex((item) => item.id === id);
		if (orderIndex === -1) return;

		data[orderIndex] = {
			...data[orderIndex],
			...values,
		};

		dispatch(setBuiltStrategy(data));
	};

	const deleteContract = (id: string) => {
		const filteredContracts = contracts.filter((item) => item.id !== id);

		dispatch(setBuiltStrategy(filteredContracts));
		setSelectedContracts(filteredContracts.map(({ id }) => id));
	};

	const onChecked = (
		id: string,
		n: 'requiredMargin' | 'tradeCommission' | 'strikeCommission' | 'tax' | 'vDefault',
		v: boolean,
	) => {
		const data = JSON.parse(JSON.stringify(contracts)) as TSymbolStrategy[];

		const orderIndex = data.findIndex((item) => item.id === id);
		if (orderIndex === -1) return;

		data[orderIndex] = {
			...data[orderIndex],
			[n]: v,
		};

		dispatch(setBuiltStrategy(data));
	};

	const onToggleAll = (name: TCheckboxes, value: boolean) => {
		const data = contracts.map((item) => ({
			...item,
			[name]: value,
		}));

		dispatch(setBuiltStrategy(data));
	};

	const onSymbolUpdate = (updateInfo: ItemUpdate) => {
		const symbolISIN: string = updateInfo.getItemName();
		if (!(symbolISIN in contractsPriceRef.current)) {
			contractsPriceRef.current[symbolISIN] = {
				bestSellLimitPrice: null,
				bestBuyLimitPrice: null,
				closingPrice: null,
				lastTradedPrice: null,
			};
		}

		updateInfo.forEachChangedField((fieldName, _b, value) => {
			try {
				if (value !== null) {
					const valueAsNumber = Number(value);
					if (!isNaN(valueAsNumber)) {
						contractsPriceRef.current[symbolISIN][fieldName as keyof IUpdatedSymbolPriceInfo] =
							valueAsNumber;
					}
				}
			} catch (e) {
				//
			}
		});
	};

	const storeBuiltStrategy = () => {
		//
	};

	const sendAllStrategyContracts = () => {
		submit(contracts);
	};

	const addToVirtualPortfolio = () => {
		//
	};

	const updatePrice = () => {
		dispatch(
			setBuiltStrategy(
				contracts.map((item) => {
					const fieldName: keyof IUpdatedSymbolPriceInfo =
						priceBasis === 'ClosingPrice'
							? 'closingPrice'
							: priceBasis === 'LastTradePrice'
								? 'lastTradedPrice'
								: item.side === 'buy'
									? 'bestSellLimitPrice'
									: 'bestBuyLimitPrice';
					return {
						...item,
						price: contractsPriceRef.current[item.symbol.symbolISIN][fieldName] || item.price,
					};
				}),
			),
		);
	};

	const unsubscribe = () => {
		if (!subscriptionRef.current) return;

		subscriptionRef.current.unsubscribe();
		subscriptionRef.current = null;
	};

	const subscribe = () => {
		const fields = ['bestSellLimitPrice_1', 'bestBuyLimitPrice_1', 'closingPrice', 'lastTradedPrice'];
		const symbolISINs = contracts.map((item) => item.symbol.symbolISIN);

		unsubscribe();

		subscriptionRef.current = lightStreamInstance.subscribe({
			mode: 'MERGE',
			items: symbolISINs,
			fields,
			dataAdapter: 'RamandRLCDData',
			snapshot: true,
		});
		subscriptionRef.current.addEventListener('onItemUpdate', onSymbolUpdate);

		subscriptionRef.current.start();
	};

	const symbolISINs = useMemo(() => contracts.map((item) => item.symbol.symbolISIN), [contracts]);

	const { requiredMargin, tradeCommission, strikeCommission, tax, vDefault } = useMemo(() => {
		const result: Record<'requiredMargin' | 'tradeCommission' | 'strikeCommission' | 'tax' | 'vDefault', number> = {
			requiredMargin: 0,
			tradeCommission: 0,
			strikeCommission: 0,
			tax: 0,
			vDefault: 0,
		};

		for (let i = 0; i < contracts.length; i++) {
			const c = contracts[i];
			const commission = Array.isArray(commissions)
				? commissions.find((item) => item.marketUnitTitle === c.marketUnit)
				: undefined;

			if (c.requiredMargin) result.requiredMargin += c.symbol?.requiredMargin ?? 0;
			if (commission && c.tradeCommission)
				result.tradeCommission += Math.round(
					c.price *
						c.quantity *
						(c.side === 'buy' ? commission.buyCommission : -commission.sellCommission) *
						(c.symbol.contractSize ?? 0),
				);
			if (commission && c.strikeCommission) result.strikeCommission += 0;
			if (commission && c.tax) result.tax += 0;
			if (commission && c.vDefault) result.vDefault += 0;
		}

		return result;
	}, [contracts]);

	useEffect(() => {
		subscribe();
		return () => {
			unsubscribe();
		};
	}, [symbolISINs.join(',')]);

	return (
		<div
			style={{ flex: '0.77', minHeight: '48.8rem' }}
			className='relative overflow-hidden rounded-md border border-light-gray-200'
		>
			<div className='h-full justify-between pb-16 flex-column'>
				<div className='flex-1 gap-16 overflow-hidden pt-16 flex-column'>
					<div className='w-full px-16 flex-justify-between'>
						<h1 className='text-base font-medium'>{t('build_strategy.new_strategy')}</h1>

						<div className='flex-1 gap-16 flex-justify-end'>
							<div style={{ flex: '0 0 15.2rem' }}>
								<Select<TPriceBasis>
									defaultValue={priceBasis}
									options={watchlistPriceBasis}
									placeholder={t('strategy.price_basis')}
									onChange={(v) => setPriceBasis(v)}
									getOptionId={(id) => id}
									getOptionTitle={(id) => t(`strategy.price_${id}`)}
									classes={{
										root: '!h-40',
									}}
								/>
							</div>

							<button
								onClick={updatePrice}
								type='button'
								className='h-24 gap-4 text-base text-light-info-100 flex-items-center'
							>
								{t('build_strategy.update_price')}
								<RefreshSVG width='2rem' height='2rem' />
							</button>

							<button
								onClick={() => dispatch(setBuiltStrategy([]))}
								type='button'
								className='size-24 text-light-gray-700 flex-justify-center'
							>
								<EraserSVG width='2rem' height='2rem' />
							</button>
						</div>
					</div>

					<div className='flex-1 overflow-auto px-8'>
						<SymbolStrategyTable
							selectedContracts={selectedContracts}
							contracts={contracts}
							showDetails={false}
							onDelete={deleteContract}
							onChecked={onChecked}
							onChange={(id, v) => setContractProperties(id, v)}
							onSelectionChanged={setSelectedContracts}
							onToggleAll={onToggleAll}
							features={{
								tradeCommission: true,
								strikeCommission: true,
								contractSize: true,
								requiredMargin: true,
								vDefault: true,
								tax: true,
							}}
						/>
					</div>
				</div>

				<div className='justify-between gap-16 bg-white px-16 pt-12 flex-column'>
					<div className='relative h-24 border-t border-t-light-gray-200'>
						<ul
							style={{ top: '-1.2rem' }}
							className='absolute left-0 px-16 flex-items-center *:gap-4 *:truncate *:bg-white *:flex-items-center'
						>
							<li className='justify-end pl-24 pr-16 font-medium text-light-gray-700'>
								{t('build_strategy.aggregate')}:
							</li>
							<SumValue value={requiredMargin} />
							<SumValue value={tradeCommission} />
							<SumValue value={strikeCommission} />
							<SumValue value={tax} />
							<SumValue value={vDefault} />
						</ul>
					</div>

					<div className='gap-8 flex-justify-end *:h-40'>
						<Button onClick={upsert} type='button' className='rounded px-48 btn-primary-outline'>
							{t('build_strategy.upsert')}
						</Button>
						<Button
							onClick={addToVirtualPortfolio}
							type='button'
							className='rounded px-40 btn-primary-outline'
						>
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
							className='w-40 rounded border border-light-gray-200 text-light-primary-100 transition-colors flex-justify-center btn-primary-hover'
						>
							<BookmarkSVG />
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
};

const SumValue = ({ value }: SumValueProps) => {
	const t = useTranslations('common');
	return (
		<li className='w-104 text-light-gray-500'>
			<span className='text-light-gray-800 ltr'>{sepNumbers(String(value))}</span>
			<span className='truncate'>{t('rial')}</span>
		</li>
	);
};

export default StrategyContracts;

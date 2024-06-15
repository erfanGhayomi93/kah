import { useCommissionsQuery } from '@/api/queries/commonQueries';
import ErrorBoundary from '@/components/common/ErrorBoundary';
import Switch from '@/components/common/Inputs/Switch';
import Loading from '@/components/common/Loading';
import NoData from '@/components/common/NoData';
import SymbolStrategyTable from '@/components/common/Tables/SymbolStrategyTable';
import Tabs from '@/components/common/Tabs/Tabs';
import { PlusSVG } from '@/components/icons';
import { useAppDispatch } from '@/features/hooks';
import { setAnalyzeModal, setSelectSymbolContractsModal } from '@/features/slices/modalSlice';
import { type IAnalyzeModal } from '@/features/slices/types/modalSlice.interfaces';
import { useBasketOrderingSystem, useInputs, useLocalstorage } from '@/hooks';
import { getBasketAlertMessage } from '@/hooks/useBasketOrderingSystem';
import { convertSymbolWatchlistToSymbolBasket, sepNumbers, uuidv4 } from '@/utils/helpers';
import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import dynamic from 'next/dynamic';
import React, { forwardRef, useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import styled from 'styled-components';
import Modal, { Header } from '../Modal';

const PerformanceChart = dynamic(() => import('./PerformanceChart'), {
	loading: () => <Loading />,
});

const GreeksTable = dynamic(() => import('./GreeksTable'), {
	loading: () => <Loading />,
});

const Div = styled.div`
	width: 800px;
	min-height: 60rem;
	max-height: 90dvh;
	display: flex;
	flex-direction: column;
`;

interface StrategyInfoItemProps {
	type?: 'success' | 'error';
	title: string;
	value: React.ReactNode;
}

interface NoContractExistsProps {
	addNewStrategy: () => void;
}

interface AnalyzeProps extends IAnalyzeModal {}

const Analyze = forwardRef<HTMLDivElement, AnalyzeProps>(
	({ symbol, contracts, onContractsChanged, onContractRemoved, ...props }, ref) => {
		const t = useTranslations();

		const dispatch = useAppDispatch();

		const { submit, submitting } = useBasketOrderingSystem({
			onSent: ({ failedOrders, sentOrders }) => {
				toast.success(t(getBasketAlertMessage(failedOrders.length, sentOrders.length)));
			},
		});

		const [useCommission, setUseCommission] = useLocalstorage('use_commission', true);

		const { inputs, setFieldsValue } = useInputs<IAnalyzeModalInputs>({
			chartData: [],
			minPrice: 0,
			maxPrice: 0,
			mostProfit: 0,
			mostLoss: 0,
			baseAssets: 0,
			bep: { x: 0, y: 0 },
			budget: 0,
			profitProbability: 0,
			timeValue: 0,
			risk: 0,
			requiredMargin: 0,
		});

		const [symbolContracts, setSymbolContracts] = useState([...contracts]);

		const [selectedContracts, setSelectedContracts] = useState<string[]>(symbolContracts.map((item) => item.id));

		const { data: commissionData } = useCommissionsQuery({
			queryKey: ['commissionQuery'],
		});

		const onCloseModal = () => {
			dispatch(setAnalyzeModal(null));
		};

		const handleContracts = (contracts: Option.Root[], baseSymbol: Symbol.Info | null) => {
			const l = contracts.length;

			const result: TSymbolStrategy[] = [];
			const selectedResult: string[] = [];

			try {
				for (let i = 0; i < l; i++) {
					const item = convertSymbolWatchlistToSymbolBasket(contracts[i], 'buy');

					result.push(item);
					selectedResult.push(item.id);
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
					selectedResult.push(symbol.symbolISIN);
				}

				setSymbolContracts(result);
				setSelectedContracts(selectedResult);
				onContractsChanged?.(contracts, baseSymbol?.symbolISIN ?? null);
			} catch (e) {
				//
			}
		};

		const addNewContracts = () => {
			const initialSelectedContracts = symbolContracts
				.filter((item) => item !== null)
				.map(({ symbol }) => symbol.symbolISIN);

			dispatch(
				setSelectSymbolContractsModal({
					initialBaseSymbolISIN: symbol.symbolISIN,
					initialSelectedContracts,
					suppressBaseSymbolChange: true,
					suppressSendBaseSymbol: false,
					initialSelectedBaseSymbol: symbolContracts.findIndex((c) => c.type === 'base') > -1,
					callback: handleContracts,
				}),
			);
		};

		const setOrderProperties = (
			id: string,
			values: Partial<Pick<TSymbolStrategy, 'price' | 'quantity' | 'side'>>,
		) => {
			setSymbolContracts((prev) => {
				const orders = JSON.parse(JSON.stringify(prev)) as TSymbolStrategy[];

				const orderIndex = orders.findIndex((item) => item.id === id);

				if (orderIndex === -1) return prev;
				orders[orderIndex] = {
					...orders[orderIndex],
					...values,
				};
				return orders;
			});
		};

		const removeOrder = (id: string) => {
			const removedOrderIndex = symbolContracts.findIndex((order) => order.id === id);
			setSelectedContracts((orders) => orders.filter((orderId) => orderId !== id));

			if (removedOrderIndex > -1) {
				const orders = JSON.parse(JSON.stringify(symbolContracts)) as typeof symbolContracts;
				orders.splice(removedOrderIndex, 1);

				setSymbolContracts(orders);
				onContractRemoved?.(id);
			}
		};

		const getSelectedContracts = () => {
			const result: OrderBasket.Order[] = [];

			for (let i = 0; i < selectedContracts.length; i++) {
				const orderId = selectedContracts[i];
				const order = contracts.find((order) => order.id === orderId);
				if (order) result.push(order);
			}

			return result;
		};

		const onSubmit = () => {
			submit(getSelectedContracts());
		};

		const selectedContractsAsSymbol = useMemo<OrderBasket.Order[]>(() => {
			const result: OrderBasket.Order[] = [];

			for (let i = 0; i < selectedContracts.length; i++) {
				const orderId = selectedContracts[i];
				const order = symbolContracts.find((order) => order.id === orderId);
				if (!order) break;

				result.push(order);
			}

			return result;
		}, [symbolContracts, selectedContracts]);

		const intrinsicValue = (strikePrice: number, baseSymbolPrice: number, type: TOptionSides) => {
			if (type === 'call') return Math.max(baseSymbolPrice - strikePrice, 0);
			return Math.max(strikePrice - baseSymbolPrice, 0);
		};

		const pnl = (intrinsicValue: number, premium: number, type: TBsSides) => {
			if (type === 'buy') return intrinsicValue - premium;
			return premium - intrinsicValue;
		};

		const TABS = useMemo(() => {
			return [
				{
					id: 'normal',
					title: t('analyze_modal.performance'),
					render: () => (
						<div style={{ height: '40rem' }} className='relative py-16'>
							<ErrorBoundary>
								<PerformanceChart inputs={inputs} onChange={setFieldsValue} />
							</ErrorBoundary>
						</div>
					),
				},
				{
					id: 'strategy',
					title: t('analyze_modal.greeks'),
					render: () => (
						<div style={{ height: '40rem' }} className='relative py-16'>
							<ErrorBoundary>
								<GreeksTable contracts={symbolContracts} />
							</ErrorBoundary>
						</div>
					),
				},
			];
		}, [symbolContracts, inputs]);

		useEffect(() => {
			const data = selectedContractsAsSymbol;
			const newStates: IAnalyzeModalInputs = {
				...inputs,
				chartData: [],
			};

			newStates.chartData = [];

			if (data.length === 0) return;

			try {
				const l = data.length;
				const { baseSymbolPrice } = data[0].symbol;
				const minMaxIsInvalid = newStates.minPrice >= newStates.maxPrice;
				newStates.baseAssets = baseSymbolPrice;

				if (!newStates.minPrice || minMaxIsInvalid)
					newStates.minPrice = Math.max(newStates.baseAssets * 0.5, 0);

				if (!newStates.maxPrice || minMaxIsInvalid)
					newStates.maxPrice = Math.max(newStates.baseAssets * 1.5, 0);

				newStates.minPrice = Math.floor(newStates.minPrice);
				newStates.maxPrice = Math.ceil(newStates.maxPrice);

				const lowPrice = newStates.minPrice;
				const highPrice = newStates.maxPrice;

				for (let i = 0; i < l; i++) {
					const item = data[i];
					const contractType = item.symbol.optionType;
					const { strikePrice, price } = item;

					let commission = 0;
					let index = 0;

					if (Array.isArray(commissionData) && useCommission) {
						const transactionCommission = commissionData.find(
							({ marketUnitTitle }) => marketUnitTitle === item.marketUnit,
						);

						if (transactionCommission) {
							commission =
								transactionCommission[item.side === 'buy' ? 'buyCommission' : 'sellCommission'] ?? 0;

							commission *= item.quantity * item.price;
							if (item.side === 'sell') commission *= -1;
						}
					}

					const transactionValue = Math.ceil(Math.abs(item.quantity * price + commission));

					for (let j = lowPrice; j <= highPrice; j++) {
						let y = 0;

						if (item.type === 'base') {
							y = j - baseSymbolPrice;
						} else {
							const strikeCommission =
								useCommission && item.side === 'buy'
									? (strikePrice ?? 0) * 0.0005 * (item.symbol.optionType === 'call' ? 1 : -1)
									: 0;

							const iv = intrinsicValue((strikePrice ?? 0) + strikeCommission, j, contractType ?? 'call');
							y = pnl(iv, transactionValue, item.side);
						}

						y += newStates.chartData[index]?.y ?? 0;
						if (y === 0) newStates.bep = { x: j, y: 0 };

						newStates.chartData[index] = {
							x: j,
							y,
						};

						index++;
					}
				}
			} catch (e) {
				//
			}

			setFieldsValue(newStates);
		}, [
			JSON.stringify({
				selectedContractsAsSymbol,
				useCommission,
				commissionData,
				minPrice: inputs.minPrice,
				maxPrice: inputs.maxPrice,
			}),
		]);

		return (
			<Modal
				top='50%'
				style={{ modal: { transform: 'translate(-50%, -50%)' } }}
				ref={ref}
				onClose={onCloseModal}
				{...props}
			>
				<Div className='bg-white flex-column'>
					<Header label={t('analyze_modal.title')} onClose={onCloseModal} />

					{symbolContracts.length > 0 ? (
						<div className='relative flex-1 gap-16 overflow-hidden flex-column'>
							<div className='relative px-16 pt-16 flex-column'>
								<SymbolStrategyTable
									maxHeight='26.4rem'
									selectedContracts={selectedContracts}
									contracts={symbolContracts}
									onSelectionChanged={setSelectedContracts}
									onChange={(id, values) => setOrderProperties(id, values)}
									onDelete={removeOrder}
								/>

								<div className='flex pl-8 pr-28 flex-justify-between'>
									<button
										disabled={submitting}
										type='button'
										onClick={addNewContracts}
										className='size-40 rounded btn-primary'
									>
										<PlusSVG width='2rem' height='2rem' />
									</button>

									<button
										disabled={submitting}
										style={{ flex: '0 0 14.4rem' }}
										type='button'
										onClick={onSubmit}
										className='h-40 rounded btn-primary'
									>
										{t('analyze_modal.send_all')}
									</button>
								</div>
							</div>

							<div className='h-full overflow-auto px-16 pb-16 pt-12'>
								<div className='overflow- relative h-full rounded px-16 shadow-card flex-column'>
									<Tabs
										data={TABS}
										defaultActiveTab='normal'
										renderTab={(item, activeTab) => (
											<button
												className={clsx(
													'h-48 px-16 transition-colors flex-justify-center',
													item.id === activeTab
														? 'font-medium text-light-gray-700'
														: 'text-light-gray-500',
												)}
												type='button'
											>
												{item.title}
											</button>
										)}
									/>

									<div className='gap-16 border-t border-t-light-gray-200 pb-24 pt-16 flex-column'>
										<ul className='flex-justify-between'>
											<StrategyInfoItem
												type='success'
												title={t('analyze_modal.most_profit')}
												value='+2,075'
											/>
											<StrategyInfoItem
												title={t('analyze_modal.break_even_point')}
												value={`${sepNumbers(String(inputs.bep.x))} (0.1%)`}
											/>
											<StrategyInfoItem title={t('analyze_modal.risk')} value='22,509 (0.1%)' />
											<StrategyInfoItem
												title={t('analyze_modal.time_value')}
												value='22,509 (0.1%)'
											/>
										</ul>

										<ul className='flex-justify-between'>
											<StrategyInfoItem
												type='error'
												title={t('analyze_modal.most_loss')}
												value='-2,925'
											/>
											<StrategyInfoItem
												title={t('analyze_modal.required_budget')}
												value='132,000'
											/>
											<StrategyInfoItem
												title={t('analyze_modal.profit_probability')}
												value='132,000'
											/>
											<StrategyInfoItem
												title={t('analyze_modal.required_margin')}
												value='132,000'
											/>
										</ul>
									</div>

									<div className='absolute left-16 top-8 flex-justify-center'>
										<div className='h-40 gap-8 flex-items-center'>
											<span className='text-tiny font-medium text-light-gray-700'>
												{t('analyze_modal.with_commission')}
											</span>
											<Switch checked={useCommission} onChange={(v) => setUseCommission(v)} />
										</div>
									</div>
								</div>
							</div>
						</div>
					) : (
						<div className='relative flex-1 flex-justify-center'>
							<NoContractExists addNewStrategy={addNewContracts} />
						</div>
					)}
				</Div>
			</Modal>
		);
	},
);

const NoContractExists = ({ addNewStrategy }: NoContractExistsProps) => {
	const t = useTranslations();

	return (
		<div style={{ width: '30rem' }} className='gap-24 flex-column'>
			<NoData text={t('analyze_modal.no_data')} />

			<button type='button' className='h-40 rounded text-base btn-primary' onClick={addNewStrategy}>
				{t('analyze_modal.make_your_own_strategy')}
			</button>
		</div>
	);
};

const StrategyInfoItem = ({ title, value, type }: StrategyInfoItemProps) => {
	return (
		<li style={{ flex: '0 0 13.6rem' }} className='items-start gap-4 flex-column'>
			<span className='text-base text-light-gray-700'>{title}</span>
			<div
				style={{ width: '10.4rem' }}
				className={clsx('h-40 rounded px-8 ltr flex-justify-end', {
					'bg-light-gray-100 text-light-gray-700': !type,
					'bg-light-success-100/10 text-light-success-100': type === 'success',
					'bg-light-error-100/10 text-light-error-100': type === 'error',
				})}
			>
				{value}
			</div>
		</li>
	);
};

export default Analyze;

import Switch from '@/components/common/Inputs/Switch';
import Loading from '@/components/common/Loading';
import NoData from '@/components/common/NoData';
import SymbolStrategyTable from '@/components/common/Tables/SymbolStrategyTable';
import Tabs from '@/components/common/Tabs/Tabs';
import { PlusSVG } from '@/components/icons';
import { useAppDispatch } from '@/features/hooks';
import { setAnalyzeModal, setSelectSymbolContractsModal } from '@/features/slices/modalSlice';
import { type IAnalyzeModal } from '@/features/slices/modalSlice.interfaces';
import { useInputs } from '@/hooks';
import { convertSymbolWatchlistToSymbolBasket, sepNumbers } from '@/utils/helpers';
import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import dynamic from 'next/dynamic';
import React, { forwardRef, useEffect, useMemo, useState } from 'react';
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

		const [symbolContracts, setSymbolContracts] = useState([...contracts]);

		const [selectedContracts, setSelectedContracts] = useState<string[]>(symbolContracts.map((item) => item.id));

		const { inputs, setFieldValue, setFieldsValue } = useInputs<IAnalyzeModalInputs>({
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
			withCommission: false,
		});

		const onCloseModal = () => {
			dispatch(setAnalyzeModal(null));
		};

		const addContracts = (contracts: Option.Root[], baseSymbolISIN: null | string) => {
			try {
				const l = contracts.length;

				const result: ISymbolStrategyContract[] = [];
				const selectedResult: string[] = [];

				for (let i = 0; i < l; i++) {
					const item = convertSymbolWatchlistToSymbolBasket(contracts[i], 'buy');

					result.push(item);
					selectedResult.push(item.id);
				}

				setSymbolContracts(result);
				setSelectedContracts(selectedResult);
				onContractsChanged?.(contracts, baseSymbolISIN);
			} catch (e) {
				//
			}
		};

		const addNewContracts = () => {
			dispatch(
				setSelectSymbolContractsModal({
					symbol,
					maxContracts: null,
					initialSelectedContracts: symbolContracts
						.filter((item) => item !== null)
						.map((item) => item.symbol.symbolInfo.symbolISIN) as string[],
					canChangeBaseSymbol: true,
					callback: addContracts,
				}),
			);
		};

		const setOrderProperties = (id: string, values: Partial<ISymbolStrategyContract>) => {
			setSymbolContracts((prev) => {
				const orders = JSON.parse(JSON.stringify(prev)) as ISymbolStrategyContract[];

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

		const sendAll = () => {
			//
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

		const TABS = useMemo(
			() => [
				{
					id: 'normal',
					title: t('analyze_modal.performance'),
					render: () => (
						<div style={{ height: '40rem' }} className='relative py-16'>
							<PerformanceChart
								minPrice={inputs.minPrice}
								maxPrice={inputs.maxPrice}
								chartData={inputs.chartData}
								baseAssets={inputs.baseAssets}
								bep={inputs.bep}
								onChange={setFieldsValue}
							/>
						</div>
					),
				},
				{
					id: 'strategy',
					title: t('analyze_modal.greeks'),
					render: () => (
						<div style={{ height: '40rem' }} className='relative py-16'>
							<GreeksTable contracts={symbolContracts} />
						</div>
					),
				},
			],
			[symbolContracts, inputs],
		);

		useEffect(() => {
			const data = selectedContractsAsSymbol;
			const newStates = JSON.parse(JSON.stringify(inputs)) as IAnalyzeModalInputs;

			newStates.chartData = [];

			if (data.length === 0) return;

			try {
				const l = data.length;
				const { baseSymbolPrice } = data[0].symbol.optionWatchlistData;
				const minMaxIsInvalid = newStates.minPrice >= newStates.maxPrice;
				newStates.baseAssets = baseSymbolPrice;

				if (!newStates.minPrice || minMaxIsInvalid)
					newStates.minPrice = Math.max(newStates.baseAssets * 0.75, 0);

				if (!newStates.maxPrice || minMaxIsInvalid)
					newStates.maxPrice = Math.max(newStates.baseAssets * 1.25, 0);

				const lowPrice = newStates.minPrice;
				const highPrice = newStates.maxPrice;
				const diff = Math.round((highPrice - lowPrice) / 20);

				const fakeData: IAnalyzeModalInputs['chartData'] = [];

				for (let i = 0; i < l; i++) {
					const item = data[i];
					const contractType = item.symbol.symbolInfo.optionType === 'Call' ? 'call' : 'put';
					const {
						symbol: {
							symbolInfo: { strikePrice },
						},
						price,
					} = item;

					let index = 0;
					for (let j = lowPrice; j <= highPrice; j++) {
						const iv = intrinsicValue(strikePrice, j, contractType);
						const previousY = fakeData[index]?.y ?? 0;
						const y = previousY + pnl(iv, price, item.side);

						if (y === 0) newStates.bep = { x: j, y: 0 };
						else {
							fakeData[index] = {
								x: j,
								y,
							};
						}

						index++;
					}
				}

				const fl = fakeData.length;
				let hasBep = false;
				for (let i = 0; i < fl; i++) {
					const item = fakeData[i];

					if (item && (i % diff === 0 || i === fl - 1 || (!hasBep && item.y === 0))) {
						newStates.chartData.push(item);
						if (item.y === 0) hasBep = true;
					}
				}
			} catch (e) {
				//
			}

			setFieldsValue(newStates);
		}, [JSON.stringify(selectedContractsAsSymbol), inputs.minPrice, inputs.maxPrice]);

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
							<div className='gap-8 flex-column'>
								<div style={{ maxHeight: '26.4rem' }} className='flex-1 overflow-auto px-16'>
									<SymbolStrategyTable
										selectedContracts={selectedContracts}
										contracts={symbolContracts}
										onSelectionChanged={setSelectedContracts}
										onChange={(id, values) => setOrderProperties(id, values)}
										onSideChange={(id, value) => setOrderProperties(id, { side: value })}
										onDelete={removeOrder}
									/>
								</div>

								<div className='flex pl-28 pr-56 flex-justify-between'>
									<button
										type='button'
										onClick={addNewContracts}
										className='size-40 rounded btn-primary'
									>
										<PlusSVG width='2rem' height='2rem' />
									</button>

									<button
										style={{ flex: '0 0 14.4rem' }}
										type='button'
										onClick={sendAll}
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
														? 'font-medium text-gray-900'
														: 'text-gray-700',
												)}
												type='button'
											>
												{item.title}
											</button>
										)}
									/>

									<div className='gap-16 border-t border-t-gray-500 pb-24 pt-16 flex-column'>
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
											<span className='text-tiny font-medium text-gray-900'>
												{t('analyze_modal.with_commission')}
											</span>
											<Switch
												checked={inputs.withCommission}
												onChange={(v) => setFieldValue('withCommission', v)}
											/>
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
			<NoData text={t('analyze_modal.no_trade_found')} />

			<button type='button' className='h-40 rounded text-base btn-primary' onClick={addNewStrategy}>
				{t('analyze_modal.make_your_own_strategy')}
			</button>
		</div>
	);
};

const StrategyInfoItem = ({ title, value, type }: StrategyInfoItemProps) => {
	return (
		<li style={{ flex: '0 0 13.6rem' }} className='items-start gap-4 flex-column'>
			<span className='text-base text-gray-900'>{title}</span>
			<div
				style={{ width: '10.4rem' }}
				className={clsx('h-40 rounded px-8 ltr flex-justify-end', {
					'bg-gray-200 text-gray-900': !type,
					'bg-success-100/10 text-success-100': type === 'success',
					'bg-error-100/10 text-error-100': type === 'error',
				})}
			>
				{value}
			</div>
		</li>
	);
};

export default Analyze;

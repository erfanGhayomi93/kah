import AnalyzeGraph from '@/components/common/Analyze';
import Switch from '@/components/common/Inputs/Switch';
import NoData from '@/components/common/NoData';
import SymbolStrategyTable from '@/components/common/Tables/SymbolStrategyTable';
import { PlusSVG } from '@/components/icons';
import { useAppDispatch } from '@/features/hooks';
import { setAnalyzeModal, setSelectSymbolContractsModal } from '@/features/slices/modalSlice';
import { type IAnalyzeModal } from '@/features/slices/types/modalSlice.interfaces';
import { useBasketOrderingSystem, useLocalstorage } from '@/hooks';
import { getBasketAlertMessage } from '@/hooks/useBasketOrderingSystem';
import { convertSymbolWatchlistToSymbolBasket, uuidv4 } from '@/utils/helpers';
import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import React, { forwardRef, useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import styled from 'styled-components';
import Modal, { Header } from '../Modal';

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

		const [symbolContracts, setSymbolContracts] = useState([...contracts]);

		const [selectedContracts, setSelectedContracts] = useState<string[]>(symbolContracts.map((item) => item.id));

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
									<AnalyzeGraph
										baseAssets={
											selectedContractsAsSymbol.length > 0
												? selectedContractsAsSymbol[0]?.symbol.baseSymbolPrice
												: 0
										}
										contracts={selectedContractsAsSymbol}
										useCommission={useCommission}
										height={400}
									/>

									<div className='gap-16 border-t border-t-light-gray-200 pb-24 pt-16 flex-column'>
										<ul className='flex-justify-between'>
											<StrategyInfoItem
												type='success'
												title={t('analyze_modal.most_profit')}
												value='+2,075'
											/>
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
		<li style={{ flex: '0 0 12.8rem' }} className='items-start gap-4 flex-column'>
			<span className='text-base text-light-gray-700'>{title}</span>
			<div
				style={{ width: '10.4rem' }}
				className={clsx('h-40 w-full rounded px-8 ltr flex-justify-end', {
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

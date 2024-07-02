import NoData from '@/components/common/NoData';
import SymbolStrategyTable from '@/components/common/Tables/SymbolStrategyTable';
import { PlusSVG } from '@/components/icons';
import { useAppDispatch } from '@/features/hooks';
import { setAnalyzeModal, setSelectSymbolContractsModal } from '@/features/slices/modalSlice';
import { type IAnalyzeModal } from '@/features/slices/types/modalSlice.interfaces';
import { useBasketOrderingSystem } from '@/hooks';
import { getBasketAlertMessage } from '@/hooks/useBasketOrderingSystem';
import { convertSymbolWatchlistToSymbolBasket, uuidv4 } from '@/utils/helpers';
import { useTranslations } from 'next-intl';
import { forwardRef, useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import styled from 'styled-components';
import Modal, { Header } from '../Modal';
import AnalyzeTabs from './AnalyzeTabs';

const Div = styled.div`
	width: 800px;
	min-height: 60rem;
	max-height: 90dvh;
	display: flex;
	flex-direction: column;
`;

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
							contractSize: baseSymbol.contractSize,
						},
					});
					selectedResult.push(baseSymbolId);
				}

				for (let i = 0; i < l; i++) {
					const item = convertSymbolWatchlistToSymbolBasket(contracts[i], 'buy');

					result.push(item);
					selectedResult.push(item.id);
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

		const onSubmit = () => {
			submit(selectedContractsAsSymbol);
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
								<AnalyzeTabs
									contracts={selectedContractsAsSymbol}
									baseSymbolPrice={
										selectedContractsAsSymbol.length > 0
											? selectedContractsAsSymbol[0]?.symbol.baseSymbolPrice
											: 0
									}
								/>
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

export default Analyze;

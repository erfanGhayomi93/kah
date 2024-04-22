import Switch from '@/components/common/Inputs/Switch';
import Loading from '@/components/common/Loading';
import NoData from '@/components/common/NoData';
import SymbolStrategyTable from '@/components/common/Tables/SymbolStrategyTable';
import Tabs from '@/components/common/Tabs/Tabs';
import { useAppDispatch } from '@/features/hooks';
import { setAnalyzeModal, setSelectSymbolContractsModal } from '@/features/slices/modalSlice';
import { type IAnalyzeModal } from '@/features/slices/modalSlice.interfaces';
import { convertSymbolWatchlistToSymbolBasket } from '@/utils/helpers';
import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import dynamic from 'next/dynamic';
import React, { forwardRef, useMemo, useState } from 'react';
import styled from 'styled-components';
import Modal, { Header } from '../Modal';

const PerformanceChart = dynamic(() => import('./PerformanceChart'), {
	ssr: false,
	loading: () => <Loading />,
});

const GreeksTable = dynamic(() => import('./GreeksTable'), {
	ssr: false,
	loading: () => <Loading />,
});

const Div = styled.div`
	width: 800px;
	min-height: 768px;
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

const Analyze = forwardRef<HTMLDivElement, AnalyzeProps>(({ symbol, contracts, ...props }, ref) => {
	const t = useTranslations();

	const dispatch = useAppDispatch();

	const [withCommission, setWithCommission] = useState(true);

	const [symbolContracts, setSymbolContracts] = useState([...contracts]);

	const [selectedContracts, setSelectedContracts] = useState<ISymbolStrategyContract[]>([]);

	const onCloseModal = () => {
		dispatch(setAnalyzeModal(null));
	};

	const onContractsAdded = (contracts: Option.Root[], baseSymbolISIN: null | string) => {
		try {
			const l = contracts.length;
			const result: ISymbolStrategyContract[] = [];

			for (let i = 0; i < l; i++) {
				const item2 = contracts[i];
				const index = symbolContracts.findIndex(
					(item) => item.symbol.symbolISIN === item2.symbolInfo.symbolISIN,
				);

				if (index === -1) result.push(convertSymbolWatchlistToSymbolBasket(item2, 'buy'));
			}

			setSymbolContracts(result);
		} catch (e) {
			//
		}
	};

	const addNewStrategy = () => {
		dispatch(
			setSelectSymbolContractsModal({
				symbol,
				maxContracts: null,
				initialSelectedContracts: contracts
					.filter((item) => item !== null)
					.map((item) => item.symbol.symbolISIN) as string[],
				canChangeBaseSymbol: true,
				callback: onContractsAdded,
			}),
		);
	};

	const setOrderProperty = <T extends keyof ISymbolStrategyContract>(
		id: string,
		property: T,
		value: ISymbolStrategyContract[T],
	) => {
		setSymbolContracts((prev) => {
			const orders = JSON.parse(JSON.stringify(prev)) as ISymbolStrategyContract[];

			const orderIndex = orders.findIndex((item) => item.id === id);

			if (orderIndex === -1) return prev;
			orders[orderIndex][property] = value;
			return orders;
		});
	};

	const removeOrder = (id: string) => {
		setSymbolContracts((orders) => orders.filter((item) => item.id !== id));
		setSelectedContracts((orders) => orders.filter((item) => item.id !== id));
	};

	const sendAll = () => {
		//
	};

	const TABS = useMemo(
		() => [
			{
				id: 'normal',
				title: t('analyze_modal.performance'),
				render: () => (
					<div className='relative flex-1 py-16'>
						<PerformanceChart />
					</div>
				),
			},
			{
				id: 'strategy',
				title: t('analyze_modal.greeks'),
				render: () => (
					<div className='relative flex-1 py-16'>
						<GreeksTable />
					</div>
				),
			},
		],
		[],
	);

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
					<div className='relative flex-1 gap-24 overflow-hidden pb-16 flex-column'>
						<div className='gap-16 flex-column'>
							<div style={{ maxHeight: '26.4rem' }} className='flex-1 overflow-auto px-16'>
								<SymbolStrategyTable
									selectedContracts={selectedContracts}
									contracts={symbolContracts}
									onSelectionChanged={setSelectedContracts}
									onChangePrice={(id, value) => setOrderProperty(id, 'price', value)}
									onChangeQuantity={(id, value) => setOrderProperty(id, 'quantity', value)}
									onSideChange={(id, value) => setOrderProperty(id, 'side', value)}
									onDelete={removeOrder}
								/>
							</div>

							<div className='flex px-16 flex-justify-end'>
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

						<div className='flex-1 px-16 flex-column'>
							<div className='relative flex-1 rounded px-16 shadow-card flex-column'>
								<Tabs
									data={TABS}
									defaultActiveTab='normal'
									renderTab={(item, activeTab) => (
										<button
											className={clsx(
												'h-48 px-16 transition-colors flex-justify-center',
												item.id === activeTab ? 'font-medium text-gray-900' : 'text-gray-700',
											)}
											type='button'
										>
											{item.title}
										</button>
									)}
								/>

								<div className='absolute left-16 top-8 flex-justify-center'>
									<div className='h-40 gap-8 flex-items-center'>
										<span className='text-tiny font-medium text-gray-900'>
											{t('analyze_modal.with_commission')}
										</span>
										<Switch checked={withCommission} onChange={setWithCommission} />
									</div>
								</div>

								<div className='gap-16 border-t border-t-gray-500 pb-24 pt-16 flex-column'>
									<ul className='flex-justify-between'>
										<StrategyInfoItem
											type='success'
											title={t('analyze_modal.most_profit')}
											value='+2,075'
										/>
										<StrategyInfoItem
											title={t('analyze_modal.break_even_point')}
											value='22,509 (0.1%)'
										/>
										<StrategyInfoItem title={t('analyze_modal.risk')} value='22,509 (0.1%)' />
										<StrategyInfoItem title={t('analyze_modal.time_value')} value='22,509 (0.1%)' />
									</ul>

									<ul className='flex-justify-between'>
										<StrategyInfoItem
											type='error'
											title={t('analyze_modal.most_loss')}
											value='-2,925'
										/>
										<StrategyInfoItem title={t('analyze_modal.required_budget')} value='132,000' />
										<StrategyInfoItem
											title={t('analyze_modal.profit_probability')}
											value='132,000'
										/>
										<StrategyInfoItem title={t('analyze_modal.required_margin')} value='132,000' />
									</ul>
								</div>
							</div>
						</div>
					</div>
				) : (
					<div className='relative flex-1 flex-justify-center'>
						<NoContractExists addNewStrategy={addNewStrategy} />
					</div>
				)}
			</Div>
		</Modal>
	);
});

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

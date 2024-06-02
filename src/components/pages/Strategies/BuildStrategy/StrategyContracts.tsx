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
import { useTranslations } from 'next-intl';
import { useMemo, useState } from 'react';
import { toast } from 'react-toastify';

interface StrategyContractsProps {
	contracts: TSymbolStrategy[];
	selectedContracts: string[];
	setSelectedContracts: (ids: string[]) => void;
	upsert: () => void;
}

const StrategyContracts = ({ contracts, selectedContracts, upsert, setSelectedContracts }: StrategyContractsProps) => {
	const t = useTranslations();

	const dispatch = useAppDispatch();

	const { submit, submitting } = useBasketOrderingSystem({
		onSent: ({ failedOrders, sentOrders }) => {
			toast.success(t(getBasketAlertMessage(failedOrders.length, sentOrders.length)));
		},
	});

	const [priceBasis, setPriceBasis] = useState<TPriceBasis>('LastTradePrice');

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
			[n]: {
				value: data[orderIndex][n]?.value ?? 0,
				checked: v,
			},
		};

		dispatch(setBuiltStrategy(data));
	};

	const onToggleAll = (name: TCheckboxes, value: boolean) => {
		const data = contracts.map((item) => ({
			...item,
			[name]: {
				...item[name],
				checked: value,
			},
		}));

		dispatch(setBuiltStrategy(data));
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
		//
	};

	const { requiredMargin, tradeCommission, strikeCommission, tax, vDefault } = useMemo(() => {
		const result: Record<'requiredMargin' | 'tradeCommission' | 'strikeCommission' | 'tax' | 'vDefault', number> = {
			requiredMargin: 0,
			tradeCommission: 0,
			strikeCommission: 0,
			tax: 0,
			vDefault: 0,
		};

		for (let i = 0; i < contracts.length; i++) {
			const contract = contracts[i];

			if (contract.requiredMargin?.checked) result.requiredMargin += contract.requiredMargin?.value ?? 0;
			if (contract.tradeCommission?.checked) result.tradeCommission += contract.tradeCommission?.value ?? 0;
			if (contract.strikeCommission?.checked) result.strikeCommission += contract.strikeCommission?.value ?? 0;
			if (contract.tax?.checked) result.tax += contract.tax?.value ?? 0;
			if (contract.vDefault?.checked) result.vDefault += contract.vDefault?.value ?? 0;
		}

		return result;
	}, [contracts]);

	return (
		<div
			style={{ flex: '0.77', minHeight: '48.8rem' }}
			className='relative overflow-hidden rounded-md border border-gray-500'
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
								className='h-24 gap-4 text-base text-info flex-items-center'
							>
								{t('build_strategy.update_price')}
								<RefreshSVG width='2rem' height='2rem' />
							</button>

							<button
								onClick={() => dispatch(setBuiltStrategy([]))}
								type='button'
								className='size-24 text-gray-900 flex-justify-center'
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
					<div className='relative h-24 border-t border-t-gray-500'>
						<ul
							style={{ top: '-1.2rem' }}
							className='absolute left-8 bg-white px-16 flex-items-center *:gap-4 *:truncate *:flex-items-center'
						>
							<li className='justify-end pl-24 font-medium text-gray-900'>
								{t('build_strategy.aggregate')}:
							</li>
							<li className='w-104 text-gray-1000'>
								{sepNumbers(String(requiredMargin))}
								<span className='truncate text-gray-700'>{t('common.rial')}</span>
							</li>
							<li className='w-104 text-gray-1000'>
								{sepNumbers(String(tradeCommission))}
								<span className='truncate text-gray-700'>{t('common.rial')}</span>
							</li>
							<li className='w-104 text-gray-1000'>
								{sepNumbers(String(strikeCommission))}
								<span className='truncate text-gray-700'>{t('common.rial')}</span>
							</li>
							<li className='w-104 text-gray-1000'>
								{sepNumbers(String(tax))}
								<span className='truncate text-gray-700'>{t('common.rial')}</span>
							</li>
							<li className='w-104 text-gray-1000'>
								{sepNumbers(String(vDefault))}
								<span className='truncate text-gray-700'>{t('common.rial')}</span>
							</li>
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
							className='w-40 rounded border border-gray-500 text-primary-400 transition-colors flex-justify-center btn-primary-hover'
						>
							<BookmarkSVG />
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default StrategyContracts;

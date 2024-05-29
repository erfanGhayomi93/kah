import Button from '@/components/common/Button';
import SymbolStrategyTable from '@/components/common/Tables/SymbolStrategyTable';
import { BookmarkSVG } from '@/components/icons';
import { useAppDispatch } from '@/features/hooks';
import { setBuiltStrategy } from '@/features/slices/uiSlice';
import { useBasketOrderingSystem } from '@/hooks';
import { getBasketAlertMessage } from '@/hooks/useBasketOrderingSystem';
import { sepNumbers } from '@/utils/helpers';
import { useTranslations } from 'next-intl';
import { useMemo } from 'react';
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

	const storeBuiltStrategy = () => {
		//
	};

	const sendAllStrategyContracts = () => {
		submit(contracts);
	};

	const addToVirtualPortfolio = () => {
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

			result.requiredMargin += contract.requiredMargin?.value ?? 0;
			result.tradeCommission += contract.tradeCommission?.value ?? 0;
			result.strikeCommission += contract.strikeCommission?.value ?? 0;
			result.tax += contract.tax?.value ?? 0;
			result.vDefault += contract.vDefault?.value ?? 0;
		}

		return result;
	}, [contracts]);

	return (
		<div
			style={{ flex: '0.77', minHeight: '47rem' }}
			className='relative overflow-hidden rounded-md border border-gray-500'
		>
			<div className='h-full justify-between py-16 flex-column'>
				<div className='flex-1 overflow-hidden flex-column'>
					<div className='px-16 flex-justify-between'>
						<h1 className='text-base font-medium'>{t('build_strategy.new_strategy')}</h1>
					</div>

					<div className='flex-1 overflow-auto px-8'>
						<SymbolStrategyTable
							selectedContracts={selectedContracts}
							contracts={contracts}
							onSelectionChanged={setSelectedContracts}
							onChange={(id, v) => setContractProperties(id, v)}
							onSideChange={(id, value) => setContractProperties(id, { side: value })}
							onDelete={deleteContract}
							showDetails={false}
							features={{
								withTradeCommission: true,
								withStrikeCommission: true,
								withContractSize: true,
								withRequiredMargin: true,
								withDefault: true,
								withTax: true,
							}}
						/>
					</div>
				</div>

				<div className='justify-between gap-16 bg-white px-16 pt-20 flex-column'>
					<div className='relative h-24 border-t border-t-gray-500'>
						<ul
							style={{ top: '-1.2rem' }}
							className='absolute left-24 gap-8 bg-white px-16 flex-items-center *:gap-4 *:truncate *:pr-8 *:flex-items-center'
						>
							<li className='w-72 justify-end font-medium text-gray-900'>
								{t('build_strategy.aggregate')}:
							</li>
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
							className='btn-primary-hover w-40 rounded border border-gray-500 text-primary-400 transition-colors flex-justify-center'
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

import { useOptionInfoMutation } from '@/api/mutations/optionMutations';
import { useSymbolInfoMutation } from '@/api/mutations/symbolMutations';
import Button from '@/components/common/Button';
import Checkbox from '@/components/common/Inputs/Checkbox';
import { XSVG } from '@/components/icons';
import { useAppDispatch } from '@/features/hooks';
import { setSelectSymbolContractsModal } from '@/features/slices/modalSlice';
import { type ISelectSymbolContractsModal } from '@/features/slices/types/modalSlice.interfaces';
import { useInputs } from '@/hooks';
import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import { forwardRef, memo, useEffect } from 'react';
import { toast } from 'react-toastify';
import styled from 'styled-components';
import Modal, { Header } from '../Modal';
import ContractsTable from './ContractsTable';
import Toolbar from './Toolbar';

interface SymbolContractsProps extends ISelectSymbolContractsModal {}

interface ContractProps {
	symbolTitle: string;
	side?: TBsSides;
	onRemove: () => void;
}

interface BaseSymbolCheckboxProps {
	title: string;
	symbolTitle: string;
	checked: boolean;
	disabled: boolean;
	onChange: (v: boolean) => void;
}

const Div = styled.div`
	width: 100rem;
	height: 90dvh;
	display: flex;
	flex-direction: column;
	border-radius: 8px;
	justify-content: space-between;
`;

const SelectSymbolContracts = forwardRef<HTMLDivElement, SymbolContractsProps>(
	(
		{
			initialBaseSymbol,
			suppressRowActions = false,
			suppressBaseSymbolChange = true,
			suppressSendBaseSymbol = false,
			initialSelectedBaseSymbol = false,
			initialSelectedContracts = [],
			maxContractsLength,
			callback,
			...props
		},
		ref,
	) => {
		const t = useTranslations();

		const dispatch = useAppDispatch();

		const { inputs, setFieldValue, setFieldsValue } = useInputs<SymbolContractModalStates>({
			contracts: [],
			activeSettlement: null,
			sendBaseSymbol: Boolean(initialSelectedBaseSymbol),
			baseSymbol: null,
			term: '',
		});

		const { mutate: fetchSymbolInfo, isPending: isFetchingBaseSymbol } = useSymbolInfoMutation({
			onSuccess: (symbol, { type = 'initial' }) => {
				if (!symbol) return;

				if (type === 'initial') setFieldValue('baseSymbol', symbol);
				else submit(symbol);
			},
			onError: () => {
				toast.error(t('alerts.fetch_symbol_failed'));
			},
		});

		const { mutate: fetchInitialContracts, isPending: isFetchingInitialContracts } = useOptionInfoMutation({
			onSuccess: (initialContracts) => {
				try {
					setFieldValue(
						'contracts',
						initialContracts.map<ISelectedContract>((item) => ({
							...item,
							side:
								initialSelectedContracts.find((c) => c[0] === item.symbolInfo.symbolISIN)?.[1] ?? 'buy',
						})),
					);
				} catch (e) {
					//
				}

				if (initialContracts.length > 0) {
					fetchSymbolInfo({ symbolISIN: initialContracts[0].symbolInfo.baseSymbolISIN });
				} else if (initialBaseSymbol) {
					fetchInitialBaseSymbol(initialBaseSymbol[0]);
				}
			},
			onError: () => {
				toast.error(t('alerts.fetch_symbol_failed'));
			},
		});

		const fetchInitialBaseSymbol = (symbolISIN: string) => {
			fetchSymbolInfo({ symbolISIN, type: 'initial' });
		};

		const onCloseModal = () => {
			dispatch(setSelectSymbolContractsModal(null));
		};

		const removeContract = (symbolISIN: string) => {
			setFieldsValue((prev) => ({
				...prev,
				contracts: prev.contracts.filter((item) => item.symbolInfo.symbolISIN !== symbolISIN),
			}));
		};

		const onSubmit = () => {
			try {
				const shouldSendBaseSymbol = !suppressSendBaseSymbol && inputs.sendBaseSymbol;

				if (shouldSendBaseSymbol) {
					if (isFetchingBaseSymbol) toast.info(t('alerts.is_pending'));
					else fetchSymbolInfo({ symbolISIN: inputs.baseSymbol!.symbolISIN, type: 'submit' });

					return;
				}

				submit(null);
			} catch (e) {
				//
			}
		};

		const submit = (baseSymbol: Symbol.Info | null) => {
			try {
				callback(inputs.contracts, baseSymbol);

				onCloseModal();
			} catch (e) {
				//
			}
		};

		useEffect(() => {
			if (initialSelectedContracts.length > 0) {
				fetchInitialContracts(initialSelectedContracts.map((item) => item[0]));
			} else if (initialBaseSymbol) {
				fetchInitialBaseSymbol(initialBaseSymbol[0]);
			}
		}, []);

		return (
			<Modal
				top='50%'
				style={{ modal: { transform: 'translate(-50%, -50%)' } }}
				onClose={onCloseModal}
				ref={ref}
				{...props}
			>
				<Div className='bg-white darkness:bg-gray-50'>
					<Header label={t('select_symbol_contracts_modal.title')} onClose={onCloseModal} />

					<div className='relative flex-1 gap-16 p-24 flex-column'>
						<Toolbar
							symbol={inputs.baseSymbol}
							settlementDay={inputs.activeSettlement}
							suppressBaseSymbolChange={suppressBaseSymbolChange}
							onBaseSymbolChange={(v) => {
								setFieldsValue({
									baseSymbol: v,
									contracts: [],
								});
							}}
							onSettlementDayChanged={(v) => setFieldValue('activeSettlement', v)}
							isPending={isFetchingBaseSymbol}
						/>

						<ContractsTable
							suppressRowActions={suppressRowActions}
							contracts={inputs.contracts}
							setContracts={(v) => setFieldValue('contracts', v)}
							settlementDay={inputs.activeSettlement}
							symbolISIN={inputs.baseSymbol?.symbolISIN}
							maxContractsLength={maxContractsLength}
							isPending={isFetchingBaseSymbol}
							isFetchingInitialContracts={isFetchingInitialContracts}
						/>

						{!suppressSendBaseSymbol && inputs.baseSymbol && (
							<BaseSymbolCheckbox
								title={t('select_symbol_contracts_modal.base_symbol')}
								symbolTitle={inputs.baseSymbol?.symbolTitle ?? '−'}
								checked={inputs.sendBaseSymbol}
								onChange={(v) => setFieldValue('sendBaseSymbol', v)}
								disabled={isFetchingBaseSymbol}
							/>
						)}

						<div
							style={{ minHeight: '8.8rem' }}
							className='flex h-auto gap-24 rounded border border-dashed border-gray-200 bg-gray-50 p-24'
						>
							<ul className='flex flex-1 flex-wrap gap-16'>
								{inputs.baseSymbol && inputs.sendBaseSymbol && (
									<Contract
										symbolTitle={inputs.baseSymbol?.symbolTitle ?? ''}
										onRemove={() => setFieldValue('sendBaseSymbol', false)}
									/>
								)}

								{inputs.contracts.map((item) => (
									<Contract
										key={item.symbolInfo.symbolISIN}
										symbolTitle={item.symbolInfo.symbolTitle}
										side={item.side}
										onRemove={() => removeContract(item.symbolInfo.symbolISIN)}
									/>
								))}
							</ul>

							<div style={{ flex: '0 0 14.4rem' }} className='flex-items-end'>
								<Button
									type='button'
									onClick={onSubmit}
									disabled={
										(inputs.contracts.length === 0 && !inputs.sendBaseSymbol) || !inputs.baseSymbol
									}
									className='h-40 w-full rounded btn-primary'
									loading={isFetchingBaseSymbol}
								>
									{t('select_symbol_contracts_modal.add')}
								</Button>
							</div>
						</div>
					</div>
				</Div>
			</Modal>
		);
	},
);

const Contract = ({ onRemove, symbolTitle, side }: ContractProps) => {
	return (
		<li
			style={{ flex: '0 0 10.4rem' }}
			className={clsx(
				'h-32 gap-8 rounded px-8 flex-justify-between',
				side ? (side === 'buy' ? 'bg-success-100/10' : 'bg-error-100/10') : 'bg-gray-300',
			)}
		>
			<span className='text-base text-gray-800'>{symbolTitle}</span>
			<button onClick={onRemove} type='button' className='text-gray-700'>
				<XSVG width='1.4rem' height='1.4rem' />
			</button>
		</li>
	);
};

const BaseSymbolCheckbox = memo(
	({ title, symbolTitle, checked, disabled, onChange }: BaseSymbolCheckboxProps) => (
		<div
			style={{ flex: '0 0 4rem' }}
			className='rounded bg-white px-8 shadow-sm flex-items-center darkness:bg-gray-50'
		>
			<Checkbox
				label={
					<>
						{title}:<span className='pr-4 font-medium'>{symbolTitle}</span>
					</>
				}
				checked={checked}
				onChange={onChange}
				disabled={disabled}
			/>
		</div>
	),
	(prev, next) =>
		prev.checked === next.checked && prev.disabled === next.disabled && prev.symbolTitle === next.symbolTitle,
);

export default SelectSymbolContracts;

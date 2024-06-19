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
	optionType?: TOptionSides;
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
			initialBaseSymbolISIN,
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
				setFieldValue('contracts', initialContracts);
			},
			onError: () => {
				toast.error(t('alerts.fetch_symbol_failed'));
			},
		});

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
			if (initialSelectedContracts.length > 0) fetchInitialContracts(initialSelectedContracts);
			if (initialBaseSymbolISIN) fetchSymbolInfo({ symbolISIN: initialBaseSymbolISIN, type: 'initial' });
		}, []);

		useEffect(() => {
			setFieldValue('contracts', []);
		}, [inputs.baseSymbol?.symbolISIN]);

		return (
			<Modal
				top='50%'
				style={{ modal: { transform: 'translate(-50%, -50%)' } }}
				onClose={onCloseModal}
				ref={ref}
				{...props}
			>
				<Div className='bg-white'>
					<Header label={t('select_symbol_contracts_modal.title')} onClose={onCloseModal} />

					<div className='relative flex-1 gap-16 p-24 flex-column'>
						<Toolbar
							symbol={inputs.baseSymbol}
							settlementDay={inputs.activeSettlement}
							suppressBaseSymbolChange={suppressBaseSymbolChange}
							onBaseSymbolChange={(v) => setFieldValue('baseSymbol', v)}
							onSettlementDayChanged={(v) => setFieldValue('activeSettlement', v)}
							isPending={isFetchingBaseSymbol}
						/>

						<ContractsTable
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
							className='flex h-auto gap-24 rounded border border-dashed border-light-gray-200 bg-light-gray-50 p-24'
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
										optionType={item.symbolInfo.optionType === 'Call' ? 'call' : 'put'}
										onRemove={() => removeContract(item.symbolInfo.symbolISIN)}
									/>
								))}
							</ul>

							<div style={{ flex: '0 0 14.4rem' }} className='flex-items-end'>
								<Button
									type='button'
									onClick={onSubmit}
									disabled={inputs.contracts.length === 0 || !inputs.baseSymbol}
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

const Contract = ({ onRemove, symbolTitle, optionType }: ContractProps) => {
	return (
		<li
			style={{ flex: '0 0 10.4rem' }}
			className={clsx(
				'h-32 gap-8 rounded px-8 flex-justify-between',
				optionType
					? optionType === 'call'
						? 'bg-light-success-100/10'
						: 'bg-light-error-100/10'
					: 'bg-light-gray-300',
			)}
		>
			<span className='text-base text-light-gray-800'>{symbolTitle}</span>
			<button onClick={onRemove} type='button' className='text-light-gray-700'>
				<XSVG width='1.4rem' height='1.4rem' />
			</button>
		</li>
	);
};

const BaseSymbolCheckbox = memo(
	({ title, symbolTitle, checked, disabled, onChange }: BaseSymbolCheckboxProps) => (
		<div style={{ flex: '0 0 4rem' }} className='rounded bg-white px-8 shadow-card flex-items-center'>
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

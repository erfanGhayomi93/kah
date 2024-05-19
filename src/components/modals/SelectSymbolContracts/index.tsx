import Checkbox from '@/components/common/Inputs/Checkbox';
import { XSVG } from '@/components/icons';
import { useAppDispatch } from '@/features/hooks';
import { setSelectSymbolContractsModal } from '@/features/slices/modalSlice';
import { type ISelectSymbolContractsModal } from '@/features/slices/types/modalSlice.interfaces';
import { useInputs } from '@/hooks';
import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import { forwardRef } from 'react';
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
			symbol,
			initialSelectedBaseSymbol,
			initialSelectedContracts,
			canChangeBaseSymbol,
			canSendBaseSymbol,
			maxContracts,
			callback,
			...props
		},
		ref,
	) => {
		const t = useTranslations();

		const dispatch = useAppDispatch();

		const {
			inputs: states,
			setFieldValue,
			setFieldsValue,
		} = useInputs<SymbolContractModalStates>({
			contractType: {
				id: 'buy',
				title: t('side.buy'),
			},
			contracts: [],
			activeSettlement: null,
			sendBaseSymbol: Boolean(initialSelectedBaseSymbol),
			term: '',
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
			callback(states.contracts, canSendBaseSymbol && states.sendBaseSymbol && symbol ? symbol.symbolISIN : null);
			onCloseModal();
		};

		return (
			<Modal
				top='50%'
				style={{ modal: { transform: 'translate(-50%, -50%)' } }}
				onClose={onCloseModal}
				{...props}
				ref={ref}
			>
				<Div className='bg-white'>
					<Header label={t('select_symbol_contracts_modal.title')} onClose={onCloseModal} />

					<div className='flex-1 gap-16 p-24 flex-column'>
						<Toolbar
							canChangeBaseSymbol={canChangeBaseSymbol}
							settlementDay={states.activeSettlement}
							setSettlementDay={(v) => setFieldValue('activeSettlement', v)}
							symbol={symbol}
						/>

						<ContractsTable
							initialSelectedContracts={initialSelectedContracts ?? []}
							contracts={states.contracts}
							setContracts={(v) => setFieldValue('contracts', v)}
							settlementDay={states.activeSettlement}
							symbolISIN={symbol?.symbolISIN}
							maxContracts={maxContracts}
						/>

						{canSendBaseSymbol && symbol && (
							<div
								style={{ flex: '0 0 4rem' }}
								className='rounded bg-white px-8 shadow-card flex-items-center'
							>
								<Checkbox
									label={
										<>
											{t('select_symbol_contracts_modal.base_symbol')}:
											<span className='pr-4 font-medium'>{symbol?.symbolTitle ?? '−'}</span>
										</>
									}
									checked={states.sendBaseSymbol}
									onChange={(v) => setFieldValue('sendBaseSymbol', v)}
								/>
							</div>
						)}

						<div
							style={{ minHeight: '8.8rem' }}
							className='flex h-auto gap-24 rounded border border-dashed border-gray-500 bg-gray-100 p-24'
						>
							<ul className='flex flex-1 flex-wrap gap-16'>
								{states.sendBaseSymbol && (
									<Contract
										key={symbol?.symbolISIN}
										symbolTitle={symbol?.symbolTitle ?? ''}
										onRemove={() => setFieldValue('sendBaseSymbol', false)}
									/>
								)}

								{states.contracts.map((item) => (
									<Contract
										key={item.symbolInfo.symbolISIN}
										symbolTitle={item.symbolInfo.symbolTitle}
										optionType={item.symbolInfo.optionType === 'Call' ? 'call' : 'put'}
										onRemove={() => removeContract(item.symbolInfo.symbolISIN)}
									/>
								))}
							</ul>

							<div style={{ flex: '0 0 14.4rem' }} className='flex-items-end'>
								<button
									type='button'
									onClick={onSubmit}
									disabled={states.contracts.length === 0}
									className='h-40 w-full rounded btn-primary'
								>
									{t('select_symbol_contracts_modal.add')}
								</button>
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
				optionType ? (optionType === 'call' ? 'bg-success-100/10' : 'bg-error-100/10') : 'bg-gray-300',
			)}
		>
			<span className='text-base text-gray-1000'>{symbolTitle}</span>
			<button onClick={onRemove} type='button' className='text-gray-900'>
				<XSVG width='1.4rem' height='1.4rem' />
			</button>
		</li>
	);
};

export default SelectSymbolContracts;

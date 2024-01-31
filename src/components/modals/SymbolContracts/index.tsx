import { useBaseSettlementDaysQuery } from '@/api/queries/optionQueries';
import Select from '@/components/common/Select';
import { SearchSVG, XSVG } from '@/components/icons';
import { useAppDispatch } from '@/features/hooks';
import { toggleSymbolContractsModal, type IContractSelectorModal } from '@/features/slices/modalSlice';
import { useTranslations } from 'next-intl';
import { useMemo, useState } from 'react';
import styled from 'styled-components';
import Modal from '../Modal';

interface SymbolContractsProps extends IContractSelectorModal {}

const Div = styled.div`
	width: 88rem;
	height: 80rem;
	display: flex;
	flex-direction: column;
	border-radius: 8px;
	justify-content: space-between;
	gap: 1.6rem;
`;

const SymbolContracts = ({ symbolISIN, symbolTitle }: SymbolContractsProps) => {
	const t = useTranslations();

	const dispatch = useAppDispatch();

	const contractTypes = useMemo(
		() => [
			{
				id: 'buy',
				title: t('side.buy'),
			},
			{
				id: 'sell',
				title: t('side.sell'),
			},
		],
		[],
	);

	const [states, setStates] = useState<SymbolContractModal>({
		contractType: contractTypes[0],
		activeSettlement: null,
	});

	const onCloseModal = () => {
		dispatch(toggleSymbolContractsModal(null));
	};

	const setStatesValue = <T extends keyof SymbolContractModal>(name: T, value: SymbolContractModal[T]) => {
		setStates((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const { data: settlementDays } = useBaseSettlementDaysQuery({
		queryKey: ['baseSettlementDaysQuery', symbolISIN],
	});

	const onChangeSymbolTerm = (value: string) => {
		console.log(value);
	};

	return (
		<Modal top='7.2rem' onClose={onCloseModal}>
			<Div className='bg-white'>
				<div className='gap-16 flex-column'>
					<div className='relative h-72 border-b border-gray-500 flex-justify-center'>
						<h2 className='text-gray-1000 text-lg font-medium'>
							{t('symbol_contracts_modal.title', { symbolTitle })}
						</h2>

						<button
							onClick={onCloseModal}
							style={{ left: '1.6rem' }}
							type='button'
							className='text-gray-1000 absolute top-1/2 -translate-y-1/2 transform p-8'
						>
							<XSVG width='1.6rem' height='1.6rem' />
						</button>
					</div>

					<div className='h-40 px-32 flex-justify-between'>
						<label
							style={{ maxWidth: '40rem' }}
							className='input-group h-40 flex-1 rounded border border-gray-500 flex-items-center'
						>
							<div className='text-gray-800 px-8'>
								<SearchSVG width='2rem' height='2rem' />
							</div>

							<input
								type='text'
								inputMode='search'
								className='h-full flex-1 border-none bg-transparent'
								maxLength={36}
								placeholder={t('symbol_contracts_modal.contract_search_placeholder')}
								onChange={(e) => onChangeSymbolTerm(e.target.value)}
							/>
						</label>

						<div style={{ maxWidth: '20rem' }} className='flex-1 gap-8 flex-justify-end'>
							<span className='text-gray-1000 whitespace-nowrap text-base'>
								{t('symbol_contracts_modal.search_contract')}:
							</span>

							<Select
								value={states.contractType}
								options={contractTypes}
								onChange={(option) =>
									setStatesValue('contractType', option as Record<'id' | 'title', string>)
								}
							/>
						</div>
					</div>
				</div>

				<div className='flex flex-1 items-start gap-24 px-32 pb-48 pt-16'>
					<div style={{ flex: '0 0 18.6rem' }} />
					<div className='flex-1' />
				</div>

				<div className='px-32 pb-24 flex-justify-end'>
					<button type='button' className='h-40 rounded px-40 btn-primary' disabled>
						{t('symbol_contracts_modal.add_contract_to_symbol', { symbolTitle })}
					</button>
				</div>
			</Div>
		</Modal>
	);
};

export default SymbolContracts;

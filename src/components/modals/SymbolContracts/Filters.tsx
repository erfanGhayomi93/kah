import Select from '@/components/common/Inputs/Select';
import { SearchSVG } from '@/components/icons';
import { useAppDispatch } from '@/features/hooks';
import { toggleSymbolContractsModal } from '@/features/slices/modalSlice';
import { useTranslations } from 'next-intl';
import { useMemo } from 'react';
import { Header } from '../Modal';

interface FiltersProps extends SymbolContractModalStates {
	symbolTitle: string;
	setStatesValue: <T extends keyof SymbolContractModalStates>(name: T, value: SymbolContractModalStates[T]) => void;
}

const Filters = ({ symbolTitle, contractType, term, setStatesValue }: FiltersProps) => {
	const t = useTranslations();

	const dispatch = useAppDispatch();

	const onCloseModal = () => {
		dispatch(toggleSymbolContractsModal(null));
	};

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

	return (
		<div className='gap-16 flex-column'>
			<Header label={t('symbol_contracts_modal.title', { symbolTitle })} onClose={onCloseModal} />

			<div className='h-40 px-32 flex-justify-between'>
				<label
					style={{ maxWidth: '30rem' }}
					className='h-40 flex-1 rounded border border-input flex-items-center input-group'
				>
					<div className='px-8 text-gray-800'>
						<SearchSVG width='2rem' height='2rem' />
					</div>

					<input
						type='text'
						inputMode='search'
						className='h-full flex-1 border-none bg-transparent'
						maxLength={36}
						placeholder={t('symbol_contracts_modal.contract_search_placeholder')}
						value={term}
						onChange={(e) => setStatesValue('term', e.target.value)}
					/>
				</label>

				<div style={{ maxWidth: '20rem' }} className='flex-1 gap-8 flex-justify-end'>
					<span className='whitespace-nowrap text-base text-gray-1000'>
						{t('symbol_contracts_modal.search_contract')}:
					</span>

					<Select<typeof contractType>
						value={contractType}
						options={contractTypes}
						onChange={(option) => setStatesValue('contractType', option as Record<'id' | 'title', string>)}
						getOptionId={(option) => option.id}
						getOptionTitle={(option) => option.title}
					/>
				</div>
			</div>
		</div>
	);
};

export default Filters;

import { useTranslations } from 'next-intl';

interface SearchBasisProps {
	value: 'base' | 'contract';
	onChange: (v: 'base' | 'contract') => void;
}

const SearchBasis = ({ value, onChange }: SearchBasisProps) => {
	const t = useTranslations();

	return (
		<div className='flex gap-32 pt-20 text-base'>
			<span className='text-gray-900'>{t('black_scholes_modal.search_basis')}:</span>

			<label className='gap-8 flex-items-center'>
				<input type='radio' value='base' checked={value === 'base'} onChange={() => onChange('base')} />
				<span>{t('black_scholes_modal.base_symbol')}</span>
			</label>

			<label className='gap-8 flex-items-center'>
				<input
					type='radio'
					value='contract'
					checked={value === 'contract'}
					onChange={() => onChange('contract')}
				/>
				<span>{t('black_scholes_modal.symbol_contract')}</span>
			</label>
		</div>
	);
};

export default SearchBasis;

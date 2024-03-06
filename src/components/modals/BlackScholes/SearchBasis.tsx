import Radiobox from '@/components/common/Inputs/Radiobox';
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

			<Radiobox
				checked={value === 'base'}
				onChange={(checked) => checked && onChange('base')}
				label={t('black_scholes_modal.base_symbol')}
			/>

			<Radiobox
				checked={value === 'contract'}
				onChange={(checked) => checked && onChange('contract')}
				label={t('black_scholes_modal.symbol_contract')}
			/>
		</div>
	);
};

export default SearchBasis;

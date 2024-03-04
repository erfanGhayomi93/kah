import AsyncSelect from '@/components/common/Inputs/AsyncSelect';
import { englishToPersian, sepNumbers } from '@/utils/helpers';
import { useTranslations } from 'next-intl';
import { useMemo, useState } from 'react';

interface SymbolSearchProps {
	value: IBlackScholesModalStates['contract'];
	isLoading: boolean;
	disabled: boolean;
	options: Option.Root[];
	onChange: (symbol: IBlackScholesModalStates['contract']) => void;
}

const ContractSearch = ({ value, disabled, isLoading, options, onChange }: SymbolSearchProps) => {
	const t = useTranslations();

	const [term, setTerm] = useState('');

	const data = useMemo(() => {
		if (!term) return options;
		return options.filter((o) => o.symbolInfo.symbolTitle.includes(englishToPersian(term)));
	}, [term, options]);

	return (
		<AsyncSelect<Option.Root>
			options={data}
			value={value}
			term={term}
			disabled={disabled}
			loading={isLoading}
			blankPlaceholder={t('black_scholes_modal.no_contract_found')}
			placeholder={t('black_scholes_modal.contract')}
			getOptionId={(option) => option!.symbolInfo.symbolISIN}
			getOptionTitle={(option) => (
				<div className='w-full flex-1 flex-justify-between'>
					<span>{option!.symbolInfo.symbolTitle}</span>
					<span>{sepNumbers(String(option!.symbolInfo.strikePrice))}</span>
				</div>
			)}
			onChange={onChange}
			onChangeTerm={setTerm}
			classes={{
				root: '!h-48',
			}}
		/>
	);
};

export default ContractSearch;

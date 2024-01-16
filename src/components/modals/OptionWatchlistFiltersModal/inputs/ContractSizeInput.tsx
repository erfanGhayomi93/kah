import { convertStringToInteger, sepNumbers } from '@/utils/helpers';
import { useTranslations } from 'next-intl';

interface ContractSizeInputProps {
	value: IOptionWatchlistFilters['contractSize'];
	onChange: (value: IOptionWatchlistFilters['contractSize']) => void;
}

const Input = (props: React.InputHTMLAttributes<HTMLInputElement>) => (
	<input type='text' inputMode='numeric' maxLength={12} className='h-40 w-full rounded border border-gray-400 px-8 text-left text-gray-100 ltr' {...props} />
);

const ContractSizeInput = ({ value: [fromValue, toValue], onChange }: ContractSizeInputProps) => {
	const t = useTranslations();

	const valueFormatter = (value: number): string => {
		if (value < 0) return '';
		return sepNumbers(String(value));
	};

	return (
		<div className='flex-1 gap-16 flex-justify-end'>
			<div className='flex-1 gap-8 flex-items-center'>
				<span>{t('common.from')}</span>
				<Input value={valueFormatter(fromValue)} onChange={(e) => onChange([Number(convertStringToInteger(e.target.value)), toValue])} />
			</div>
			<div className='flex-1 gap-8 flex-items-center'>
				<span>{t('common.to')}</span>
				<Input value={valueFormatter(toValue)} onChange={(e) => onChange([fromValue, Number(convertStringToInteger(e.target.value))])} />
			</div>
		</div>
	);
};

export default ContractSizeInput;

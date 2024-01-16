import { useTranslations } from 'next-intl';

interface DeltaInputProps {
	value: IOptionWatchlistFilters['delta'];
	onChange: (value: IOptionWatchlistFilters['delta']) => void;
}

const Input = (props: React.InputHTMLAttributes<HTMLInputElement>) => (
	<input type='text' inputMode='decimal' maxLength={12} className='h-40 w-full rounded border border-gray-400 px-8 text-left text-gray-100 ltr' {...props} />
);

const DeltaInput = ({ value: [fromValue, toValue], onChange }: DeltaInputProps) => {
	const t = useTranslations();

	return (
		<div className='flex-1 gap-16 flex-justify-end'>
			<div className='flex-1 gap-8 flex-items-center'>
				<span>{t('common.from')}</span>
				<Input value={fromValue.replace(/[^0-9.]/gi, '')} onChange={(e) => onChange([e.target.value, toValue])} />
			</div>
			<div className='flex-1 gap-8 flex-items-center'>
				<span>{t('common.to')}</span>
				<Input value={toValue.replace(/[^0-9.]/gi, '')} onChange={(e) => onChange([fromValue, e.target.value])} />
			</div>
		</div>
	);
};

export default DeltaInput;

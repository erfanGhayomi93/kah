import Datepicker from '@/components/common/Datepicker';
import { useTranslations } from 'next-intl';

interface EndDateInputProps {
	value: IOptionWatchlistFilters['endDate'];
	onChange: (value: IOptionWatchlistFilters['endDate']) => void;
}

const EndDateInput = ({ value: [fromEndDate, toEndDate], onChange }: EndDateInputProps) => {
	const t = useTranslations();

	return (
		<div className='flex-1 gap-16 flex-justify-end'>
			<div className='flex-1 gap-8 flex-items-center'>
				<span>{t('common.from')}</span>
				<Datepicker clearable value={fromEndDate} onChange={(value) => onChange([value, toEndDate])} />
			</div>
			<div className='flex-1 gap-8 flex-items-center'>
				<span>{t('common.to')}</span>
				<Datepicker clearable value={toEndDate} onChange={(value) => onChange([fromEndDate, value])} />
			</div>
		</div>
	);
};

export default EndDateInput;

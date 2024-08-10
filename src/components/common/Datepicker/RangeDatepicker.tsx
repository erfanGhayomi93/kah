import { isBetween } from '@/utils/helpers';
import { useTranslations } from 'next-intl';
import AdvancedDatepicker from './AdvanceDatePicker';

interface RangeDatepickerProps {
	fromDate: number;
	toDate: number;
	suppressDisableToDate?: boolean;
	onChangeFromDate: (date: Date) => void;
	onChangeToDate: (date: Date) => void;
}

const RangeDatepicker = ({
	fromDate,
	toDate,
	suppressDisableToDate = true,
	onChangeFromDate,
	onChangeToDate,
}: RangeDatepickerProps) => {
	const t = useTranslations('dates');

	return (
		<div className='flex-1 gap-16 flex-justify-start'>
			<div className='flex-1'>
				<AdvancedDatepicker
					value={fromDate}
					onChange={onChangeFromDate}
					disabledIsAfter={toDate}
					fixedPlaceholder={t('from_date')}
					classes={{
						container: 'h-32 bg-white darkness:bg-gray-50',
					}}
				/>
			</div>

			<div className='flex-1'>
				<AdvancedDatepicker
					value={toDate}
					onChange={onChangeToDate}
					fixedPlaceholder={t('to_date')}
					dateIsDisabled={(date) => {
						const toD = new Date(date).getTime();
						const fromD = new Date(fromDate).getTime();

						if (suppressDisableToDate) return toD < fromD;

						return !isBetween(fromD, toD, Date.now());
					}}
					classes={{
						container: 'h-32 bg-white darkness:bg-gray-50',
					}}
				/>
			</div>
		</div>
	);
};

export default RangeDatepicker;

import { CalendarSVG } from '@/components/icons';
import dayjs from '@/libs/dayjs';
import { useTranslations } from 'next-intl';

interface ContractProps extends Option.BaseSettlementDays {}

const Contract = ({ workingDaysLeftCount, contractEndDate, dueDays }: ContractProps) => {
	const t = useTranslations();

	const jalaliDate = dayjs(contractEndDate).calendar('jalali').format('YYYY/MM/DD');

	return (
		<li className='even:bg-gray-100 *:text-gray-700 h-40 px-8 flex-justify-between *:text-base'>
			<div className='gap-8 flex-items-center'>
				<CalendarSVG width='2rem' height='2rem' />
				<span>{jalaliDate}</span>
			</div>

			<span>{t('symbol_info_panel.contract_description', { workingDaysLeftCount, dueDays })}</span>
		</li>
	);
};

export default Contract;

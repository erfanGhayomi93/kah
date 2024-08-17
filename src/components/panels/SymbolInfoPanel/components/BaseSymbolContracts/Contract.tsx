import { AngleLeftSVG, CalendarSVG } from '@/components/icons';
import dayjs from '@/libs/dayjs';
import { Link } from '@/navigation';
import { useTranslations } from 'next-intl';

interface ContractProps extends Option.BaseSettlementDays {}

const Contract = ({ workingDaysLeftCount, contractEndDate, baseSymbolISIN, dueDays }: ContractProps) => {
	const t = useTranslations();

	const settlementDayAsTimestamp = new Date(contractEndDate).getTime();
	const jalaliDate = dayjs(settlementDayAsTimestamp).calendar('jalali').format('YYYY/MM/DD');

	return (
		<li>
			<Link
				target='_blank'
				href={`/option-chain?symbolISIN=${baseSymbolISIN}&settlementDay=${settlementDayAsTimestamp}`}
				className='h-40 cursor-pointer px-8 flex-justify-between *:text-base *:text-gray-700 even:bg-gray-100'
			>
				<div className='gap-8 flex-items-center'>
					<CalendarSVG width='2rem' height='2rem' />
					<span>{jalaliDate}</span>
				</div>

				<div className='gap-8 flex-items-center'>
					<span>{t('symbol_info_panel.contract_description', { workingDaysLeftCount, dueDays })}</span>
					<AngleLeftSVG width='1.8rem' height='1.8rem' />
				</div>
			</Link>
		</li>
	);
};

export default Contract;

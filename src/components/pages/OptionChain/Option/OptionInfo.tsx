import { CalendarSVG } from '@/components/icons';
import dayjs from '@/libs/dayjs';
import { sepNumbers } from '@/utils/helpers';
import { useTranslations } from 'next-intl';
import { useMemo } from 'react';

interface OptionInfoProps {
	settlementDay: Option.BaseSettlementDays;
}

const OptionInfo = ({ settlementDay }: OptionInfoProps) => {
	const t = useTranslations();

	const calendar = useMemo(() => {
		return dayjs(settlementDay.contractEndDate).calendar('jalali').format('YYYY/MM/DD');
	}, [settlementDay]);

	return (
		<div
			style={{ flex: '0 0 4rem' }}
			className='rounded bg-white px-16 flex-justify-between darkBlue:bg-gray-50 dark:bg-gray-50'
		>
			<div className='flex-1 gap-16 text-right flex-justify-start'>
				<span className='gap-8 text-lg text-gray-700 flex-items-center'>
					<CalendarSVG />
					{calendar}
				</span>
				<span className='text-base text-gray-700'>
					{t('option_chain.contract_due_days', {
						dueDays: settlementDay.dueDays ?? 0,
						workingDaysLeftCount: settlementDay.workingDaysLeftCount ?? 0,
					})}
				</span>
			</div>

			<div className='flex-1 gap-32 flex-justify-end'>
				<div className='flex items-center gap-8'>
					<span className='text-base text-gray-700'>{t('option_chain.open_contracts_count')}:</span>
					<span className='font-medium text-gray-800'>
						{sepNumbers(String(settlementDay.openPosition ?? 0))}
					</span>
				</div>

				<div className='flex items-center gap-8'>
					<span className='text-base text-gray-700'>{t('option_chain.max_open_positions')}:</span>
					<span className='font-medium text-gray-800'>{sepNumbers(String(settlementDay?.maxop ?? 0))}</span>
				</div>
			</div>
		</div>
	);
};

export default OptionInfo;

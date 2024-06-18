import { CalendarSVG } from '@/components/icons';
import dayjs from '@/libs/dayjs';
import { sepNumbers } from '@/utils/helpers';
import { letters } from '@/utils/num2persian';
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

	const [volume, volumeAsLetter] = useMemo(() => {
		let num = settlementDay.oneMonthTradeValue;
		let index = 0;

		while (num >= 1e3 && index < letters.length - 1) {
			num /= 1e3;
			index++;
		}

		return [`\u200e${num.toFixed(3).replace(/\.?0+$/, '')}`, `${letters[index]} ${t('common.toman')}`];
	}, []);

	return (
		<div style={{ flex: '0 0 4rem' }} className='rounded bg-white px-16 flex-justify-between'>
			<div className='flex-1 gap-16 text-right flex-justify-start'>
				<span className='text-light-gray-700 gap-8 text-lg flex-items-center'>
					<CalendarSVG />
					{calendar}
				</span>
				<span className='text-light-gray-700 text-base'>
					{t('option_chain.contract_due_days', {
						dueDays: settlementDay.dueDays ?? 0,
						workingDaysLeftCount: settlementDay.workingDaysLeftCount ?? 0,
					})}
				</span>
			</div>

			<div className='flex-1 gap-32 flex-justify-end'>
				<div className='flex items-center gap-8'>
					<span className='text-light-gray-700 text-base'>{t('option_chain.open_contracts_count')}:</span>
					<span className='text-light-gray-800 font-medium'>
						{sepNumbers(String(settlementDay.openPosition ?? 0))}
					</span>
				</div>

				<div className='flex items-center gap-8'>
					<span className='text-light-gray-700 text-base'>
						{t('old_option_chain.one_month_trade_volume')}:
					</span>
					<span>
						<span className='text-light-gray-800 text-lg font-bold'>{volume}</span>
						<span className='text-light-gray-700 text-tiny'>{volumeAsLetter}</span>
					</span>
				</div>
			</div>
		</div>
	);
};

export default OptionInfo;

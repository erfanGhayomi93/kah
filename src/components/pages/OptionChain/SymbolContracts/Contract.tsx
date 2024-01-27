import { ArrowDownSVG } from '@/components/icons';
import dayjs from '@/libs/dayjs';
import { letters } from '@/utils/num2persian';
import { useTranslations } from 'next-intl';
import { useMemo, useRef, useState } from 'react';
import Table from './Table';

interface ContractProps extends Option.BaseSettlementDays {}

const Contract = ({
	baseSymbolISIN,
	contractEndDate,
	dueDays,
	workingDaysLeftCount,
	oneMonthTradeValue,
}: ContractProps) => {
	const t = useTranslations();

	const timer = useRef<NodeJS.Timeout | null>(null);

	const [expand, setExpand] = useState<Record<'is' | 'loading', boolean>>({
		is: false,
		loading: false,
	});

	const setExpandField = <T extends keyof typeof expand>(field: T, value: boolean) => {
		setExpand((prev) => ({
			...prev,
			[field]: value,
		}));
	};

	const toggleContract = () => {
		setExpand({
			is: !expand.is,
			loading: true,
		});

		if (timer.current) clearTimeout(timer.current);
		timer.current = setTimeout(() => {
			setExpandField('loading', false);
		}, 250);
	};

	const [volume, volumeAsLetter] = useMemo(() => {
		let num = oneMonthTradeValue;
		let index = 0;

		while (num >= 1e3 && index < letters.length - 1) {
			num /= 1e3;
			index++;
		}

		return [`\u200e${num.toFixed(3).replace(/\.?0+$/, '')}`, `${letters[index]} ${t('common.toman')}`];
	}, []);

	const calendar = useMemo(() => {
		return dayjs(contractEndDate).calendar('jalali').format('YYYY/MM/DD');
	}, []);

	return (
		<div className='rounded bg-white flex-column'>
			<div onClick={toggleContract} className='h-40 w-full cursor-pointer select-none px-16 flex-justify-between'>
				<div className='flex-1 gap-32 flex-justify-start'>
					<span className='text-lg text-gray-100'>{calendar}</span>
					<span className='text-base text-gray-200'>
						{t('option_chain.contract_due_days', { dueDays, workingDaysLeftCount })}
					</span>
				</div>

				<div className='flex-1 gap-32 flex-justify-end'>
					<div className='flex items-center gap-8'>
						<span className='text-base text-gray-200'>{t('option_chain.one_month_trade_volume')}:</span>
						<span>
							<span className='text-lg font-bold text-gray-200'>{volume}</span>
							<span className='text-tiny text-gray-100'>{volumeAsLetter}</span>
						</span>
					</div>

					<ArrowDownSVG
						width='1.2rem'
						height='1.2rem'
						style={{ transform: expand ? 'rotate(180deg)' : undefined }}
						className='text-gray-100 transition-transform'
					/>
				</div>
			</div>

			<div
				className='relative'
				style={{
					minHeight: expand.is ? '24rem' : 0,
					transition: 'min-height 200ms',
				}}
			>
				{expand.is && (
					<Table
						expanding={expand.loading}
						baseSymbolISIN={baseSymbolISIN}
						contractEndDate={contractEndDate}
					/>
				)}
			</div>
		</div>
	);
};

export default Contract;

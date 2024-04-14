import { ArrowDownSVG } from '@/components/icons';
import dayjs from '@/libs/dayjs';
import { cn } from '@/utils/helpers';
import { letters } from '@/utils/num2persian';
import { useTranslations } from 'next-intl';
import { useEffect, useMemo, useRef, useState } from 'react';
import Table from './Table';

interface ContractProps extends Option.BaseSettlementDays {
	expand: boolean;
	onToggle: () => void;
}

const Contract = ({
	baseSymbolISIN,
	contractEndDate,
	dueDays,
	workingDaysLeftCount,
	oneMonthTradeValue,
	expand,
	onToggle,
}: ContractProps) => {
	const t = useTranslations();

	const wrapperRef = useRef<HTMLDivElement>(null);

	const timer = useRef<NodeJS.Timeout | null>(null);

	const [expanding, setExpanding] = useState(expand);

	const toggleContract = () => {
		onToggle();
		setExpanding(true);

		if (timer.current) clearTimeout(timer.current);
		timer.current = setTimeout(() => {
			setExpanding(false);
		}, 600);
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

	useEffect(() => {
		setTimeout(() => {
			const eWrapper = wrapperRef.current;
			if (!eWrapper || !expand) return;

			eWrapper.scrollIntoView({
				behavior: 'smooth',
				block: 'center',
			});
		}, 400);
	}, [expand]);

	return (
		<div
			ref={wrapperRef}
			className={cn('overflow-hidden rounded bg-white flex-column', expand && 'border border-primary-300')}
		>
			<div onClick={toggleContract} className='h-40 w-full cursor-pointer select-none px-16 flex-justify-between'>
				<div className='flex-1 gap-32 text-right flex-justify-start'>
					<span style={{ width: '8rem' }} className='text-lg text-gray-1000'>
						{calendar}
					</span>
					<span className='text-base text-gray-900'>
						{t('old_option_chain.contract_due_days', { dueDays, workingDaysLeftCount })}
					</span>
				</div>

				<div className='flex-1 gap-32 flex-justify-end'>
					<div className='flex items-center gap-8'>
						<span className='text-base text-gray-900'>{t('old_option_chain.one_month_trade_volume')}:</span>
						<span>
							<span className='text-lg font-bold text-gray-1000'>{volume}</span>
							<span className='text-tiny text-gray-900'>{volumeAsLetter}</span>
						</span>
					</div>

					<ArrowDownSVG
						width='1.2rem'
						height='1.2rem'
						style={{ transform: expand ? 'rotate(180deg)' : undefined }}
						className='text-gray-1000 transition-transform'
					/>
				</div>
			</div>

			<div
				className='relative'
				style={{
					height: expand ? '48.8rem' : 0,
					transition: 'height 600ms ease-in-out',
				}}
			>
				{expand && (
					<Table expanding={expanding} baseSymbolISIN={baseSymbolISIN} contractEndDate={contractEndDate} />
				)}
			</div>
		</div>
	);
};

export default Contract;

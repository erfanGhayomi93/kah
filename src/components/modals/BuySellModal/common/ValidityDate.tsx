import Click from '@/components/common/Click';
import { ArrowUpSVG } from '@/components/icons';
import { cn } from '@/utils/helpers';
import { useTranslations } from 'next-intl';
import { useMemo, useState } from 'react';

interface ValidityDateProps {
	value: TBsValidityDates;
	onChange: (value: TBsValidityDates) => void;
}

const ValidityDate = ({ value, onChange }: ValidityDateProps) => {
	const t = useTranslations();

	const [showValidityDates, setShowValidityDates] = useState(false);

	const VALIDITY_DATES: Array<{ id: TBsValidityDates; title: string }> = useMemo(
		() => [
			{
				id: 'Day',
				title: t('validity_date.Day'),
			},
			{
				id: 'Week',
				title: t('validity_date.Week'),
			},
			{
				id: 'Month',
				title: t('validity_date.Month'),
			},
			{
				id: 'GoodTillDate',
				title: t('validity_date.GoodTillDate'),
			},
			{
				id: 'GoodTillCancelled',
				title: t('validity_date.GoodTillCancelled'),
			},
			{
				id: 'FillAndKill',
				title: t('validity_date.FillAndKill'),
			},
		],
		[],
	);

	const validityDateTitle = useMemo(() => VALIDITY_DATES.find((item) => item.id === value)?.title ?? '−', [value]);

	return (
		<Click enabled onClickOutside={() => setShowValidityDates(false)}>
			<div className='relative'>
				<div
					onClick={() => setShowValidityDates(!showValidityDates)}
					className='h-40 cursor-pointer select-none gap-8 px-8 flex-justify-between gray-box'
				>
					<span className='text-light-gray-700 whitespace-nowrap text-base'>
						{t('bs_modal.validity_date')}
					</span>

					<span className='text-light-primary-100 gap-8 text-tiny flex-items-center'>
						<span className='bg-light-secondary-200 border-light-primary-100 text-light-primary-100 h-24 rounded border px-8 flex-items-center'>
							{validityDateTitle}
						</span>
						<span className='text-light-gray-700'>
							<ArrowUpSVG width='1.2rem' height='1.2rem' />
						</span>
					</span>
				</div>

				{showValidityDates && (
					<ul
						style={{ top: 'calc(100% + 0.8rem)', zIndex: 99 }}
						className='absolute left-0 w-full flex-wrap gap-8 py-16 flex-justify-center gray-box'
					>
						{VALIDITY_DATES.map((item) => (
							<li style={{ flex: '0 0 8.8rem' }} key={item.id}>
								<button
									type='button'
									onClick={() => {
										onChange(item.id);
										setShowValidityDates(false);
									}}
									className={cn(
										'h-32 w-full flex-1 rounded border transition-colors flex-justify-center',
										item.id === value
											? 'bg-light-secondary-200 border-light-primary-100 text-light-primary-100'
											: 'text-light-gray-800 border-light-gray-200 hover:btn-hover',
									)}
								>
									{item.title}
								</button>
							</li>
						))}
					</ul>
				)}
			</div>
		</Click>
	);
};

export default ValidityDate;

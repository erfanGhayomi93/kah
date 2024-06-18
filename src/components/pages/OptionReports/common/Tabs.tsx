'use client';

import { Link, usePathname } from '@/navigation';
import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import { useMemo } from 'react';

const Tabs = () => {
	const t = useTranslations();

	const pathName = usePathname();

	const FINANCIAL_TYPE = useMemo<Array<{ id: TOptionReportsTab; route: string }>>(
		() => [
			{
				id: 'freeze_and_unfreeze',
				route: '/option-reports/freeze-and-unfreeze',
			},
			{
				id: 'cash_settlement',
				route: '/option-reports/cash-settlement',
			},
			{
				id: 'physical_settlement',
				route: '/option-reports/physical-settlement',
			},
		],
		[],
	);

	return (
		<div className='gap-24 flex-justify-start'>
			<span className='text-light-gray-500 text-xl font-medium'>{t('option_reports_page.option_reports')}</span>
			<div className='gap-8 flex-justify-start'>
				<div>
					<Link href='/option-reports/freeze-and-unfreeze'>
						<button
							type='button'
							className={clsx(
								'h-40 w-104 rounded !border transition-colors',
								'/option-reports/freeze-and-unfreeze' + '/' === pathName
									? 'no-hover font-medium btn-select'
									: 'border-light-gray-200 text-light-gray-700 hover:btn-hover',
							)}
						>
							{t('option_reports_page.' + 'freeze_and_unfreeze' + '_tab')}
						</button>
					</Link>
				</div>
				<div
					style={{
						minWidth: '16px',
						minHeight: '1px',
					}}
					className='bg-light-gray-200 rotate-90'
				/>
				<ul className='gap-8 flex-justify-start'>
					{FINANCIAL_TYPE.map((type) => {
						if (type.id === 'freeze_and_unfreeze') return null;
						return (
							<li key={type.id}>
								<Link href={type.route}>
									<button
										type='button'
										className={clsx(
											'h-40 w-104 rounded !border transition-colors',
											type.route + '/' === pathName
												? 'no-hover font-medium btn-select'
												: 'border-light-gray-200 text-light-gray-700 hover:btn-hover',
										)}
									>
										{t('option_reports_page.' + type.id + '_tab')}
									</button>
								</Link>
							</li>
						);
					})}
				</ul>
			</div>
		</div>
	);
};

export default Tabs;

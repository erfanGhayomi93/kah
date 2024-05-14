'use client';

import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useMemo } from 'react';

const Tabs = () => {
	const t = useTranslations();

	const pathName = usePathname();

	const FINANCIAL_TYPE = useMemo<Array<{ id: TOptionReportsTab, route: string }>>(() => ([{
		id: 'freeze_and_unfreeze',
		route: '/option-reports/freeze-and-unfreeze'
	},
	{
		id: 'cash_settlement',
		route: '/financial-reports/cash-settlement'
	},
	{
		id: 'physical_settlement',
		route: '/financial-reports/physical-settlement'
	}
	]), []);

	return (
		<div className="flex-justify-start gap-24">
			<span className='text-xl font-medium'>{t('option_reports_page.option_reports')}</span>
			<ul className='flex-justify-start gap-8'>
				{FINANCIAL_TYPE.map((type) => (
					<li key={type.id}>
						<Link href={type.route}>
							<button
								type='button'
								className={clsx(
									'h-40 w-88 rounded !border transition-colors',
									type.route + '/' === pathName
										? 'no-hover font-medium btn-select'
										: 'border-gray-500 text-gray-900 hover:btn-hover',
								)}
							>
								{t('option_reports_page.' + type.id + '_tab')}
							</button>
						</Link>
					</li>
				))}
			</ul>
		</div>
	);
};

export default Tabs;

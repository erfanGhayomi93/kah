'use client';

import { Link, usePathname } from '@/navigation';
import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import { useMemo } from 'react';

const Tabs = () => {
	const t = useTranslations();

	const pathName = usePathname();

	const FINANCIAL_TYPE = useMemo<Array<{ id: TFinancialReportsTab; route: string }>>(
		() => [
			{
				id: 'transaction',
				route: '/financial-reports/transactions',
			},
			{
				id: 'deposit_online',
				route: '/financial-reports/instant-deposit',
			},
			{
				id: 'deposit_offline',
				route: '/financial-reports/deposit-with-receipt',
			},
			{
				id: 'withdrawal_cash',
				route: '/financial-reports/withdrawal-cash',
			},
		],
		[],
	);

	return (
		<div className='gap-24 flex-justify-start'>
			<span className='text-light-gray-500 text-xl font-medium'>
				{t('financial_reports_page.financial_reports')}
			</span>
			<ul className='gap-8 flex-justify-start'>
				{FINANCIAL_TYPE.map((type) => (
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
								{t('financial_reports_page.' + type.id + '_tab')}
							</button>
						</Link>
					</li>
				))}
			</ul>
		</div>
	);
};

export default Tabs;

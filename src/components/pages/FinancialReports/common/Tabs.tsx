'use client';

import { Link } from '@/navigation';
import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import { usePathname } from 'next/navigation';
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
			<span className='text-xl font-medium'>{t('financial_reports_page.financial_reports')}</span>
			<ul className='gap-8 flex-justify-start'>
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

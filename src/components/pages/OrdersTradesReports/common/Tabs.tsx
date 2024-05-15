'use client';

import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useMemo } from 'react';

const Tabs = () => {
	const t = useTranslations();

	const pathName = usePathname();

	const FINANCIAL_TYPE = useMemo<Array<{ id: TOrdersTradersTab, route: string }>>(() => ([{
		id: 'orders',
		route: '/orders-and-trades-reports/orders'
	},
	{
		id: 'trades',
		route: '/orders-and-trades-reports/trades'
	},
	]), []);

	return (
		<div className="flex-justify-start gap-24">
			<span className='text-xl font-medium'>{t('orders_and_trades_reports_page.orders_and_trades_reports')}</span>
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
								{t('orders_and_trades_reports_page.' + type.id + '_tab')}
							</button>
						</Link>
					</li>
				))}
			</ul>
		</div>
	);
};

export default Tabs;

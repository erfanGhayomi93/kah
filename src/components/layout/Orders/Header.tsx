import { useBrokerOrdersCountQuery } from '@/api/queries/brokerPrivateQueries';
import { ArrowUpSVG } from '@/components/icons';
import { useAppDispatch, useAppSelector } from '@/features/hooks';
import { getOrdersIsExpand, toggleOrdersIsExpand } from '@/features/slices/uiSlice';
import { cn } from '@/utils/helpers';
import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import { useMemo } from 'react';

interface HeaderProps {
	tab: TOrdersTab;
	setTab: (tav: TOrdersTab) => void;
}

const Header = ({ tab, setTab }: HeaderProps) => {
	const t = useTranslations();

	const dispatch = useAppDispatch();

	const ordersIsExpand = useAppSelector(getOrdersIsExpand);

	const { data: ordersCount } = useBrokerOrdersCountQuery({
		queryKey: ['brokerOrdersCountQuery'],
	});

	const tabs = useMemo<Array<{ id: TOrdersTab; title: string; count: number }>>(
		() => [
			{
				id: 'open_orders',
				title: t('orders.open_orders'),
				count: ordersCount?.openOrderCnt ?? 0,
			},
			{
				id: 'today_orders',
				title: t('orders.today_orders'),
				count: ordersCount?.todayOrderCnt ?? 0,
			},
			{
				id: 'executed_orders',
				title: t('orders.executed_orders'),
				count: ordersCount?.executedOrderCnt ?? 0,
			},
			{
				id: 'draft',
				title: t('orders.draft'),
				count: ordersCount?.orderDraftCnt ?? 0,
			},
			{
				id: 'option_orders',
				title: t('orders.option_orders'),
				count: ordersCount?.orderOptionCount ?? 0,
			},
		],
		[ordersCount],
	);

	const toggle = () => {
		dispatch(toggleOrdersIsExpand());
	};

	return (
		<div className='h-56 bg-white px-8 flex-justify-between'>
			<ul className='flex-1 flex-justify-start'>
				{tabs.map((order, index) => (
					<li key={index}>
						<button
							onClick={() => setTab(order.id)}
							type='button'
							className={cn(
								'h-40 gap-10 rounded px-12 transition-colors flex-justify-center',
								tab === order.id ? 'bg-secondary-100 text-gray-1000' : 'text-gray-700',
							)}
						>
							{order.title}
							<span
								className={clsx(
									'h-22 min-w-22 rounded-oval text-tiny transition-colors flex-justify-center',
									tab === order.id ? 'bg-primary-400 text-white' : 'bg-gray-400 text-gray-700',
								)}
							>
								{order.count}
							</span>
						</button>
					</li>
				))}
			</ul>

			<ul className='flex-justify-end'>
				<li>
					<button onClick={toggle} className='py-12 pl-8 pr-48 flex-justify-end' type='button'>
						<span
							style={{ transform: `rotate(${ordersIsExpand ? 180 : 0}deg)` }}
							className='size-24 text-gray-900 transition-transform flex-justify-center'
						>
							<ArrowUpSVG width='1.6rem' height='1.6rem' />
						</span>
					</button>
				</li>
			</ul>
		</div>
	);
};

export default Header;

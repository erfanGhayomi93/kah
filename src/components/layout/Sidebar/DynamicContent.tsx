import {
	ChangeBrokerSVG,
	CoinsSVG,
	DataAnalyticsSVG,
	HomeSVG,
	LearnSVG,
	MarketMapSVG,
	OptionChainSVG,
	PayOffSVG,
	ReceptionSVG,
	ReportSVG,
	SaturnSVG,
	SnowFlakeSVG,
	StrategySVG,
	TradeSVG,
	TransferSVG,
	WatchlistSVG,
} from '@/components/icons';
import { cn } from '@/utils/helpers';
import { useTranslations } from 'next-intl';
import { useMemo, useState } from 'react';
import Item, { type TListItem } from './Item';
import styles from './Sidebar.module.scss';

interface DynamicContentProps {
	isExpand: boolean;
}

const DynamicContent = ({ isExpand }: DynamicContentProps) => {
	const t = useTranslations();

	const [expandId, setExpandId] = useState<null | string>('market');

	const toggleItem = (id: string) => {
		setExpandId(expandId === id ? null : id);
	};

	const items: [TListItem[], TListItem[]] = useMemo(
		() => [
			[
				{
					id: 'home_page',
					label: t('sidebar.home_page'),
					to: '/',
					icon: <HomeSVG />,
				},
				{
					id: 'my_assets',
					label: t('sidebar.my_assets'),
					to: '/',
					icon: <CoinsSVG />,
				},
				{
					id: 'market',
					label: t('sidebar.market'),
					icon: <TradeSVG />,
					items: [
						{
							id: 'watchlist',
							label: t('sidebar.watchlist'),
							to: '/watchlist',
							icon: <WatchlistSVG />,
						},
						{
							id: 'option_chain',
							label: t('sidebar.option_chain'),
							to: '/option-chain',
							icon: <OptionChainSVG />,
						},
						{
							id: 'saturn',
							label: t('sidebar.saturn'),
							to: '/saturn',
							icon: <SaturnSVG />,
						},
						{
							id: 'market_map',
							label: t('sidebar.market_map'),
							to: '/market-map',
							icon: <MarketMapSVG />,
						},
					],
				},
				{
					id: 'strategy',
					label: t('sidebar.strategy'),
					to: '/',
					icon: <StrategySVG />,
				},
				{
					id: 'technical',
					label: t('sidebar.technical'),
					to: '/',
					icon: <DataAnalyticsSVG />,
				},
				{
					id: 'requests',
					label: t('sidebar.requests'),
					icon: <ReceptionSVG />,
					items: [
						{
							id: 'deposit_and_withdrawal',
							label: t('sidebar.deposit_and_withdrawal'),
							to: '/',
							icon: <TransferSVG />,
						},
						{
							id: 'change_broker',
							label: t('sidebar.change_broker'),
							to: '/option-chain',
							icon: <ChangeBrokerSVG />,
						},
						{
							id: 'un_freezing',
							label: t('sidebar.un_freezing'),
							to: '/saturn',
							icon: <SnowFlakeSVG />,
						},
						{
							id: 'option_settlement',
							label: t('sidebar.option_settlement'),
							to: '/market-map',
							icon: <PayOffSVG />,
						},
					],
				},
				{
					id: 'reports',
					label: t('sidebar.reports'),
					to: '/',
					icon: <ReportSVG />,
				},
			],
			[
				{
					id: 'learn',
					label: t('sidebar.learn'),
					to: '/',
					icon: <LearnSVG />,
				},
			],
		],
		[expandId],
	);

	return (
		<div className='flex-1 flex-column'>
			<nav className='h-full flex-1 justify-between gap-16 py-32 flex-column'>
				{items.map((list, i) => (
					<ul key={i} className={cn(styles.list, isExpand && styles.expand)}>
						{list.map((item) => (
							<Item
								key={item.id}
								isExpand={item.id === expandId}
								toggle={() => toggleItem(item.id)}
								sidebarIsExpand={isExpand}
								{...item}
							/>
						))}
					</ul>
				))}
			</nav>
		</div>
	);
};

export default DynamicContent;

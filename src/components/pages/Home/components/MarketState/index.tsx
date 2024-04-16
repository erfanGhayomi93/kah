import { useGetMarketStateQuery } from '@/api/queries/dashboardQueries';
import Loading from '@/components/common/Loading';
import { useServerDatetime } from '@/hooks';
import dayjs from '@/libs/dayjs';
import { numFormatter } from '@/utils/helpers';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import Section from '../../common/Section';

interface ItemProps {
	name: string;
	value: number;
}

const MarketState = () => {
	const t = useTranslations();

	const [exchange, setExchange] = useState<Dashboard.TMarketStateExchange>('Option');

	const { data, isLoading } = useGetMarketStateQuery({
		queryKey: ['getMarketStateQuery', exchange],
	});

	return (
		<Section<string, Dashboard.TMarketStateExchange>
			id='market_state'
			title={t('home.market_state')}
			onBottomTabChange={setExchange}
			tabs={{
				bottom: [
					{ id: 'Option', title: t('home.tab_option') },
					{ id: 'Bourse', title: t('home.tab_bourse') },
					{ id: 'FaraBourse', title: t('home.tab_fara_bourse') },
				],
				top: <Clock />,
			}}
		>
			<div className='relative flex-1 pt-24'>
				{isLoading && <Loading />}

				{data && (
					<ul className='gap-24 rtl flex-column'>
						<Item name={t('home.tab_trades_volume')} value={data.tradeVolume ?? 0} />
						<Item name={t('home.tab_trades_value')} value={data.tradeValue ?? 0} />
						{'putValue' in data ? (
							<>
								<Item name={t('home.call_trades_value')} value={data.callValue ?? 0} />
								<Item name={t('home.put_trades_value')} value={data.putValue ?? 0} />
							</>
						) : (
							<>
								<Item
									name={t(`home.${exchange === 'Bourse' ? '' : 'fara_'}bourse_market_value`)}
									value={data.marketValue ?? 0}
								/>
								<Item name={t('home.tab_trades_count')} value={data.tradeCount ?? 0} />
							</>
						)}
					</ul>
				)}
			</div>
		</Section>
	);
};

const Clock = () => {
	const { timestamp } = useServerDatetime();

	return (
		<div style={{ flex: '0 0 6.8rem' }} className='h-full rounded bg-gray-200 flex-justify-center'>
			{dayjs(timestamp).calendar('jalali').format('HH:mm:ss')}
		</div>
	);
};

const Item = ({ name, value }: ItemProps) => (
	<li className='flex-justify-between'>
		<span className='text-gray-900'>{name}:</span>
		<span className='text-base text-gray-1000'>{isNaN(value) ? '−' : numFormatter(value)}</span>
	</li>
);

export default MarketState;

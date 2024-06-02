import { useGetMarketStateQuery } from '@/api/queries/dashboardQueries';
import Loading from '@/components/common/Loading';
import { useAppDispatch, useAppSelector } from '@/features/hooks';
import { setMarketStateModal } from '@/features/slices/modalSlice';
import { type RootState } from '@/features/store';
import { useServerDatetime } from '@/hooks';
import dayjs from '@/libs/dayjs';
import { numFormatter, toFixed } from '@/utils/helpers';
import { createSelector } from '@reduxjs/toolkit';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import Section from '../../common/Section';

interface ItemProps {
	name: string;
	value: string | number;
}

interface IModalStateProps {
	isModal?: boolean;
}

const getStates = createSelector(
	(state: RootState) => state,
	(state) => ({
		getMarketState: state.modal.marketState,
	}),
);

const MarketState = ({ isModal = false }: IModalStateProps) => {
	const t = useTranslations();

	const dispatch = useAppDispatch();

	const { getMarketState } = useAppSelector(getStates);

	const [exchange, setExchange] = useState<Dashboard.TMarketStateExchange>('Option');

	const { data, isLoading } = useGetMarketStateQuery({
		queryKey: ['getMarketStateQuery', exchange],
	});

	return (
		<Section<string, Dashboard.TMarketStateExchange>
			id='market_state'
			title={t('home.market_state')}
			info={t('tooltip.market_state_section')}
			onBottomTabChange={setExchange}
			onExpand={() => dispatch(setMarketStateModal(getMarketState ? null : {}))}
			tabs={{
				bottom: [
					{ id: 'Option', title: t('home.tab_option') },
					{ id: 'Bourse', title: t('home.tab_bourse') },
					{ id: 'FaraBourse', title: t('home.tab_fara_bourse') },
				],
				top: <Clock />,
			}}
			closeable={!isModal}
			expandable={!isModal}
		>
			{isLoading && <Loading />}

			{data && (
				<ul className='h-full gap-24 pt-16 rtl flex-column'>
					<Item name={t('home.tab_trades_volume')} value={numFormatter(data.tradeVolume ?? 0)} />
					<Item name={t('home.tab_trades_value')} value={numFormatter(data.tradeValue ?? 0)} />
					{'putValue' in data ? (
						<>
							<Item name={t('home.call_trades_value')} value={numFormatter(data.callValue ?? 0)} />
							<Item name={t('home.put_trades_value')} value={numFormatter(data.putValue ?? 0)} />
						</>
					) : (
						<>
							<Item
								name={t(`home.${exchange === 'Bourse' ? '' : 'fara_'}bourse_market_value`)}
								value={toFixed(data.index ?? 0, 2)}
							/>
							<Item name={t('home.tab_trades_count')} value={numFormatter(data.tradeCount ?? 0)} />
						</>
					)}
				</ul>
			)}
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
		<span className='text-base text-gray-1000'>{value}</span>
	</li>
);

export default MarketState;

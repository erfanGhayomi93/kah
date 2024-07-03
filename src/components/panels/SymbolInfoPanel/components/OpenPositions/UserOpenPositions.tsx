import { useOptionOrdersQuery } from '@/api/queries/brokerPrivateQueries';
import { useAppSelector } from '@/features/hooks';
import { getBrokerURLs } from '@/features/slices/brokerSlice';
import { useTranslations } from 'next-intl';
import { useEffect } from 'react';
import NoData from '../../../../common/NoData';
import Loading from '../../common/Loading';
import Position from './Position';

const UserOpenPositions = () => {
	const t = useTranslations();

	const brokerURLs = useAppSelector(getBrokerURLs);

	const {
		data: optionOrdersData,
		refetch: refetchOptionOrdersData,
		isLoading,
	} = useOptionOrdersQuery({
		queryKey: ['optionOrdersQuery'],
		enabled: false,
	});

	useEffect(() => {
		if (!brokerURLs) return;
		refetchOptionOrdersData();
	}, [brokerURLs]);

	if (isLoading) return <Loading />;

	const data = optionOrdersData ?? [];

	if (!isLoading && data.length === 0) return <NoData />;

	return (
		<div className='flex-1 flex-column'>
			<div className='flex text-tiny text-light-gray-700'>
				<div className='h-48 flex-1 flex-justify-center'>{t('symbol_info_panel.symbol_title')}</div>
				<div style={{ flex: '0 0 27.5%' }} className='h-48 flex-justify-center'>
					{t('symbol_info_panel.quantity')}
				</div>
				<div style={{ flex: '0 0 39%' }} className='h-48 flex-justify-center'>
					{t('symbol_info_panel.price')}
				</div>
			</div>

			<ul className='flex-column'>
				{data.map((item) => (
					<Position key={item.symbolISIN} {...item} />
				))}
			</ul>
		</div>
	);
};

export default UserOpenPositions;

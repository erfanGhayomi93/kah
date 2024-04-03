import { useOptionOrdersQuery } from '@/api/queries/brokerPrivateQueries';
import Loading from '@/components/common/Loading';
import { useAppSelector } from '@/features/hooks';
import { getBrokerURLs } from '@/features/slices/brokerSlice';
import { useTranslations } from 'next-intl';
import { useLayoutEffect } from 'react';
import NoData from '../../common/NoData';

const UserOpenPositions = () => {
	const t = useTranslations();

	const brokerURLs = useAppSelector(getBrokerURLs);

	const {
		data: optionOrdersData,
		refetch: refetchOptionOrdersData,
		isFetching,
	} = useOptionOrdersQuery({
		queryKey: ['optionOrdersQuery'],
		enabled: false,
	});

	useLayoutEffect(() => {
		if (!brokerURLs) return;
		refetchOptionOrdersData();
	}, [brokerURLs]);

	if (isFetching)
		return (
			<div className='relative h-full'>
				<Loading />
			</div>
		);

	const data = optionOrdersData ?? [];

	if (!isFetching && data.length === 0) return <NoData />;

	return (
		<div className='flex-1 flex-column'>
			<div className='flex text-tiny text-gray-900'>
				<div className='h-48 flex-1 flex-justify-center'>{t('symbol_info_panel.symbol_title')}</div>
				<div style={{ flex: '0 0 27.5%' }} className='h-48 flex-justify-center'>
					{t('symbol_info_panel.quantity')}
				</div>
				<div style={{ flex: '0 0 39%' }} className='h-48 flex-justify-center'>
					{t('symbol_info_panel.price')}
				</div>
			</div>
		</div>
	);
};

export default UserOpenPositions;

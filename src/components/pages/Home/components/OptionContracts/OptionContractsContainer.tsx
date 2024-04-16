import { useGetOptionContractAdditionalInfoQuery } from '@/api/queries/dashboardQueries';
import Loading from '@/components/common/Loading';
import { numFormatter } from '@/utils/helpers';
import { useTranslations } from 'next-intl';
import dynamic from 'next/dynamic';
import { useMemo } from 'react';
import Suspend from '../../common/Suspend';

const OptionContractsChart = dynamic(() => import('./OptionContractsChart'), {
	loading: () => <Loading />,
});

interface OptionContractsContainerProps {
	basis: Dashboard.GetOptionContractAdditionalInfo.Basis;
	type: Dashboard.GetOptionContractAdditionalInfo.Type;
}

const OptionContractsContainer = ({ basis, type }: OptionContractsContainerProps) => {
	const t = useTranslations();

	const { data, isLoading } = useGetOptionContractAdditionalInfoQuery({
		queryKey: ['getOptionContractAdditionalInfoQuery', type],
	});

	const dataMapper = useMemo(() => {
		if (!Array.isArray(data)) return [];

		try {
			const fieldName = basis === 'Value' ? 'tradeValue' : 'tradeVolume';

			if (type === 'IOTM')
				return [
					{
						title: t('home.atm'),
						value: numFormatter(data[0]?.[fieldName] ?? 0),
					},
					{
						title: t('home.itm'),
						value: numFormatter(data[1]?.[fieldName] ?? 0),
					},
					{
						title: t('home.otm'),
						value: numFormatter(data[2]?.[fieldName] ?? 0),
					},
				];

			return [
				{
					title: t('home.call_contracts'),
					value: numFormatter(data[0]?.[fieldName] ?? 0),
				},
				{
					title: t('home.put_contracts'),
					value: numFormatter(data[1]?.[fieldName] ?? 0),
				},
			];
		} catch (e) {
			return [];
		}
	}, [data, basis, type]);

	return (
		<div className='relative flex flex-1 px-8 pt-36'>
			<OptionContractsChart type={type} basis={basis} data={data} />

			<ul className='flex-1 justify-center gap-32 rtl flex-column'>
				{dataMapper.map((item, i) => (
					<li key={i} className='text-base flex-justify-between'>
						<span className='text-gray-900'>{item.title}:</span>
						<span className='text-gray-1000'>{item.value}</span>
					</li>
				))}
			</ul>

			<Suspend isLoading={isLoading} />
		</div>
	);
};

export default OptionContractsContainer;

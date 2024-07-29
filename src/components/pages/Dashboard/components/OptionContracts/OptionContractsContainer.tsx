import { useGetOptionContractAdditionalInfoQuery } from '@/api/queries/dashboardQueries';
import NoData from '@/components/common/NoData';
import { numFormatter, toFixed } from '@/utils/helpers';
import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import dynamic from 'next/dynamic';
import { useMemo } from 'react';
import Suspend from '../../common/Suspend';

const OptionContractsChart = dynamic(() => import('./OptionContractsChart'));

interface OptionContractsContainerProps {
	basis: Dashboard.GetOptionContractAdditionalInfo.Basis;
	type: Dashboard.GetOptionContractAdditionalInfo.Type;
	isModal?: boolean;
}

const OptionContractsContainer = ({ basis, type, isModal }: OptionContractsContainerProps) => {
	const t = useTranslations();

	const { data, isLoading } = useGetOptionContractAdditionalInfoQuery({
		queryKey: ['getOptionContractAdditionalInfoQuery', type],
	});

	const [dataMapper, sum] = useMemo(() => {
		try {
			if (!Array.isArray(data)) throw new Error();

			const fieldName = basis === 'Value' ? 'tradeValue' : 'tradeVolume';
			const percentFieldName = basis === 'Value' ? 'valuePercentageOfTotal' : 'volumePercentageOfTotal';

			const sum = (data[0]?.[fieldName] ?? 0) + (data[1]?.[fieldName] ?? 0) + (data[2]?.[fieldName] ?? 0);

			if (type === 'IOTM') {
				return [
					[
						{
							id: 'atm',
							title: t('home.atm'),
							value: numFormatter(data[0]?.[fieldName] ?? 0),
							percent: toFixed((data[0]?.[percentFieldName] ?? 0) * 100),
						},
						{
							id: 'itm',
							title: t('home.itm'),
							value: numFormatter(data[1]?.[fieldName] ?? 0),
							percent: toFixed((data[1]?.[percentFieldName] ?? 0) * 100),
						},
						{
							id: 'otm',
							title: t('home.otm'),
							value: numFormatter(data[2]?.[fieldName] ?? 0),
							percent: toFixed((data[2]?.[percentFieldName] ?? 0) * 100),
						},
					],
					sum,
				];
			}

			return [
				[
					{
						id: 'call',
						title: t('home.call_contracts'),
						value: numFormatter(data[0]?.[fieldName] ?? 0),
						percent: toFixed((data[0]?.[percentFieldName] ?? 0) * 100),
					},
					{
						id: 'put',
						title: t('home.put_contracts'),
						value: numFormatter(data[1]?.[fieldName] ?? 0),
						percent: toFixed((data[1]?.[percentFieldName] ?? 0) * 100),
					},
				],
				sum,
			];
		} catch (e) {
			return [[], 0];
		}
	}, [basis, data]);

	if (sum === 0) return <NoData />;

	return (
		<div style={isModal ? { minHeight: '30rem' } : {}} className='relative flex size-full  px-8 ltr'>
			<OptionContractsChart type={type} basis={basis} data={data} />

			<ul className=' flex-1 justify-center gap-32 rtl flex-column'>
				{dataMapper.map((item, i) => (
					<li key={i} className={clsx('text-base flex-justify-between')}>
						<span className='text-gray-700'>{item.title}:</span>
						<div className='text-gray-800 flex gap-8 ltr'>
							{item.value}
							<span>{item.percent}%</span>
						</div>
					</li>
				))}
			</ul>

			<Suspend isLoading={isLoading} />
		</div>
	);
};

export default OptionContractsContainer;

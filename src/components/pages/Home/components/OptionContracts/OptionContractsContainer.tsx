import { useGetOptionContractAdditionalInfoQuery } from '@/api/queries/dashboardQueries';
import Loading from '@/components/common/Loading';
import { numFormatter, toFixed } from '@/utils/helpers';
import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import dynamic from 'next/dynamic';
import { useState } from 'react';
import Suspend from '../../common/Suspend';

const OptionContractsChart = dynamic(() => import('./OptionContractsChart'), {
	loading: () => <Loading />,
});

interface IData {
	id: Dashboard.GetOptionContractAdditionalInfo.DataPoint;
	title: string;
	value: string;
	percent: string;
}

interface OptionContractsContainerProps {
	basis: Dashboard.GetOptionContractAdditionalInfo.Basis;
	type: Dashboard.GetOptionContractAdditionalInfo.Type;
}

const COLORS: Record<NonNullable<Dashboard.GetOptionContractAdditionalInfo.DataPoint>, string> = {
	atm: 'text-success-100',
	otm: 'text-error-100',
	itm: 'text-info',
	call: 'text-success-100',
	put: 'text-error-100',
};

const OptionContractsContainer = ({ basis, type }: OptionContractsContainerProps) => {
	const t = useTranslations();

	const [dataPointHover, setDataPointHover] = useState<Dashboard.GetOptionContractAdditionalInfo.DataPoint>(null);

	const { data, isLoading } = useGetOptionContractAdditionalInfoQuery({
		queryKey: ['getOptionContractAdditionalInfoQuery', type],
	});

	const dataMapper = (): IData[] => {
		if (!Array.isArray(data)) return [];

		try {
			const fieldName = basis === 'Value' ? 'tradeValue' : 'tradeVolume';
			const percentFieldName = basis === 'Value' ? 'valuePercentageOfTotal' : 'volumePercentageOfTotal';

			if (type === 'IOTM')
				return [
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
				];

			return [
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
			];
		} catch (e) {
			return [];
		}
	};

	return (
		<div className='relative flex h-full px-8'>
			<OptionContractsChart
				type={type}
				basis={basis}
				data={data}
				setDataPointHover={(v) => setDataPointHover(v)}
			/>

			<ul className='flex-1 justify-center gap-32 rtl flex-column'>
				{dataMapper().map((item, i) => (
					<li
						key={i}
						className={clsx(
							'text-base flex-justify-between',
							item.id === dataPointHover ? 'font-medium' : 'font-normal',
						)}
					>
						<span className='text-gray-900'>{item.title}:</span>
						<div className='flex gap-8 text-gray-1000'>
							<span className={item.id && item.id === dataPointHover ? COLORS[item.id] : ''}>
								{item.percent}%
							</span>
							{item.value}
						</div>
					</li>
				))}
			</ul>

			<Suspend isLoading={isLoading} />
		</div>
	);
};

export default OptionContractsContainer;

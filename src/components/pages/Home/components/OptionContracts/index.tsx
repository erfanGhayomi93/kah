import { useGetOptionContractAdditionalInfoQuery } from '@/api/queries/dashboardQueries';
import Loading from '@/components/common/Loading';
import { numFormatter } from '@/utils/helpers';
import { useTranslations } from 'next-intl';
import { useMemo, useState } from 'react';
import Section from '../../common/Section';
import PieChart from './PieChart';

interface DefaultActiveTab {
	top: Dashboard.GetOptionContractAdditionalInfo.Basis;
	bottom: Dashboard.GetOptionContractAdditionalInfo.Type;
}

const OptionContracts = () => {
	const t = useTranslations();

	const [defaultTab, setDefaultTab] = useState<DefaultActiveTab>({
		top: 'Volume',
		bottom: 'ContractType',
	});

	const { data, isFetching } = useGetOptionContractAdditionalInfoQuery({
		queryKey: ['getOptionContractAdditionalInfoQuery', defaultTab.bottom],
	});

	const setDefaultTabByPosition = <T extends keyof DefaultActiveTab>(position: T, value: DefaultActiveTab[T]) => {
		setDefaultTab((prev) => ({
			...prev,
			[position]: value,
		}));
	};

	const dataMapper = useMemo(() => {
		if (!Array.isArray(data)) return [];

		try {
			const fieldName = defaultTab.top === 'Value' ? 'tradeValue' : 'tradeVolume';

			if (defaultTab.bottom === 'IOTM')
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
	}, [data, defaultTab.bottom]);

	return (
		<Section<DefaultActiveTab['top'], DefaultActiveTab['bottom']>
			id='option_contracts'
			title={t('home.option_contracts')}
			defaultTopActiveTab={defaultTab.top}
			defaultBottomActiveTab={defaultTab.bottom}
			onTopTabChange={(v) => setDefaultTabByPosition('top', v)}
			onBottomTabChange={(v) => setDefaultTabByPosition('bottom', v)}
			tabs={{
				top: [
					{ id: 'Volume', title: t('home.tab_volume') },
					{ id: 'Value', title: t('home.tab_value') },
				],
				bottom: [
					{ id: 'ContractType', title: t('home.tab_contract_type') },
					{ id: 'IOTM', title: t('home.tab_in_profit') },
				],
			}}
		>
			<div className='flex flex-1 px-8 pt-36'>
				<PieChart type={defaultTab.bottom} basis={defaultTab.top} data={data} />

				{isFetching ? (
					<Loading />
				) : (
					<ul className='flex-1 justify-center gap-32 rtl flex-column'>
						{dataMapper.map((item, i) => (
							<li key={i} className='text-base flex-justify-between'>
								<span className='text-gray-900'>{item.title}:</span>
								<span className='text-gray-1000'>{item.value}</span>
							</li>
						))}
					</ul>
				)}
			</div>
		</Section>
	);
};

export default OptionContracts;

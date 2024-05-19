'use client';
import { useGetAgreements } from '@/api/queries/brokerPrivateQueries';
import Switch from '@/components/common/Inputs/Switch';
import LightweightTable, { type IColDef } from '@/components/common/Tables/LightweightTable';
import { DocSVG } from '@/components/icons';
import { useAppDispatch, useAppSelector } from '@/features/hooks';
import { getBrokerURLs } from '@/features/slices/brokerSlice';
import { setAcceptAgreementModal } from '@/features/slices/modalSlice';
import { dateFormatter } from '@/utils/helpers';
import { useTranslations } from 'next-intl';
import { useEffect, useMemo } from 'react';
import SettingCard from '../../components/SettingCard';

const Agreements = () => {
	const t = useTranslations();

	const dispatch = useAppDispatch();
	const brokerURLs = useAppSelector(getBrokerURLs);

	const { data: agreements, refetch: getAgreements } = useGetAgreements({
		queryKey: ['getAgreements'],
		enabled: false,
	});

	useEffect(() => {
		brokerURLs && getAgreements();
	}, [brokerURLs]);

	const columnDef = useMemo<Array<IColDef<Settings.IAgreements>>>(
		() => [
			{
				headerName: t('settings_page.agreement_title'),
				cellClass: 'text-primary',
				valueFormatter: ({ title }) => (
					<div className='gap-8 px-12 text-base text-gray-1000 flex-justify-start'>
						<span className='text-gray-900'>
							<DocSVG />
						</span>
						{title}
					</div>
				),
			},
			{
				headerName: t('settings_page.status'),
				valueFormatter: ({ state }) => {
					if (state) {
						return <span className='text-base'>{t(`settings_page.${state}`)}</span>;
					} else return <span className='text-base'>{state}</span>;
				},
				headerClass: 'w-1/6',
				cellClass: ({ state }) =>
					`w-1/6 ${
						state === 'Accepted'
							? 'text-success-100'
							: state === 'NotAccepted'
								? 'text-error-200'
								: 'text-warning-100'
					}`,
			},
			{
				headerName: t('settings_page.accept_reject_date'),
				cellClass: 'w-1/6',
				headerClass: 'w-1/6',
				valueFormatter: ({ changeDate }) =>
					changeDate !== '0001-01-01T00:00:00' ? (
						<span className='text-base'>{dateFormatter(changeDate, 'date')}</span>
					) : (
						'-'
					),
			},
			{
				headerName: t('settings_page.action'),
				valueFormatter: (data) => (
					<div className='flex-justify-center'>
						<Switch
							checked={data?.state === 'Accepted'}
							onChange={() => dispatch(setAcceptAgreementModal({ data, getAgreements }))}
						/>
					</div>
				),
				cellClass: 'w-1/6',
				headerClass: 'w-1/6',
			},
		],
		[],
	);

	return (
		<SettingCard title={t('settings_page.agreements_settings')} className='h-2/3'>
			<div className='h-full bg-white'>
				<LightweightTable<Settings.IAgreements[]> columnDefs={columnDef} rowData={agreements ?? []} />
			</div>
		</SettingCard>
	);
};

export default Agreements;

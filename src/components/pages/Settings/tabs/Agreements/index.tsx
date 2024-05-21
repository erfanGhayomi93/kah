'use client';
import { useGetAgreements } from '@/api/queries/brokerPrivateQueries';
import ipcMain from '@/classes/IpcMain';
import Switch from '@/components/common/Inputs/Switch';
import Loading from '@/components/common/Loading';
import LightweightTable, { type IColDef } from '@/components/common/Tables/LightweightTable';
import { DocSVG } from '@/components/icons';
import { useAppDispatch, useAppSelector } from '@/features/hooks';
import { getBrokerURLs } from '@/features/slices/brokerSlice';
import { setAcceptAgreementModal } from '@/features/slices/modalSlice';
import { dateFormatter } from '@/utils/helpers';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo } from 'react';
import SettingCard from '../../components/SettingCard';
import NoData from '@/components/common/NoData';

const Agreements = () => {
	const t = useTranslations('settings_page');

	const dispatch = useAppDispatch();
	const brokerURLs = useAppSelector(getBrokerURLs);
	const router = useRouter();

	const {
		data: agreements,
		refetch: getAgreements,
		isFetching: agreementsLoading,
	} = useGetAgreements({
		queryKey: ['getAgreements'],
		enabled: !!brokerURLs,
	});

	const columnDef = useMemo<Array<IColDef<Settings.IAgreements>>>(
		() => [
			{
				headerName: t('agreement_title'),
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
				headerName: t('status'),
				valueFormatter: ({ state }) => <span className='text-base'>{t(`${state}`)}</span>,
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
				headerName: t('accept_reject_date'),
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
				headerName: t('action'),
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

	useEffect(() => {
		ipcMain.handle('broker:logged_out', () => {
			router.push('/settings/general/');
		});
	}, []);

	return (
		<SettingCard title={t('agreements_settings')} className='h-3/5'>
			<div className='bg-white' style={{ height: (agreements?.length || 0) * 40 + 40 }}>
				<LightweightTable<Settings.IAgreements[]> columnDefs={columnDef} rowData={agreements ?? []} />
			</div>
			{!agreements?.length && <NoData/>}
			{agreementsLoading && <Loading />}
		</SettingCard>
	);
};

export default Agreements;

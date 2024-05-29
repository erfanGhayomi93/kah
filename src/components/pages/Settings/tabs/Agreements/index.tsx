'use client';
import { useGetAgreements } from '@/api/queries/brokerPrivateQueries';
import ipcMain from '@/classes/IpcMain';
import Switch from '@/components/common/Inputs/Switch';
import Loading from '@/components/common/Loading';
import NoData from '@/components/common/NoData';
import LightweightTable, { type IColDef } from '@/components/common/Tables/LightweightTable';
import { DocSVG } from '@/components/icons';
import { useAppDispatch, useAppSelector } from '@/features/hooks';
import { getBrokerURLs } from '@/features/slices/brokerSlice';
import { setAcceptAgreementModal } from '@/features/slices/modalSlice';
import { useRouter } from '@/navigation';
import { dateFormatter } from '@/utils/helpers';
import { useTranslations } from 'next-intl';
import { useEffect, useMemo } from 'react';
import SettingCard from '../../components/SettingCard';

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
				colId: 'agreement_title',
				headerName: t('agreement_title'),
				cellClass: 'text-primary',
				valueGetter: (row) => row.title,
				valueFormatter: ({ value }) => (
					<div className='gap-8 px-12 text-base text-gray-1000 flex-justify-start'>
						<span className='text-gray-900'>
							<DocSVG />
						</span>
						{value}
					</div>
				),
			},
			{
				colId: 'status',
				headerName: t('status'),
				valueGetter: (row) => row.state,
				valueFormatter: ({ value }) => <span className='text-base'>{t(`${value}`)}</span>,
				cellClass: ({ state }) =>
					`${
						state === 'Accepted'
							? 'text-success-100'
							: state === 'NotAccepted'
								? 'text-error-200'
								: 'text-warning-100'
					}`,
			},
			{
				colId: 'accept_reject_date',
				headerName: t('accept_reject_date'),
				valueGetter: (row) => row.changeDate,
				valueFormatter: ({ value }) => {
					if (value === '0001-01-01T00:00:00') return '−';
					return <span className='text-base'>{dateFormatter(String(value), 'date')}</span>;
				},
			},
			{
				colId: 'action',
				headerName: t('action'),
				valueGetter: (row) => row.state,
				valueFormatter: ({ row, value }) => (
					<div className='flex-justify-center'>
						<Switch
							checked={value === 'Accepted'}
							onChange={() => dispatch(setAcceptAgreementModal({ data: row, getAgreements }))}
						/>
					</div>
				),
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
			{!agreements?.length && <NoData />}
			{agreementsLoading && <Loading />}
		</SettingCard>
	);
};

export default Agreements;

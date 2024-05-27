'use client';
import Loading from '@/components/common/Loading';
import NoData from '@/components/common/NoData';
import LightweightTable, { type IColDef } from '@/components/common/Tables/LightweightTable';
import { useTranslations } from 'next-intl';
import { useMemo } from 'react';
import SettingCard from '../../components/SettingCard';

const History = () => {
	const t = useTranslations();

	const columnDefs = useMemo<Array<IColDef<unknown>>>(
		() => [
			{
				colId: 'id',
				headerName: '#',
				width: 36,
				valueGetter: () => '',
			},
			{
				colId: 'username',
				headerName: t('settings_page.username'),
				valueGetter: () => '',
			},
			{
				colId: 'system_title',
				headerName: t('settings_page.system_title'),
				valueGetter: () => '',
			},
			{
				colId: 'device_address',
				headerName: t('settings_page.device_address'),
				valueGetter: () => '',
			},
			{
				colId: 'device_type',
				headerName: t('settings_page.device_type'),
				valueGetter: () => '',
			},
			{
				colId: 'status',
				headerName: t('settings_page.status'),
				valueGetter: () => '',
			},
			{
				colId: 'entrance_date',
				headerName: t('settings_page.entrance_date'),
				valueGetter: () => '',
			},
			{
				colId: 'exit_date',
				headerName: t('settings_page.exit_date'),
				valueGetter: () => '',
			},
			{
				colId: 'action',
				headerName: t('settings_page.action'),
				valueGetter: () => '',
			},
		],
		[],
	);

	return (
		<SettingCard title={t('settings_page.history_settings')} className='h-3/5'>
			<div className='bg-white' style={{ height: ([].length || 0) * 40 + 40 }}>
				<LightweightTable columnDefs={columnDefs} rowData={[]} />
			</div>
			{![].length && <NoData />}
			{false && <Loading />}
		</SettingCard>
	);
};

export default History;

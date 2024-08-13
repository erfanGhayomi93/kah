'use client';
import NoData from '@/components/common/NoData';
import LightweightTable, { type IColDef } from '@/components/common/Tables/LightweightTable';
import auth from '@/utils/hoc/auth';
import { useTranslations } from 'next-intl';
import { useMemo } from 'react';
import SettingCard from '../../components/SettingCard';

const Sessions = () => {
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
		<SettingCard title={t('settings_page.sessions_settings')} className='relative h-3/5 overflow-hidden'>
			<LightweightTable reverseColors columnDefs={columnDefs} rowData={[]} />
			<div className='absolute left-0 top-0 size-full'>
				<NoData />
			</div>
		</SettingCard>
	);
};

export default auth(Sessions);

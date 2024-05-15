'use client';
import LightweightTable, { type IColDef } from '@/components/common/Tables/LightweightTable';
import { useTranslations } from 'next-intl';
import { useMemo } from 'react';
import SettingCard from '../../components/SettingCard';

const History = () => {
	const t = useTranslations();

	const columnDefs = useMemo<Array<IColDef<unknown>>>(
		() => [
			{
				headerName: '',
				valueFormatter: () => '',
			},
			{
				headerName: t('settings_page.username'),
				valueFormatter: () => '',
			},
			{
				headerName: t('settings_page.system_title'),
				valueFormatter: () => '',
			},
			{
				headerName: t('settings_page.device_address'),
				valueFormatter: () => '',
			},
			{
				headerName: t('settings_page.device_type'),
				valueFormatter: () => '',
			},
			{
				headerName: t('settings_page.status'),
				valueFormatter: () => '',
			},
			{
				headerName: t('settings_page.entrance_date'),
				valueFormatter: () => '',
			},
			{
				headerName: t('settings_page.exit_date'),
				valueFormatter: () => '',
			},
			{
				headerName: t('settings_page.action'),
				valueFormatter: () => '',
			},
		],
		[],
	);

	return (
		<SettingCard title={t('settings_page.history_settings')} className='h-2/3'>
			<div className='h-full bg-white'>
				<LightweightTable columnDefs={columnDefs} rowData={[]} />
			</div>
		</SettingCard>
	);
};

export default History;

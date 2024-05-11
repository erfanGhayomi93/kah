'use client';
import AgTable from '@/components/common/Tables/AgTable';
import { type ColDef } from '@ag-grid-community/core';
import { useTranslations } from 'next-intl';
import { useMemo } from 'react';
import SettingCard from '../../components/SettingCard';

const History = () => {
	const t = useTranslations();

	const columnDefs = useMemo<Array<ColDef<any>>>(
		() => [
			{
				headerName: '',
				minWidth: 36,
				maxWidth: 36,
				pinned: 'right',
			},
			{
				headerName: t('settings_page.username'),
				flex: 1,
			},
			{
				headerName: t('settings_page.system_title'),
				width: 120,
			},
			{
				headerName: t('settings_page.device_address'),
				width: 120,
			},
			{
				headerName: t('settings_page.device_type'),
				width: 120,
			},
			{
				headerName: t('settings_page.status'),
				width: 80,
			},
			{
				headerName: t('settings_page.entrance_date'),
				width: 120,
			},
			{
				headerName: t('settings_page.exit_date'),
				width: 120,
			},
			{
				headerName: t('settings_page.action'),
				pinned: 'left',
				minWidth: 80,
				maxWidth: 80,
			},
		],
		[],
	);

	return (
		<SettingCard title={t('settings_page.history_settings')} className='h-2/3'>
			<AgTable<any>
				suppressRowClickSelection
				rowHeight={48}
				headerHeight={48}
				columnDefs={columnDefs}
				className='h-full border-0'
			/>
		</SettingCard>
	);
};

export default History;

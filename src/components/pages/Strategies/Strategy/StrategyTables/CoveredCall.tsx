import AgTable from '@/components/common/Tables/AgTable';
import { type ColDef, type GridApi } from '@ag-grid-community/core';
import { useTranslations } from 'next-intl';
import { useMemo, useRef } from 'react';

const CoveredCall = () => {
	const t = useTranslations();

	const gridRef = useRef<GridApi<Strategy.CoveredCall>>(null);

	const columnDefs = useMemo<Array<ColDef<Strategy.CoveredCall>>>(
		() => [
			{
				headerName: 'نماد پایه',
				width: 104,
			},
			{
				headerName: 'قیمت پایه',
				width: 108,
			},
			{
				headerName: 'مانده تا سررسید',
				width: 120,
			},
			{
				headerName: 'قرارداد کال',
				width: 104,
			},
			{
				headerName: 'قیمت اعمال',
				width: 96,
			},
			{
				headerName: 'موقعیت باز',
				width: 96,
			},
			{
				headerName: 'قیمت بهترین خریدار',
				width: 152,
			},
			{
				headerName: 'حجم سرخط خرید',
				width: 152,
			},
			{
				headerName: 'قیمت بهترین فروشنده',
				width: 144,
			},
			{
				headerName: 'حجم سر خط فروش',
				width: 144,
			},
			{
				headerName: 'سر به سر استراتژی',
				width: 136,
			},
			{
				headerName: 'بیشینه سود',
				width: 184,
			},
			{
				headerName: 'سود عدم اعمال',
				width: 184,
			},
			{
				headerName: 'سرمایه درگیر',
				width: 96,
			},
			{
				headerName: 'آخرین قیمت نماد آپشن',
				width: 152,
			},
			{
				headerName: 'اختلاف تا سر به سر',
				width: 136,
			},
			{
				headerName: 'ارزش معاملات آپشن',
				width: 136,
			},
			{
				headerName: 'ارزش معاملات سهم پایه',
				width: 152,
			},
			{
				headerName: 'تعداد معاملات پایه',
				width: 128,
			},
			{
				headerName: 'حجم معاملات پایه',
				width: 120,
			},
			{
				headerName: 'آخرین معامله پایه',
				width: 120,
			},
			{
				headerName: 'YTM سرخط خرید',
				width: 120,
			},
			{
				headerName: 'YTM سرخط فروش',
				width: 152,
			},
			{
				headerName: 'پوشش ریسک',
				width: 152,
			},
			{
				headerName: 'YTM عدم اعمال',
				width: 120,
			},
			{
				headerName: 'عملیات',
				width: 80,
			},
		],
		[],
	);

	const defaultColDef: ColDef<Strategy.CoveredCall> = useMemo(
		() => ({
			suppressMovable: true,
			sortable: true,
			resizable: false,
			minWidth: 96,
		}),
		[],
	);

	return (
		<AgTable<Strategy.CoveredCall>
			ref={gridRef}
			rowData={[]}
			rowHeight={40}
			headerHeight={48}
			columnDefs={columnDefs}
			defaultColDef={defaultColDef}
			className='h-full border-0'
		/>
	);
};

export default CoveredCall;

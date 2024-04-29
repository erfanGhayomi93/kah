import LightweightTable, { type IColDef } from '@/components/common/Tables/LightweightTable';
import { SessionHistorySVG } from '@/components/icons';
import { useTranslations } from 'next-intl';
import { useMemo } from 'react';


interface colTypes {
	time: string,
	price: string,
	status: string,
};

const mockData = [
	{
		time: '4334',
		price: '427428374832',
		status: 'خرید',
	}
];

export const HistoryDeposit = () => {

	const t = useTranslations();

	const columnDefs = useMemo<Array<IColDef<colTypes>>>(() => [
		{
			headerName: t('deposit_modal.time_history'),
			valueFormatter: (row) => row.time,
			headerClass: '!bg-white',
		}, {
			headerName: t('deposit_modal.price_history'),
			valueFormatter: (row) => row.price,
			headerClass: '!bg-white',
		}, {
			headerName: t('deposit_modal.status_history'),
			valueFormatter: (row) => row.status,
			headerClass: '!bg-white',
		}
	], []);


	return (
		<div className="h-full pr-24 flex flex-column">
			<div className="flex-1 rounded-sm shadow-card p-8">
				<LightweightTable
					rowData={mockData}
					columnDefs={columnDefs}
					className="bg-white"
				/>
			</div>

			<button
				className='h-48 text-info rounded w-full font-medium gap-8 flex-justify-center'
				type='button'
			>
				<SessionHistorySVG />

				{t('common.show_more')}

			</button>
		</div>
	);
};

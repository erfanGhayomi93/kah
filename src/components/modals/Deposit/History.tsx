import { useDepositHistoryQuery } from '@/api/queries/requests';
import LightweightTable, { type IColDef } from '@/components/common/Tables/LightweightTable';
import { SessionHistorySVG } from '@/components/icons';
import { dateFormatter, sepNumbers } from '@/utils/helpers';
import { useTranslations } from 'next-intl';
import { useMemo } from 'react';


export const HistoryDeposit = () => {

	const t = useTranslations();

	const { data } = useDepositHistoryQuery({
		queryKey: ['depositHistoryOnline']
	});


	const columnDefs = useMemo<Array<IColDef<Payment.IDepositHistoryList>>>(() => [
		{
			headerName: t('deposit_modal.time_history'),
			valueFormatter: (row) => dateFormatter(row.saveDate),
			headerClass: '!bg-white',
		}, {
			headerName: t('deposit_modal.price_history'),
			valueFormatter: (row) => sepNumbers(String(row.amount)),
			headerClass: '!bg-white',
		}, {
			headerName: t('deposit_modal.status_history'),
			valueFormatter: (row) => t('deposit_modal.' + 'state_' + row.state),
			headerClass: '!bg-white',
			cellClass: '!text-sm'
		}
	], []);


	return (
		<div className="h-full pr-24 flex flex-column">
			<div className="flex-1 rounded-sm shadow-card p-8">
				<LightweightTable
					rowData={data || []}
					columnDefs={columnDefs}
					className="bg-white"
				/>
			</div>

			<button
				className='h-48 text-info rounded w-full font-medium gap-8 flex-justify-center text-'
				type='button'
			>
				<SessionHistorySVG />

				{t('common.show_more')}

			</button>
		</div>
	);
};

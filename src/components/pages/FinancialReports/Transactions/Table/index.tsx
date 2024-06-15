import { useTransactionsReportsQuery } from '@/api/queries/reportsQueries';
import ipcMain from '@/classes/IpcMain';
import Loading from '@/components/common/Loading';
import NoData from '@/components/common/NoData';
import Pagination from '@/components/common/Pagination';
import { sepNumbers } from '@/utils/helpers';
import { useTranslations } from 'next-intl';
import { useLayoutEffect, useMemo } from 'react';
import TransactionsTable from './TransactionsTable';

interface TableProps {
	filters: Transaction.ITransactionsFilters;
	setFieldValue: <K extends keyof Transaction.ITransactionsFilters>(
		name: K,
		value: Transaction.ITransactionsFilters[K],
	) => void;
	setFieldsValue: (props: Partial<Transaction.ITransactionsFilters>) => void;
	columnsVisibility: Transaction.ITransactionColumnsState[];
}

const Table = ({ filters, setFieldValue, setFieldsValue, columnsVisibility }: TableProps) => {
	const t = useTranslations();

	const { data: transactionsReportData, isLoading } = useTransactionsReportsQuery({
		queryKey: ['transactionsReport', filters],
	});

	const onFiltersChanged = (newFilters: Omit<Transaction.ITransactionsFilters, 'pageNumber' | 'pageSize'>) => {
		setFieldsValue(newFilters);
	};

	useLayoutEffect(() => {
		ipcMain.handle('set_transactions_filters', onFiltersChanged);

		return () => {
			ipcMain.removeChannel('set_transactions_filters');
		};
	}, []);

	const { lastTrades, finalRemain, reports } = useMemo(() => {
		const response: Record<'lastTrades' | 'finalRemain', number> & { reports: Reports.ITransactions[] } = {
			lastTrades: 0,
			finalRemain: 0,
			reports: [],
		};

		if (!transactionsReportData?.result) return response;
		const lastData = transactionsReportData.result.splice(-2, 2);

		if (lastData[0]) response.lastTrades = Number(lastData[0].remaining) ?? 0;
		if (lastData[1]) response.finalRemain = Number(lastData[1].remaining) ?? 0;
		response.reports = transactionsReportData.result;

		return response;
	}, [transactionsReportData]);

	const dataIsEmpty = reports.length === 0;

	return (
		<>
			<div
				className='overflow-hidden rounded border border-b-light-gray-200 flex-column'
				style={{
					height: 'calc(100dvh - 23.2rem)',
					transition: 'height 250ms ease',
				}}
			>
				<TransactionsTable columnsVisibility={columnsVisibility} reports={reports} />
			</div>

			<div className='py-22 flex-justify-between'>
				<div className='gap-40 text-base flex-justify-start'>
					<div className='gap-8 flex-justify-start'>
						<span className='font-medium text-light-gray-700'>{t('transactions_page.final_remain')}: </span>
						<div className='gap-4 flex-justify-start'>
							<span className='font-medium text-light-gray-800'>{`\u200E ${sepNumbers(String(finalRemain))}`}</span>
							<span className=' text-light-gray-500'>{t('common.rial')}</span>
						</div>
					</div>
					<div style={{ minWidth: '1px', minHeight: '16px' }} className='bg-light-gray-500' />
					<div className='gap-8 flex-justify-start'>
						<span className='font-medium text-light-gray-700'>{t('transactions_page.last_remain')}: </span>
						<div className='gap-4 flex-justify-start'>
							<span className='font-medium text-light-gray-800'>{`\u200E ${sepNumbers(String(lastTrades))}`}</span>
							<span className=' text-light-gray-500'>{t('common.rial')}</span>
						</div>
					</div>
				</div>

				<Pagination
					hasNextPage={transactionsReportData?.hasNextPage ?? false}
					hasPreviousPage={transactionsReportData?.hasPreviousPage ?? false}
					totalPages={transactionsReportData?.totalPages ?? 0}
					totalCount={transactionsReportData?.totalCount ?? 0}
					currentPage={filters?.pageNumber ?? 1}
					pageSize={filters?.pageSize ?? 0}
					onPageChange={(value) => setFieldValue('pageNumber', value)}
					onPageSizeChange={(value) => setFieldValue('pageSize', value)}
					pageNumber={transactionsReportData?.pageNumber ?? 0}
				/>
			</div>

			{isLoading && (
				<div style={{ backdropFilter: 'blur(1px)' }} className='absolute left-0 top-0 size-full'>
					<Loading />
				</div>
			)}
			{dataIsEmpty && !isLoading && (
				<div className='absolute center'>
					<NoData />
				</div>
			)}
		</>
	);
};

export default Table;

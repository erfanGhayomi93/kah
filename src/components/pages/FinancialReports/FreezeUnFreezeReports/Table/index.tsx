import { useTransactionsReportsQuery } from '@/api/queries/reportsQueries';
import ipcMain from '@/classes/IpcMain';
import Loading from '@/components/common/Loading';
import NoData from '@/components/common/NoData';
import Pagination from '@/components/common/Pagination';
import { sepNumbers } from '@/utils/helpers';
import { useTranslations } from 'next-intl';
import { type Dispatch, type SetStateAction, useLayoutEffect, useMemo } from 'react';
import TransactionsTable from './TransactionsTable';

interface TableProps {
	filters: FreezeUnFreezeReports.IFreezeUnFreezeReportsFilters;
	setFilters: <K extends keyof FreezeUnFreezeReports.IFreezeUnFreezeReportsFilters>(
		name: K,
		value: FreezeUnFreezeReports.IFreezeUnFreezeReportsFilters[K],
	) => void;
	setFieldsValue: (props: Partial<FreezeUnFreezeReports.IFreezeUnFreezeReportsFilters>) => void;
	columnsVisibility: FreezeUnFreezeReports.IFreezeUnFreezeReportsColumnsState[];
	setColumnsVisibility: Dispatch<SetStateAction<FreezeUnFreezeReports.IFreezeUnFreezeReportsColumnsState[]>>;
}

const Table = ({ filters, setFilters, setFieldsValue, columnsVisibility, setColumnsVisibility }: TableProps) => {
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

	const dataIsEmpty = transactionsReportData?.result.length === 0;

	return (
		<>
			<div
				className='overflow-hidden rounded border border-b-gray-500 flex-column'
				style={{
					height: 'calc(100dvh - 23.2rem)',
					transition: 'height 250ms ease',
				}}
			>
				<TransactionsTable
					columnsVisibility={columnsVisibility}
					setColumnsVisibility={setColumnsVisibility}
					reports={reports}
					lastTrades={lastTrades}
					finalRemain={finalRemain}
				/>
			</div>

			<div className='py-22 flex-justify-between'>
				<div className='gap-40 text-base flex-justify-start'>
					<div className='gap-8 flex-justify-start'>
						<span className='font-medium text-gray-900'>
							{t('transactions_reports_page.last_remain')}:{' '}
						</span>
						<div className='gap-4 flex-justify-start'>
							<span className='font-medium text-gray-1000'>{`\u200E ${sepNumbers(String(finalRemain))}`}</span>
							<span className=' text-gray-700'>{t('common.rial')}</span>
						</div>
					</div>
					<div style={{ minWidth: '1px', minHeight: '16px' }} className='bg-gray-700' />
					<div className='gap-8 flex-justify-start'>
						<span className='font-medium text-gray-900'>
							{t('transactions_reports_page.last_remain')}:{' '}
						</span>
						<div className='gap-4 flex-justify-start'>
							<span className='font-medium text-gray-1000'>{`\u200E ${sepNumbers(String(lastTrades))}`}</span>
							<span className=' text-gray-700'>{t('common.rial')}</span>
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
					onPageChange={(value) => setFilters('pageNumber', value)}
					onPageSizeChange={(value) => setFilters('pageSize', value)}
					pageNumber={transactionsReportData?.pageNumber ?? 0}
				/>
			</div>

			{isLoading && (
				<div style={{ backdropFilter: 'blur(1px)' }} className='absolute left-0 top-0 size-full'>
					<Loading />
				</div>
			)}
			{dataIsEmpty && !isLoading && (
				<NoData />
			)}
		</>
	);
};

export default Table;

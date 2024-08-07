import { useTransactionsReportsQuery } from '@/api/queries/reportsQueries';
import ipcMain from '@/classes/IpcMain';
import Loading from '@/components/common/Loading';
import NoData from '@/components/common/NoData';
import Pagination from '@/components/common/Pagination';
import Separator from '@/components/common/Separator';
import { useAppSelector } from '@/features/hooks';
import { getBrokerURLs } from '@/features/slices/brokerSlice';
import { sepNumbers } from '@/utils/helpers';
import { useTranslations } from 'next-intl';
import { useEffect, useMemo } from 'react';
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

	const brokerUrls = useAppSelector(getBrokerURLs);

	const { data: transactionsReportData, isLoading } = useTransactionsReportsQuery({
		queryKey: ['transactionsReport', filters],
		enabled: Boolean(brokerUrls),
	});

	const onFiltersChanged = (newFilters: Omit<Transaction.ITransactionsFilters, 'pageNumber' | 'pageSize'>) => {
		setFieldsValue(newFilters);
	};

	useEffect(() => {
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

		response.lastTrades = transactionsReportData.customerWltRemain;
		response.finalRemain = transactionsReportData.customerLastRemain;
		response.reports = transactionsReportData.result;

		return response;
	}, [transactionsReportData]);

	const dataIsEmpty = reports.length === 0;
	const total = transactionsReportData?.total ?? 0;
	const pageSize = filters.pageSize;
	const pageNumber = filters.pageNumber;
	const totalPages = Math.ceil(total / pageSize);
	const hasNextPage = totalPages > pageNumber;
	const hasPreviousPage = pageNumber > 1;

	return (
		<div className='relative flex-1 overflow-hidden flex-column'>
			<TransactionsTable columnsVisibility={columnsVisibility} reports={reports} />

			<div className='border-t border-t-gray-200 py-16 flex-justify-between'>
				<div className='gap-40 text-base flex-justify-start'>
					<div className='gap-8 flex-justify-start'>
						<span className='font-medium text-gray-700'>{t('transactions_page.final_remain')}: </span>
						<div className='gap-4 flex-justify-start'>
							<span className='font-medium text-gray-800'>{`\u200E ${sepNumbers(String(finalRemain))}`}</span>
							<span className=' text-gray-500'>{t('common.rial')}</span>
						</div>
					</div>

					<Separator />

					<div className='gap-8 flex-justify-start'>
						<span className='font-medium text-gray-700'>{t('transactions_page.last_remain')}: </span>
						<div className='gap-4 flex-justify-start'>
							<span className='font-medium text-gray-800'>{`\u200E ${sepNumbers(String(lastTrades))}`}</span>
							<span className=' text-gray-500'>{t('common.rial')}</span>
						</div>
					</div>
				</div>

				<Pagination
					hasNextPage={hasNextPage}
					hasPreviousPage={hasPreviousPage}
					totalPages={Math.ceil(total / pageSize)}
					totalCount={transactionsReportData?.total ?? 0}
					currentPage={pageNumber ?? 1}
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
		</div>
	);
};

export default Table;

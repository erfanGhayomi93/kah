import { useFreezeUnFreezeReportsQuery } from '@/api/queries/reportsQueries';
import ipcMain from '@/classes/IpcMain';
import Loading from '@/components/common/Loading';
import NoData from '@/components/common/NoData';
import Pagination from '@/components/common/Pagination';
import { useEffect, useMemo } from 'react';
import FreezeUnFreezeReportsTable from './FreezeUnFreezeReportsTable';

interface TableProps {
	filters: FreezeUnFreezeReports.IFreezeUnFreezeReportsFilters;
	setFilters: <K extends keyof FreezeUnFreezeReports.IFreezeUnFreezeReportsFilters>(
		name: K,
		value: FreezeUnFreezeReports.IFreezeUnFreezeReportsFilters[K],
	) => void;
	setFieldsValue: (props: Partial<FreezeUnFreezeReports.IFreezeUnFreezeReportsFilters>) => void;
	columnsVisibility: FreezeUnFreezeReports.IFreezeUnFreezeReportsColumnsState[];
}

const Table = ({ filters, setFilters, setFieldsValue, columnsVisibility }: TableProps) => {
	const { data: freezeUnFreezeReportsData, isLoading } = useFreezeUnFreezeReportsQuery({
		queryKey: ['freezeUnFreezeReports', filters],
	});

	const onFiltersChanged = (
		newFilters: Omit<FreezeUnFreezeReports.IFreezeUnFreezeReportsFilters, 'pageNumber' | 'pageSize'>,
	) => {
		setFieldsValue(newFilters);
	};

	useEffect(() => {
		ipcMain.handle('set_freeze_and_unfreeze_filters', onFiltersChanged);

		return () => {
			ipcMain.removeChannel('set_freeze_and_unfreeze_filters');
		};
	}, []);

	const reports = useMemo(() => {
		if (!freezeUnFreezeReportsData?.result) return [];

		return freezeUnFreezeReportsData?.result;
	}, [freezeUnFreezeReportsData?.result]);

	const dataIsEmpty = reports.length === 0;

	return (
		<div className='relative flex-1 gap-16 overflow-hidden flex-column'>
			<FreezeUnFreezeReportsTable columnsVisibility={columnsVisibility} reports={reports} />

			<div className='border-t border-t-gray-200 py-16 flex-justify-end'>
				<Pagination
					hasNextPage={freezeUnFreezeReportsData?.hasNextPage ?? false}
					hasPreviousPage={freezeUnFreezeReportsData?.hasPreviousPage ?? false}
					totalPages={freezeUnFreezeReportsData?.totalPages ?? 0}
					totalCount={freezeUnFreezeReportsData?.totalCount ?? 0}
					currentPage={filters?.pageNumber ?? 1}
					pageSize={filters?.pageSize ?? 0}
					onPageChange={(value) => setFilters('pageNumber', value)}
					onPageSizeChange={(value) => setFilters('pageSize', value)}
					pageNumber={freezeUnFreezeReportsData?.pageNumber ?? 0}
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

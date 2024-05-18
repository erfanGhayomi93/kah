import { useFreezeUnFreezeReportsQuery } from '@/api/queries/reportsQueries';
import ipcMain from '@/classes/IpcMain';
import Loading from '@/components/common/Loading';
import NoData from '@/components/common/NoData';
import Pagination from '@/components/common/Pagination';
import { type Dispatch, type SetStateAction, useLayoutEffect, useMemo } from 'react';
import FreezeUnFreezeReportsTable from './FreezeUnFreezeReportsTable';

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

	const { data: freezeUnFreezeReportsData, isLoading } = useFreezeUnFreezeReportsQuery({
		queryKey: ['freezeUnFreezeReports', filters],
	});

	const onFiltersChanged = (newFilters: Omit<FreezeUnFreezeReports.IFreezeUnFreezeReportsFilters, 'pageNumber' | 'pageSize'>) => {
		setFieldsValue(newFilters);
	};

	useLayoutEffect(() => {
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
		<>
			<div
				className='overflow-hidden rounded border border-b-gray-500 flex-column'
				style={{
					height: 'calc(100dvh - 23.2rem)',
					transition: 'height 250ms ease',
				}}
			>
				<FreezeUnFreezeReportsTable
					columnsVisibility={columnsVisibility}
					setColumnsVisibility={setColumnsVisibility}
					reports={reports}
				/>
			</div>

			<div className='py-22 flex-justify-end'>
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
		</>
	);
};

export default Table;

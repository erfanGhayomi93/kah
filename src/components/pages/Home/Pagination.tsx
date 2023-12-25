import Dropdown, { type IDropdownItem } from '@/components/common/Dropdown';
import CPagination from '@/components/common/Pagination';
import { ArrowDownSVG } from '@/components/icons';
import { useTranslations } from 'next-intl';
import { useMemo, useState } from 'react';

const Pagination = () => {
	const t = useTranslations();

	const [pageSetting, setPageSetting] = useState<PaginationResponse>({
		result: [],
		pageNumber: 1,
		totalPages: 10,
		totalCount: 250,
		pageSize: 25,
		hasPreviousPage: false,
		hasNextPage: true,
		succeeded: true,
		errors: null,
	});

	const setPageProperty = <T extends keyof PaginationResponse>(field: T, value: PaginationResponse[T]) => {
		setPageSetting((prev) => ({
			...prev,
			[field]: value,
		}));
	};

	const pageSizes = useMemo<IDropdownItem[]>(
		() => [
			{
				id: 25,
				title: '25',
				action: () => setPageProperty('pageSize', 25),
			},
			{
				id: 50,
				title: '50',
				action: () => setPageProperty('pageSize', 50),
			},
			{
				id: 75,
				title: '75',
				action: () => setPageProperty('pageSize', 75),
			},
			{
				id: 100,
				title: '100',
				action: () => setPageProperty('pageSize', 100),
			},
		],
		[],
	);

	return (
		<div className='flex-justify-between'>
			<div className='flex-grow-0'>
				<CPagination
					onPageChange={(value) => setPageProperty('pageNumber', value)}
					onPageSizeChange={(value) => setPageProperty('pageSize', value)}
					hasNextPage={pageSetting.hasNextPage}
					hasPreviousPage={pageSetting.hasPreviousPage}
					totalCount={pageSetting.totalCount}
					totalPages={pageSetting.totalPages}
					pageNumber={pageSetting.pageNumber}
					pageSize={pageSetting.pageSize}
				/>
			</div>

			<div className='flex-grow-0 gap-8 flex-items-center'>
				<span className='font-IRANSansFaNum text-tiny text-gray-100'>
					{t('pagination.page_size', { size: pageSetting.pageSize, total: 100 })}
				</span>
				<Dropdown
					items={pageSizes}
					defaultDropdownWidth={72}
					classes={{
						item: 'font-IRANSansFaNum',
					}}
				>
					<button
						type='button'
						className='h-32 w-48 rounded-sm border border-gray-100 pl-4 font-IRANSansFaNum text-gray-100 flex-items-center'
					>
						<span className='flex-1 text-center'>{pageSetting.pageSize}</span>
						<ArrowDownSVG width='1.2rem' height='1.2rem' />
					</button>
				</Dropdown>
			</div>
		</div>
	);
};

export default Pagination;

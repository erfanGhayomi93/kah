import { DoubleArrowLeftSVG, DoubleArrowRightSVG } from '@/components/icons';
import clsx from 'clsx';
import { useTranslations } from 'next-intl';

interface PaginationProps extends Record<'totalCount' | 'currentPage' | 'pageSize' | 'totalCount' | 'totalPages', number> {
	hasNextPage: boolean;
	hasPreviousPage: boolean;
	onPageChange: (pn: number) => void;
	onPageSizeChange: (ps: number) => void;
}
const Pagination = ({
	onPageChange,
	onPageSizeChange,
	hasNextPage,
	hasPreviousPage,
	totalPages,
	currentPage,
	pageSize,
}: PaginationProps) => {
	const t = useTranslations();

	const onNext = () => {
		onPageChange(currentPage + 1);
	};

	const onPrevious = () => {
		onPageChange(currentPage - 1);
	};

	return (
		<div className='flex w-full items-center justify-between'>
			<ul className='flex items-center gap-8'>
				{[25, 50, 75, 100].map((pSize) => (
					<li key={pSize}>
						<button
							role='button'
							key={pSize}
							onClick={() => onPageSizeChange(pSize)}
							className={clsx(
								'flex h-32 w-32 items-center justify-center rounded text-sm font-medium',
								pSize === Math.max(pageSize, 25)
									? 'dark:bg-dark-gray-400 text-gray-900 bg-gray-400 dark:text-white'
									: 'text-gray-900 bg-transparent dark:text-white',
							)}
						>
							<span>{pSize}</span>
						</button>
					</li>
				))}
			</ul>

			<div className='flex items-center gap-8'>
				<button
					role='button'
					onClick={onNext}
					disabled={!hasNextPage}
					className={clsx(
						'text-gray-700 dark:text-dark-gray-700 disabled:text-gray-500 dark:disabled:text-dark-gray-500 flex h-32 w-32 items-center justify-center rounded border border-current',
					)}
				>
					<DoubleArrowRightSVG width='2rem' height='2rem' />
				</button>

				<div className='text-gray-700 dark:text-dark-gray-700 flex h-32 items-center gap-4 rounded border border-current px-16 text-sm'>
					<span>{t('common.page')}:</span>
					<span className='font-medium'>
						{Math.max(1, totalPages)} / {Math.max(1, currentPage)}
					</span>
				</div>

				<button
					role='button'
					onClick={onPrevious}
					disabled={!hasPreviousPage}
					className={clsx(
						'text-gray-700 dark:text-dark-gray-700 disabled:text-gray-500 dark:disabled:text-dark-gray-500 flex h-32 w-32 items-center justify-center rounded border border-current',
					)}
				>
					<DoubleArrowLeftSVG width='2rem' height='2rem' />
				</button>
			</div>
		</div>
	);
};

export default Pagination;

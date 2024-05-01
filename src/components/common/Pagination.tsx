import { usePagination } from '@/hooks';
import { cn } from '@/utils/helpers';
import { useTranslations } from 'next-intl';
import { DoubleArrowLeftSVG, DoubleArrowRightSVG } from '../icons';
import styles from './Pagination.module.scss';

interface PaginationProps extends Record<'totalCount' | 'pageNumber' | 'pageSize' | 'totalPages', number> {
	siblingCount?: number;
	hasNextPage: boolean;
	hasPreviousPage: boolean;
	onPageChange: (pn: number) => void;
	onPageSizeChange: (ps: number) => void;
	currentPage: number
}
const Pagination = ({
	onPageChange,
	onPageSizeChange,
	hasNextPage,
	hasPreviousPage,
	totalPages,
	...props
}: PaginationProps) => {
	const t = useTranslations();

	const pag = usePagination({
		...props,
		siblingCount: props.siblingCount ?? 1,
	});

	const onNext = () => {
		if (!hasNextPage) return;
		onPageChange(Math.min(totalPages, props.pageNumber + 1));
	};

	const onPrevious = () => {
		if (!hasPreviousPage) return;
		onPageChange(Math.max(props.pageNumber - 1, 1));
	};

	return (
		<ul className={styles.pagination}>
			<li className={styles.prev}>
				<button onClick={onPrevious} disabled={!hasPreviousPage} type='button'>
					<DoubleArrowLeftSVG width='1.6rem' height='1.6rem' />
					{t('pagination.prev_page')}
				</button>
			</li>
			{pag.map((pn) => (
				<li className={cn(styles.page, pn === props.pageNumber && styles.active)} key={pn}>
					<button
						disabled={typeof pn === 'string'}
						onClick={typeof pn === 'string' ? undefined : () => onPageChange(pn)}
						type='button'
					>
						{pn}
					</button>
				</li>
			))}
			<li className={styles.next}>
				<button onClick={onNext} disabled={!hasNextPage} type='button'>
					{t('pagination.next_page')}
					<DoubleArrowRightSVG width='1.6rem' height='1.6rem' />
				</button>
			</li>
		</ul>
	);
};

export default Pagination;

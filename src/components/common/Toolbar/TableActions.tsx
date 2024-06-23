import OptionWatchlistManagerBtn from '@/components/common/Buttons/OptionWatchlistManagerBtn';
import { FilterSVG } from '@/components/icons';
import { useTranslations } from 'next-intl';
import styled from 'styled-components';
import ExportExcelBtn from '../Buttons/ExportExcelBtn';
import Tooltip from '../Tooltip';

interface TableActionsProps {
	filtersCount?: number;
	showExcel?: boolean;
	showFilter?: boolean;
	showColumns?: boolean;
	onExportExcel?: () => void;
	onShowFilters?: () => void;
	onManageColumns?: () => void;
}

const Badge = styled.span`
	width: 2.4rem;
	height: 2.4rem;
	position: absolute;
	border-radius: 50%;
	font-size: 1.4rem;
	padding-top: 0.3rem;
	top: -1.4rem;
	right: -0.8rem;
`;

const TableActions = ({
	filtersCount = 0,
	showColumns = true,
	showExcel = true,
	showFilter = true,
	onExportExcel,
	onShowFilters,
	onManageColumns,
}: TableActionsProps) => {
	const t = useTranslations('tooltip');

	return (
		<div className='flex gap-8'>
			{showExcel && (
				<Tooltip placement='bottom' content={t('export_excel')}>
					<ExportExcelBtn onClick={onExportExcel} />
				</Tooltip>
			)}

			{showFilter && (
				<Tooltip placement='bottom' content={t('filters')}>
					<button
						onClick={onShowFilters}
						className='relative size-40 rounded border border-light-gray-200 text-light-gray-700 transition-colors flex-justify-center hover:border-light-primary-100 hover:bg-light-primary-100 hover:text-white'
						type='button'
					>
						{filtersCount > 0 && <Badge className='bg-light-primary-100 text-white'>{filtersCount}</Badge>}
						<FilterSVG />
					</button>
				</Tooltip>
			)}

			{showColumns && (
				<Tooltip placement='bottom' content={t('manage_columns')}>
					<OptionWatchlistManagerBtn
						onClick={onManageColumns}
						className='size-40 rounded border border-light-gray-200 bg-transparent text-light-gray-700 transition-colors flex-justify-center hover:border-light-primary-100 hover:bg-light-primary-100'
						type='button'
					/>
				</Tooltip>
			)}
		</div>
	);
};

export default TableActions;

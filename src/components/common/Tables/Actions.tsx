import OptionWatchlistManagerBtn from '@/components/common/Buttons/OptionWatchlistManagerBtn';
import { FilterSVG } from '@/components/icons';
import styled from 'styled-components';
import ExportExcelBtn from '../Buttons/ExportExcelBtn';

interface ITableActionsProps {
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

const Actions = ({
	filtersCount,
	onExportExcel,
	onManageColumns,
	onShowFilters,
	showColumns = true,
	showExcel = true,
	showFilter = true,
}: ITableActionsProps) => {
	return (
		<div className='flex gap-8'>
			{showExcel && <ExportExcelBtn onClick={onExportExcel} />}

			{showFilter && (
				<button
					onClick={onShowFilters}
					className='relative size-40 rounded border border-light-gray-200 text-light-gray-700 transition-colors flex-justify-center hover:border-light-primary-100 hover:bg-light-primary-100 hover:text-white'
					type='button'
				>
					{(filtersCount ?? 0) > 0 && (
						<Badge className='bg-light-primary-100 text-white'>{filtersCount}</Badge>
					)}
					<FilterSVG />
				</button>
			)}

			{showColumns && <OptionWatchlistManagerBtn onClick={onManageColumns} />}
		</div>
	);
};

export default Actions;

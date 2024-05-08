import { FilterSVG } from '@/components/icons';
import styled from 'styled-components';

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
	showColumns,
	showExcel,
	showFilter,
}: ITableActionsProps) => {
	return (
		<div className='flex gap-8'>
			{/* {showExcel && (
				<ExcelBtn
					onClick={onExportExcel}
					className='size-40 rounded border border-gray-500 text-gray-900 transition-colors flex-justify-center hover:border-primary-400 hover:bg-primary-400'
					type='button'
				>
					<ExcelSVG />
				</ExcelBtn>
			)} */}

			{showFilter && (
				<button
					onClick={onShowFilters}
					className='relative size-40 rounded border border-gray-500 text-gray-900 transition-colors flex-justify-center hover:border-primary-400 hover:bg-primary-400 hover:text-white'
					type='button'
				>
					{(filtersCount ?? 0) > 0 && <Badge className='bg-primary-300 text-white'>{filtersCount}</Badge>}
					<FilterSVG />
				</button>
			)}

			{/* {showColumns && (
				<OptionWatchlistManagerSVG
					onClick={onManageColumns}
					className='size-40 rounded border border-gray-500 bg-transparent text-gray-900 transition-colors flex-justify-center hover:border-primary-400 hover:bg-primary-400'
					type='button'
				/>
			)} */}
		</div>
	);
};

export default Actions;

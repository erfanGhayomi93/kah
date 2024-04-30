import { ExcelSVG, FilterSVG } from '@/components/icons';
import OptionWatchlistManagerSVG from '@/components/icons/OptionWatchlistManagerSVG';
import styled from 'styled-components';

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

const ExcelBtn = styled.button`
	svg {
		path {
			transition: fill 250ms;
		}

		path:nth-child(1),
		path:nth-child(2) {
			fill: rgb(0, 194, 136);
		}

		path:nth-child(3) {
			fill: rgb(255, 255, 255);
		}
	}

	&:hover svg {
		path:nth-child(1),
		path:nth-child(2) {
			fill: rgb(255, 255, 255);
		}

		path:nth-child(3) {
			fill: rgb(0, 142, 186);
		}
	}
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
	return (
		<div className='flex gap-8'>
			{showExcel && (
				<ExcelBtn
					onClick={onExportExcel}
					className='size-40 rounded border border-gray-500 text-gray-900 transition-colors flex-justify-center hover:border-primary-400 hover:bg-primary-400'
					type='button'
				>
					<ExcelSVG />
				</ExcelBtn>
			)}

			{showFilter && (
				<button
					onClick={onShowFilters}
					className='relative size-40 rounded border border-gray-500 text-gray-900 transition-colors flex-justify-center hover:border-primary-400 hover:bg-primary-400 hover:text-white'
					type='button'
				>
					{filtersCount > 0 && <Badge className='bg-primary-300 text-white'>{filtersCount}</Badge>}
					<FilterSVG />
				</button>
			)}

			{showColumns && (
				<OptionWatchlistManagerSVG
					onClick={onManageColumns}
					className='size-40 rounded border border-gray-500 bg-transparent text-gray-900 transition-colors flex-justify-center hover:border-primary-400 hover:bg-primary-400'
					type='button'
				/>
			)}
		</div>
	);
};

export default TableActions;

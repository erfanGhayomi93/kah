import { ExcelSVG, FilterSVG } from '@/components/icons';
import OptionWatchlistManagerSVG from '@/components/icons/OptionWatchlistManagerSVG';
import { useTranslations } from 'next-intl';
import styled from 'styled-components';
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
	const t = useTranslations('tooltip');

	return (
		<div className='flex gap-8'>
			{showExcel && (
				<Tooltip placement='bottom' content={t('export_excel')}>
					<ExcelBtn
						onClick={onExportExcel}
						className='border-light-gray-200 text-light-gray-700 hover:border-light-primary-100 hover:bg-light-primary-100 size-40 rounded border transition-colors flex-justify-center'
						type='button'
					>
						<ExcelSVG />
					</ExcelBtn>
				</Tooltip>
			)}

			{showFilter && (
				<Tooltip placement='bottom' content={t('filters')}>
					<button
						onClick={onShowFilters}
						className='border-light-gray-200 text-light-gray-700 hover:border-light-primary-100 hover:bg-light-primary-100 relative size-40 rounded border transition-colors flex-justify-center hover:text-white'
						type='button'
					>
						{filtersCount > 0 && <Badge className='bg-light-primary-100 text-white'>{filtersCount}</Badge>}
						<FilterSVG />
					</button>
				</Tooltip>
			)}

			{showColumns && (
				<Tooltip placement='bottom' content={t('manage_columns')}>
					<OptionWatchlistManagerSVG
						onClick={onManageColumns}
						className='border-light-gray-200 text-light-gray-700 hover:border-light-primary-100 hover:bg-light-primary-100 size-40 rounded border bg-transparent transition-colors flex-justify-center'
						type='button'
					/>
				</Tooltip>
			)}
		</div>
	);
};

export default TableActions;

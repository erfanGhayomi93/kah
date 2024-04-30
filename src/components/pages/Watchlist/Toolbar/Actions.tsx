import TableActions from '@/components/common/Toolbar/TableActions';
import { useAppDispatch } from '@/features/hooks';
import { setManageWatchlistColumnsPanel } from '@/features/slices/panelSlice';

interface ActionsProps {
	filtersCount?: number;
	onExportExcel?: () => void;
	onShowFilters?: () => void;
}

const Actions = ({ filtersCount, onShowFilters, onExportExcel }: ActionsProps) => {
	const dispatch = useAppDispatch();

	const manageWatchlistColumns = () => {
		dispatch(setManageWatchlistColumnsPanel(true));
	};

	return (
		<TableActions
			filtersCount={filtersCount}
			onManageColumns={manageWatchlistColumns}
			onShowFilters={onShowFilters}
			onExportExcel={onExportExcel}
		/>
	);
};

export default Actions;

import TableActions from '@/components/common/Toolbar/TableActions';
import { useAppDispatch } from '@/features/hooks';
import { setManageColumnsModal } from '@/features/slices/modalSlice';
import { useOptionWatchlistColumns } from '@/hooks';
import { useTranslations } from 'next-intl';

interface ActionsProps {
	filtersCount?: number;
	onExportExcel?: () => void;
	onShowFilters?: () => void;
}

const Actions = ({ filtersCount, onShowFilters, onExportExcel }: ActionsProps) => {
	const t = useTranslations();

	const dispatch = useAppDispatch();

	const { watchlistColumns, defaultColumns, resetColumnsToDefault, hideGroupColumns } = useOptionWatchlistColumns();

	const covertItemTpManageColumnModel = (item: Option.Column) => ({
		hidden: item.isHidden,
		id: String(item.title),
		title: t(`manage_option_watchlist_columns.column_${item.title}`),
		tag: item.category,
	});

	const manageWatchlistColumns = () => {
		const columns = watchlistColumns.map<IManageColumn>(covertItemTpManageColumnModel);
		const initialColumns = defaultColumns.map<IManageColumn>(covertItemTpManageColumnModel);

		dispatch(
			setManageColumnsModal({
				initialColumns,
				columns,
				title: t('option_page.manage_columns'),
				onColumnChanged: hideGroupColumns, // TODO: Talk to BackEnd - group hidden action
				onReset: () => resetColumnsToDefault(),
			}),
		);
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

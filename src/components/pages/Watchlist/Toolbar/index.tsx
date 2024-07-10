import { type IOptionWatchlistQuery } from '@/api/queries/optionQueries';
import routes from '@/api/routes';
import TableActions from '@/components/common/Toolbar/TableActions';
import { useAppDispatch, useAppSelector } from '@/features/hooks';
import { setManageColumnsModal, setOptionFiltersModal } from '@/features/slices/modalSlice';
import { getOptionWatchlistTabId } from '@/features/slices/tabSlice';
import { type IOptionFiltersModal } from '@/features/slices/types/modalSlice.interfaces';
import { useOptionWatchlistColumns } from '@/hooks';
import { downloadFile } from '@/utils/helpers';
import { useTranslations } from 'next-intl';
import SearchSymbol from './SearchSymbol';
import WatchlistList from './WatchlistList';

interface ToolbarProps {
	filtersCount: number;
	filters: Partial<IOptionWatchlistFilters>;
}

const Toolbar = ({ filters, filtersCount }: ToolbarProps) => {
	const t = useTranslations();

	const dispatch = useAppDispatch();

	const watchlistId = useAppSelector(getOptionWatchlistTabId);

	const { watchlistColumns, defaultColumns, resetColumnsToDefault, hideGroupColumns } = useOptionWatchlistColumns();

	const onShowFilters = () => {
		const params: Partial<IOptionFiltersModal> = {};

		if (filters.symbols) params.initialSymbols = filters.symbols;
		if (filters.type) params.initialType = filters.type;
		if (filters.status) params.initialStatus = filters.status;
		if (filters.dueDays) params.initialDueDays = filters.dueDays;
		if (filters.delta) params.initialDelta = filters.delta;
		if (filters.minimumTradesValue) params.initialMinimumTradesValue = filters.minimumTradesValue;

		dispatch(setOptionFiltersModal(params));
	};

	const onExportExcel = () => {
		try {
			const url =
				watchlistId === -1
					? routes.optionWatchlist.WatchlistExcel
					: routes.optionWatchlist.GetCustomWatchlistExcel;

			const params: Partial<IOptionWatchlistQuery> = {};

			if (filters.minimumTradesValue && Number(filters.minimumTradesValue) >= 0)
				params.MinimumTradeValue = filters.minimumTradesValue;

			if (Array.isArray(filters.symbols) && filters.symbols.length > 0)
				params.BaseSymbolISINs = filters.symbols.map((item) => item.symbolISIN);

			if (Array.isArray(filters.type) && filters.type.length > 0) params.OptionType = filters.type;

			if (Array.isArray(filters.status) && filters.status.length > 0) params.IOTM = filters.status;

			if (filters.dueDays && filters.dueDays[1] >= filters.dueDays[0]) {
				if (filters.dueDays[0] > 0) params.FromDueDays = String(filters.dueDays[0]);
				if (filters.dueDays[1] < 365) params.ToDueDays = String(filters.dueDays[1]);
			}

			if (filters.delta && filters.delta[1] >= filters.delta[0]) {
				if (filters.delta[0] > -1) params.FromDelta = String(filters.delta[0]);
				if (filters.delta[1] < 1) params.ToDelta = String(filters.delta[1]);
			}

			if (watchlistId !== -1) params.Id = String(watchlistId);

			downloadFile(url, 'دیده‌بان کهکشان', params);
		} catch (e) {
			//
		}
	};

	const onPlayed = () => {
		//
	};

	const onPaused = () => {
		//
	};

	const covertItemToManageColumnModel = (item: Option.Column) => ({
		hidden: item.isHidden,
		id: String(item.title),
		title: t(`manage_option_watchlist_columns.column_${item.title}`),
		tag: item.category,
	});

	const manageWatchlistColumns = () => {
		const columns = watchlistColumns.map<IManageColumn>(covertItemToManageColumnModel);
		const initialColumns = defaultColumns.map<IManageColumn>(covertItemToManageColumnModel);

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
		<div className='h-72 gap-48 overflow-hidden flex-justify-between'>
			<div className='gap-8 overflow-hidden flex-items-center'>
				<WatchlistList />
				<SearchSymbol />
			</div>

			<TableActions
				filtersCount={filtersCount}
				onManageColumns={manageWatchlistColumns}
				onShowFilters={onShowFilters}
				onExportExcel={onExportExcel}
			/>
		</div>
	);
};

export default Toolbar;

import { type IOptionWatchlistQuery } from '@/api/queries/optionQueries';
import routes from '@/api/routes';
import { useAppDispatch, useAppSelector } from '@/features/hooks';
import { setOptionFiltersModal } from '@/features/slices/modalSlice';
import { getOptionWatchlistTabId } from '@/features/slices/tabSlice';
import { type IOptionFiltersModal } from '@/features/slices/types/modalSlice.interfaces';
import { useDebounce } from '@/hooks';
import { downloadFile } from '@/utils/helpers';
import { useMemo } from 'react';
import Actions from './Actions';
import SelectSymbol from './SelectSymbol';
import WatchlistList from './WatchlistList';

interface ToolbarProps {
	filters: Partial<IOptionWatchlistFilters>;
}

const Toolbar = ({ filters }: ToolbarProps) => {
	const dispatch = useAppDispatch();

	const watchlistId = useAppSelector(getOptionWatchlistTabId);

	const { setDebounce } = useDebounce();

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
				params.SymbolISINs = filters.symbols.map((item) => item.symbolISIN);

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

	const filtersCount = useMemo(() => {
		let badgeCount = 0;

		if (filters.minimumTradesValue && Number(filters.minimumTradesValue) >= 0) badgeCount++;

		if (Array.isArray(filters.symbols) && filters.symbols.length > 0) badgeCount++;

		if (Array.isArray(filters.type) && filters.type.length > 0) badgeCount++;

		if (Array.isArray(filters.status) && filters.status.length > 0) badgeCount++;

		if (filters.dueDays) {
			if (filters.dueDays[0] > 0) badgeCount++;
			if (filters.dueDays[1] < 365) badgeCount++;
		}

		if (filters.delta) {
			if (filters.delta[0] > -1) badgeCount++;
			if (filters.delta[1] < 1) badgeCount++;
		}

		return badgeCount;
	}, [JSON.stringify(filters ?? {})]);

	return (
		<div className='gap-16 flex-column'>
			<div className='h-40 w-full flex-justify-between'>
				<SelectSymbol />
				<Actions
					filtersCount={filtersCount}
					onShowFilters={onShowFilters}
					onExportExcel={() => setDebounce(onExportExcel, 500)}
				/>
			</div>

			<WatchlistList />
		</div>
	);
};

export default Toolbar;

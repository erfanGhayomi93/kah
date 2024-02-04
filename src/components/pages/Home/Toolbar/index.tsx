import { type IOptionFiltersModal } from '@/@types/slices/modalSlice';
import { useAppDispatch } from '@/features/hooks';
import { toggleOptionFiltersModal } from '@/features/slices/modalSlice';
import { useMemo } from 'react';
import Actions from './Actions';
import SelectSymbol from './SelectSymbol';

interface ToolbarProps {
	filters: Partial<IOptionWatchlistFilters>;
}

const Toolbar = ({ filters }: ToolbarProps) => {
	const dispatch = useAppDispatch();

	const onShowFilters = () => {
		const params: Partial<IOptionFiltersModal> = {};

		if (filters.symbols) params.initialSymbols = filters.symbols;
		if (filters.type) params.initialType = filters.type;
		if (filters.status) params.initialStatus = filters.status;
		if (filters.dueDays) params.initialDueDays = filters.dueDays;
		if (filters.delta) params.initialDelta = filters.delta;
		if (filters.minimumTradesValue) params.initialMinimumTradesValue = filters.minimumTradesValue;

		dispatch(toggleOptionFiltersModal(params));
	};

	const onExportExcel = () => {
		//
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
				<Actions filtersCount={filtersCount} onShowFilters={onShowFilters} onExportExcel={onExportExcel} />
			</div>

			{/* <WatchlistList /> */}
		</div>
	);
};

export default Toolbar;

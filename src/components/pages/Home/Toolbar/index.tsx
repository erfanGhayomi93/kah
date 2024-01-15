import { type IOptionFiltersModal } from '@/@types/slices/modalSlice';
import { useAppDispatch } from '@/features/hooks';
import { toggleOptionFiltersModal } from '@/features/slices/modalSlice';
import Actions from './Actions';
import SymbolSearch from './SymbolSearch';
import WatchlistList from './WatchlistList';

interface ToolbarProps {
	filters: Partial<IOptionWatchlistFilters>;
}

const Toolbar = ({ filters }: ToolbarProps) => {
	const dispatch = useAppDispatch();

	const onShowFilters = () => {
		const params: Partial<IOptionFiltersModal> = {};

		params.initialSymbols = filters.symbols;
		params.initialType = filters.type;
		params.initialStatus = filters.status;
		params.initialEndDate = filters.endDate;
		params.initialContractSize = filters.contractSize;
		params.initialDelta = filters.delta;
		params.initialMinimumTradesValue = filters.minimumTradesValue;

		dispatch(toggleOptionFiltersModal(params));
	};

	const onExportExcel = () => {
		//
	};

	return (
		<div className='gap-16 flex-column'>
			<div className='h-40 w-full flex-justify-between'>
				<SymbolSearch />
				<Actions onShowFilters={onShowFilters} onExportExcel={onExportExcel} />
			</div>

			<WatchlistList />
		</div>
	);
};

export default Toolbar;

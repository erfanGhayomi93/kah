import Actions from './Actions';

const Toolbar = ({ onShowFilters, filtersCount }: { onShowFilters: () => void; filtersCount: number }) => {
	return <Actions showFilter={true} onShowFilters={onShowFilters} filtersCount={filtersCount} />;
};

export default Toolbar;

import Actions from '@/components/common/Tables/Actions';


const Toolbar = ({
	onShowFilters,
	filtersCount,
	onExportExcel,
	onManageColumns,
}: {
	onShowFilters: () => void;
	filtersCount: number;
	onExportExcel: () => void;
	onManageColumns: () => void;
}) => {
	return (
		<Actions
			onExportExcel={onExportExcel}
			onShowFilters={onShowFilters}
			filtersCount={filtersCount}
			onManageColumns={onManageColumns}
		/>
	);
};

export default Toolbar;

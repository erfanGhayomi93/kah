import Loading from '@/components/common/Loading';
import PanelLoading from '@/components/panels/PanelLoading';
import { useAppDispatch, useAppSelector } from '@/features/hooks';
import { getManageWatchlistColumnsPanel, setManageWatchlistColumnsPanel } from '@/features/slices/panelSlice';
import dynamic from 'next/dynamic';

const Panel = dynamic(() => import('../Panel'), {
	ssr: false,
	loading: () => <PanelLoading />,
});

const Container = dynamic(() => import('./Container'), {
	ssr: false,
	loading: () => <Loading />,
});

const ManageWatchlistColumnsPanel = () => {
	const manageWatchlistColumns = useAppSelector(getManageWatchlistColumnsPanel);

	const dispatch = useAppDispatch();

	const onClose = () => {
		dispatch(setManageWatchlistColumnsPanel(false));
	};

	return (
		<Panel
			isEnable={manageWatchlistColumns}
			transparent
			onClose={onClose}
			width='47.2rem'
			render={() => <Container close={onClose} />}
		/>
	);
};

export default ManageWatchlistColumnsPanel;

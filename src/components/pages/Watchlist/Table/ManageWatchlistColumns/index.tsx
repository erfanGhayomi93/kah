import Loading from '@/components/common/Loading';
import Panel from '@/components/common/Panel';
import { useAppDispatch, useAppSelector } from '@/features/hooks';
import { getManageOptionColumns, toggleManageOptionColumns } from '@/features/slices/uiSlice';
import dynamic from 'next/dynamic';

const Container = dynamic(() => import('./Container'), {
	ssr: false,
	loading: () => <Loading />,
});

const ManageWatchlistColumns = () => {
	const dispatch = useAppDispatch();

	const isEnabled = useAppSelector(getManageOptionColumns);

	const onClose = () => {
		dispatch(toggleManageOptionColumns(false));
	};

	return (
		<Panel
			transparent
			isEnable={isEnabled}
			onClose={onClose}
			width='47.2rem'
			render={() => <Container close={onClose} />}
		/>
	);
};

export default ManageWatchlistColumns;

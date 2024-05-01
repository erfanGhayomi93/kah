import Loading from '@/components/common/Loading';
import { useAppDispatch } from '@/features/hooks';
import { setManageTransactionColumnsPanel } from '@/features/slices/panelSlice';
import dynamic from 'next/dynamic';
import { forwardRef } from 'react';
import Panel from '../Panel';

const Container = dynamic(() => import('./Container'), {
	ssr: false,
	loading: () => <Loading />,
});

const ManageTransactionColumnsPanel = forwardRef<HTMLDivElement>((_, ref) => {
	const dispatch = useAppDispatch();

	const onClose = () => {
		dispatch(setManageTransactionColumnsPanel(false));
	};

	return (
		<Panel ref={ref} transparent onClose={onClose} width='47.2rem' render={() => <Container close={onClose} />} />
	);
});

export default ManageTransactionColumnsPanel;

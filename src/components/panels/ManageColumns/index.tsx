import { useAppDispatch } from '@/features/hooks';
import { setManageColumnsPanel } from '@/features/slices/panelSlice';
import { type IManageColumnsModal } from '@/features/slices/types/panelSlice.interfaces';
import { forwardRef } from 'react';
import Panel from '../Panel';
import Columns from './Columns';

interface ManageColumnsProps extends IManageColumnsModal {}

const ManageColumns = forwardRef<HTMLDivElement, ManageColumnsProps>((_, ref) => {
	const dispatch = useAppDispatch();

	const onClose = () => {
		dispatch(setManageColumnsPanel(null));
	};

	return <Panel ref={ref} onClose={onClose} render={() => <Columns close={onClose} />} width='51.2rem' />;
});

export default ManageColumns;

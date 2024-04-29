import { EditFillSVG } from '@/components/icons';
import { useAppDispatch } from '@/features/hooks';
import { setManageDashboardLayoutModal } from '@/features/slices/modalSlice';

const EditLayoutButton = () => {
	const dispatch = useAppDispatch();

	const openDashboardLayoutManager = () => {
		dispatch(setManageDashboardLayoutModal({}));
	};

	return (
		<div style={{ left: '0.8rem', bottom: '4.8rem' }} className='fixed left-8'>
			<button onClick={openDashboardLayoutManager} type='button' className='z-10 size-40 rounded btn-primary'>
				<EditFillSVG width='2rem' height='2rem' />
			</button>
		</div>
	);
};

export default EditLayoutButton;

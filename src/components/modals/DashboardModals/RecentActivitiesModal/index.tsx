import RecentActivities from '@/components/pages/Dashboard/components/RecentActivities';
import { useAppDispatch } from '@/features/hooks';
import { setRecentActivitiesModal } from '@/features/slices/modalSlice';
import { forwardRef } from 'react';
import styled from 'styled-components';
import Modal from '../../Modal';

const Div = styled.div`
	width: 800px;
	// min-height: 500px;
	display: flex;
	flex-direction: column;
`;

interface IRecentActivitiesModalProps extends IBaseModalConfiguration {}

const RecentActivitiesModal = forwardRef<HTMLDivElement, IRecentActivitiesModalProps>((props, ref) => {
	const dispatch = useAppDispatch();

	const onclose = () => {
		dispatch(setRecentActivitiesModal(null));
	};

	return (
		<Modal
			onClose={onclose}
			style={{ modal: { transform: 'translate(-50%, -50%)' } }}
			top='50%'
			{...props}
			ref={ref}
		>
			<Div className='bg-white'>
				<RecentActivities isModal />
			</Div>
		</Modal>
	);
});

export default RecentActivitiesModal;

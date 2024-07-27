import Meetings from '@/components/pages/Dashboard/components/Meetings';
import { useAppDispatch } from '@/features/hooks';
import { setMeetingsModal } from '@/features/slices/modalSlice';
import { forwardRef } from 'react';
import styled from 'styled-components';
import Modal from '../../Modal';

const Div = styled.div`
	width: 800px;
	min-height: 600px;
	display: flex;
	flex-direction: column;
`;

interface IMeetingsModalProps extends IBaseModalConfiguration {}

const MeetingsModal = forwardRef<HTMLDivElement, IMeetingsModalProps>((props, ref) => {
	const dispatch = useAppDispatch();

	const onclose = () => {
		dispatch(setMeetingsModal(null));
	};

	return (
		<Modal
			onClose={onclose}
			style={{ modal: { transform: 'translate(-50%, -50%)' } }}
			top='50%'
			{...props}
			ref={ref}
		>
			<Div className='darkBlue:bg-gray-50 bg-white dark:bg-gray-50'>
				<Meetings isModal />
			</Div>
		</Modal>
	);
});

export default MeetingsModal;

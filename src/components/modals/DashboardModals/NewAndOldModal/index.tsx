import NewAndOld from '@/components/pages/Dashboard/components/NewAndOld';
import { useAppDispatch } from '@/features/hooks';
import { setNewAndOldModal } from '@/features/slices/modalSlice';
import { forwardRef } from 'react';
import styled from 'styled-components';
import Modal from '../../Modal';

const Div = styled.div`
	width: 800px;
	min-height: 600px;
	display: flex;
	flex-direction: column;
`;

interface INewAndOldModalProps extends IBaseModalConfiguration {}

const NewAndOldModal = forwardRef<HTMLDivElement, INewAndOldModalProps>((props, ref) => {
	const dispatch = useAppDispatch();

	const onclose = () => {
		dispatch(setNewAndOldModal(null));
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
				<NewAndOld isModal />
			</Div>
		</Modal>
	);
});

export default NewAndOldModal;

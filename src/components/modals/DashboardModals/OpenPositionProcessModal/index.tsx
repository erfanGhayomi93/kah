import OpenPositionsProcess from '@/components/pages/Dashboard/components/OpenPositionsProcess';
import { useAppDispatch } from '@/features/hooks';
import { setOpenPositionProcessModal } from '@/features/slices/modalSlice';
import { forwardRef } from 'react';
import styled from 'styled-components';
import Modal from '../../Modal';

const Div = styled.div`
	width: 800px;
	min-height: 600px;
	display: flex;
	flex-direction: column;
`;

interface IOpenPositionProcessModalProps extends IBaseModalConfiguration {}

const OpenPositionProcessModal = forwardRef<HTMLDivElement, IOpenPositionProcessModalProps>((props, ref) => {
	const dispatch = useAppDispatch();

	const onclose = () => {
		dispatch(setOpenPositionProcessModal(null));
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
				<OpenPositionsProcess isModal />
			</Div>
		</Modal>
	);
});

export default OpenPositionProcessModal;

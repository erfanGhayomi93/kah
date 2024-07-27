import IndividualAndLegal from '@/components/pages/Dashboard/components/IndividualAndLegal';
import { useAppDispatch } from '@/features/hooks';
import { setIndividualAndLegalModal } from '@/features/slices/modalSlice';
import { forwardRef } from 'react';
import styled from 'styled-components';
import Modal from '../../Modal';

const Div = styled.div`
	width: 800px;
	min-height: 600px;
	display: flex;
	flex-direction: column;
`;

interface IIndividualAndLegalModalProps extends IBaseModalConfiguration {}

const IndividualAndLegalModal = forwardRef<HTMLDivElement, IIndividualAndLegalModalProps>((props, ref) => {
	const dispatch = useAppDispatch();

	const onclose = () => {
		dispatch(setIndividualAndLegalModal(null));
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
				<IndividualAndLegal isModal />
			</Div>
		</Modal>
	);
});

export default IndividualAndLegalModal;

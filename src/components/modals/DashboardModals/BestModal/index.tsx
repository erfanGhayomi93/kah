import Best from '@/components/pages/Dashboard/components/Best';
import { useAppDispatch } from '@/features/hooks';
import { setBestModal } from '@/features/slices/modalSlice';
import { forwardRef } from 'react';
import styled from 'styled-components';
import Modal from '../../Modal';

const Div = styled.div`
	width: 1000px;
	height: 615px;
	display: flex;
	flex-direction: column;
`;

interface IBestModalProps extends IBaseModalConfiguration {}

const BestModal = forwardRef<HTMLDivElement, IBestModalProps>((props, ref) => {
	const dispatch = useAppDispatch();

	const onClose = () => {
		dispatch(setBestModal(null));
	};

	return (
		<Modal
			onClose={onClose}
			style={{
				modal: { transform: 'translate(-50%, -50%)' },
			}}
			top='50%'
			{...props}
			ref={ref}
		>
			<Div className='   darkBlue:bg-gray-50 bg-white dark:bg-gray-50'>
				<Best isModal />
			</Div>
		</Modal>
	);
});

export default BestModal;

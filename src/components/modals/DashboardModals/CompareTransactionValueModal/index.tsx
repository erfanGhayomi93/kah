import CompareTransactionValue from '@/components/pages/Dashboard/components/CompareTransactionValue';
import { useAppDispatch } from '@/features/hooks';
import { setCompareTransactionValueModal } from '@/features/slices/modalSlice';
import { forwardRef } from 'react';
import styled from 'styled-components';
import Modal from '../../Modal';

const Div = styled.div`
	width: 1000px;
	min-height: 615px;
	display: flex;
	flex-direction: column;
`;

interface ICompareTransactionValueModalProps extends IBaseModalConfiguration {}

const CompareTransactionValueModal = forwardRef<HTMLDivElement, ICompareTransactionValueModalProps>((props, ref) => {
	const dispatch = useAppDispatch();

	const onclose = () => {
		dispatch(setCompareTransactionValueModal(null));
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
				<CompareTransactionValue isModal />
			</Div>
		</Modal>
	);
});

export default CompareTransactionValueModal;

import CompareTransactionValue from '@/components/pages/Dashboard/components/CompareTransactionValue';
import { useAppDispatch } from '@/features/hooks';
import { setCompareTransactionValueModal } from '@/features/slices/modalSlice';
import { forwardRef } from 'react';
import styled from 'styled-components';
import Modal from '../../Modal';

const Div = styled.div`
	width: 800px;
	// min-height: 500px;
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
			<Div className='bg-white'>
				<CompareTransactionValue isModal />
			</Div>
			<div></div>
		</Modal>
	);
});

export default CompareTransactionValueModal;

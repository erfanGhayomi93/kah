import OptionTradesValue from '@/components/pages/Dashboard/components/OptionTradesValue';
import { useAppDispatch } from '@/features/hooks';
import { setOptionTradeValueModal } from '@/features/slices/modalSlice';
import { forwardRef } from 'react';
import styled from 'styled-components';
import Modal from '../../Modal';

const Div = styled.div`
	width: 800px;
	// min-height: 500px;
	display: flex;
	flex-direction: column;
`;

interface IOptionTradeValueModalProps extends IBaseModalConfiguration {}

const OptionTradeValueModal = forwardRef<HTMLDivElement, IOptionTradeValueModalProps>((props, ref) => {
	const dispatch = useAppDispatch();

	const onclose = () => {
		dispatch(setOptionTradeValueModal(null));
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
				<OptionTradesValue isModal />
			</Div>
		</Modal>
	);
});

export default OptionTradeValueModal;

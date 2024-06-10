import OptionMarketProcess from '@/components/pages/Dashboard/components/OptionMarketProcess';
import { useAppDispatch } from '@/features/hooks';
import { setOptionMarketProcessModal } from '@/features/slices/modalSlice';
import { forwardRef } from 'react';
import styled from 'styled-components';
import Modal from '../../Modal';

const Div = styled.div`
	width: 800px;
	min-height: 600px;
	display: flex;
	flex-direction: column;
`;

interface IOptionMarketProcessModalProps extends IBaseModalConfiguration {}

const OptionMarketProcessModal = forwardRef<HTMLDivElement, IOptionMarketProcessModalProps>((props, ref) => {
	const dispatch = useAppDispatch();

	const onclose = () => {
		dispatch(setOptionMarketProcessModal(null));
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
				<OptionMarketProcess isModal />
			</Div>
		</Modal>
	);
});

export default OptionMarketProcessModal;

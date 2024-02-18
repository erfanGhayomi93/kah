import { useAppDispatch } from '@/features/hooks';
import { toggleBuySellModal, type IBuySellModal } from '@/features/slices/modalSlice';
import { useState } from 'react';
import styled from 'styled-components';
import Modal from '../Modal';
import Body from './Body';
import Footer from './Footer';
import Header from './Header';

const Div = styled.div`
	width: 336px;
	height: 612px;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	background-color: rgba(251, 251, 251, 1);
`;

interface BuySellModalProps extends IBuySellModal {}

const BuySellModal = ({ symbolISIN, symbolTitle, side, expand, holdAfterOrder }: BuySellModalProps) => {
	const dispatch = useAppDispatch();

	const [inputs, setInputs] = useState<IBsModalInputs>({
		side: side ?? 'buy',
		expand: expand ?? false,
		holdAfterOrder: holdAfterOrder ?? true,
	});

	const setInputValue = <T extends keyof IBsModalInputs>(field: T, value: IBsModalInputs[T]) => {
		setInputs((prev) => ({
			...prev,
			[field]: value,
		}));
	};

	const onCloseModal = () => {
		dispatch(toggleBuySellModal(null));
	};

	return (
		<Modal moveable top='16%' onClose={onCloseModal}>
			<Div>
				<Header symbolTitle={symbolTitle} />
				<Body {...inputs} />
				<Footer
					validityDays={3}
					hold={inputs.holdAfterOrder}
					onHold={(checked) => setInputValue('holdAfterOrder', checked)}
				/>
			</Div>
		</Modal>
	);
};

export default BuySellModal;

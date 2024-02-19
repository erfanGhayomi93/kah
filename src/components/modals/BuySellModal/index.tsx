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

	const setInputValue: TSetBsModalInputs = (arg1, arg2) => {
		if (typeof arg1 === 'string') {
			setInputs((values) => ({
				...values,
				[arg1]: arg2,
			}));
		} else if (typeof arg1 === 'object') {
			setInputs((values) => ({
				...values,
				...arg1,
			}));
		} else if (typeof arg1 === 'function') {
			setInputs((values) => ({
				...values,
				...arg1(values),
			}));
		}
	};

	const onCloseModal = () => {
		dispatch(toggleBuySellModal(null));
	};

	return (
		<Modal moveable top='16%' onClose={onCloseModal}>
			<Div>
				<Header symbolTitle={symbolTitle} />
				<Body {...inputs} setInputValue={setInputValue} />
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

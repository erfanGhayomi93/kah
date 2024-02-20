import { useAppDispatch } from '@/features/hooks';
import { toggleBuySellModal, type IBuySellModal } from '@/features/slices/modalSlice';
import { useState } from 'react';
import styled from 'styled-components';
import Modal from '../Modal';
import Body from './Body';
import Footer from './Footer';
import Header from './Header';
import SymbolInfo from './SymbolInfo';

const Div = styled.div`
	height: 612px;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	background-color: rgba(251, 251, 251, 1);
	transition: width 200ms ease-in-out;
	-webkit-transition: width 200ms ease-in-out;
`;

interface BuySellModalProps extends IBuySellModal {}

const BuySellModal = ({ symbolISIN, symbolTitle, priceLock, side, expand, holdAfterOrder }: BuySellModalProps) => {
	const dispatch = useAppDispatch();

	const [inputs, setInputs] = useState<IBsModalInputs>({
		price: 0,
		quantity: 0,
		side: side ?? 'buy',
		expand: expand ?? false,
		priceLock: priceLock ?? false,
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
			<Div style={{ width: inputs.expand ? '732px' : '336px' }}>
				<Header
					symbolTitle={symbolTitle}
					expand={inputs.expand}
					onToggle={() => setInputValue('expand', !inputs.expand)}
				/>
				<div className='flex flex-1'>
					<Body {...inputs} setInputValue={setInputValue} />
					{inputs.expand && <SymbolInfo />}
				</div>
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

import { useAppDispatch } from '@/features/hooks';
import { toggleAddSymbolToWatchlist } from '@/features/slices/modalSlice';
import styled from 'styled-components';
import Modal from '../Modal';

const Div = styled.div`
	width: 336px;
	height: 200px;
	padding: 1.6rem 1.6rem 2.4rem 1.6rem;
	display: flex;
`;

const AddSymbolToWatchlist = () => {
	const dispatch = useAppDispatch();

	const onCloseModal = () => {
		dispatch(toggleAddSymbolToWatchlist(false));
	};

	return (
		<Modal transparent style={{ modal: { transform: 'translate(-50%, -50%)' } }} top='50%' onClose={onCloseModal}>
			<Div className='bg-white'>
				<h1>Hello</h1>
			</Div>
		</Modal>
	);
};

export default AddSymbolToWatchlist;

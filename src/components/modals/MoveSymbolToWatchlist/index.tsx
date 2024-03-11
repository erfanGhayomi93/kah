import { useAppDispatch } from '@/features/hooks';
import { toggleMoveSymbolToWatchlistModal, type IMoveSymbolToWatchlistModal } from '@/features/slices/modalSlice';
import styled from 'styled-components';
import Modal from '../Modal';

const Div = styled.div`
	width: 472px;
	height: 552px;
`;

interface MoveSymbolToWatchlistProps extends IMoveSymbolToWatchlistModal {}

const MoveSymbolToWatchlist = ({ symbolISIN, symbolTitle, ...props }: MoveSymbolToWatchlistProps) => {
	const dispatch = useAppDispatch();

	const onCloseModal = () => {
		dispatch(toggleMoveSymbolToWatchlistModal(null));
	};

	return (
		<Modal style={{ modal: { transform: 'translate(-50%, -50%)' } }} top='50%' onClose={onCloseModal} {...props}>
			<Div className='justify-between bg-white flex-column'></Div>
		</Modal>
	);
};

export default MoveSymbolToWatchlist;

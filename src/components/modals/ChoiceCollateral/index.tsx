import { XSVG } from '@/components/icons';
import { useAppDispatch } from '@/features/hooks';
import { toggleChoiceCollateralModal, type IChoiceCollateral } from '@/features/slices/modalSlice';
import styled from 'styled-components';
import Modal from '../Modal';

const Div = styled.div`
	width: 456px;
	height: 424px;
	position: relative;
`;

interface ChoiceCollateralProps extends IChoiceCollateral {}

const ChoiceCollateral = ({ order, ...props }: ChoiceCollateralProps) => {
	const dispatch = useAppDispatch();

	const onCloseModal = () => {
		dispatch(toggleChoiceCollateralModal(null));
	};

	return (
		<Modal moveable transparent onClose={onCloseModal} {...props}>
			<Div className='bg-white'>
				<div key='close' className='absolute left-24 z-10'>
					<button onClick={onCloseModal} type='button' className='icon-hover'>
						<XSVG width='2rem' height='2rem' />
					</button>
				</div>
			</Div>
		</Modal>
	);
};

export default ChoiceCollateral;

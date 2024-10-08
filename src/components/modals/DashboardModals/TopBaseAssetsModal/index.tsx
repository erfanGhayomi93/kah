import TopBaseAssets from '@/components/pages/Dashboard/components/TopBaseAssets';
import { useAppDispatch } from '@/features/hooks';
import { setTopBaseAssetsModal } from '@/features/slices/modalSlice';
import { forwardRef } from 'react';
import styled from 'styled-components';
import Modal from '../../Modal';

const Div = styled.div`
	width: 800px;
	min-height: 600px;
	display: flex;
	flex-direction: column;
`;

interface ITopBaseAssetsModalProps extends IBaseModalConfiguration {}

const TopBaseAssetsModal = forwardRef<HTMLDivElement, ITopBaseAssetsModalProps>((props, ref) => {
	const dispatch = useAppDispatch();

	const onclose = () => {
		dispatch(setTopBaseAssetsModal(null));
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
				<TopBaseAssets isModal />
			</Div>
		</Modal>
	);
});

export default TopBaseAssetsModal;

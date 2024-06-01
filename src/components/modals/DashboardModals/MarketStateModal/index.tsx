import MarketState from '@/components/pages/Dashboard/components/MarketState';
import { useAppDispatch } from '@/features/hooks';
import { setMarketStateModal } from '@/features/slices/modalSlice';
import { useTranslations } from 'next-intl';
import { forwardRef } from 'react';
import styled from 'styled-components';
import Modal from '../../Modal';

const Div = styled.div`
	width: 800px;
	// min-height: 500px;
	display: flex;
	flex-direction: column;
`;

interface IMarketStateModalProps extends IBaseModalConfiguration {}

const MarketStateModal = forwardRef<HTMLDivElement, IMarketStateModalProps>((props, ref) => {
	const t = useTranslations();

	const dispatch = useAppDispatch();

	const onCloseModal = () => {
		dispatch(setMarketStateModal(null));
	};

	return (
		<Modal
			style={{ modal: { transform: 'translate(-50%, -50%)' } }}
			top='50%'
			onClose={onCloseModal}
			{...props}
			ref={ref}
		>
			<Div className='bg-white'>
				<MarketState isModal />
			</Div>
			<div></div>
		</Modal>
	);
});

export default MarketStateModal;

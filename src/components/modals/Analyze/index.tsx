import NoData from '@/components/common/NoData';
import { useAppDispatch } from '@/features/hooks';
import { setAnalyzeModal } from '@/features/slices/modalSlice';
import { type IAnalyzeModal } from '@/features/slices/modalSlice.interfaces';
import { useTranslations } from 'next-intl';
import { forwardRef } from 'react';
import styled from 'styled-components';
import Modal, { Header } from '../Modal';

const Div = styled.div`
	width: 800px;
	min-height: 600px;
	display: flex;
	flex-direction: column;
`;

interface AnalyzeProps extends IAnalyzeModal {}

const Analyze = forwardRef<HTMLDivElement, AnalyzeProps>((props, ref) => {
	const t = useTranslations();

	const dispatch = useAppDispatch();

	const onCloseModal = () => {
		dispatch(setAnalyzeModal(null));
	};

	return (
		<Modal
			top='50%'
			style={{ modal: { transform: 'translate(-50%, -50%)' } }}
			ref={ref}
			onClose={onCloseModal}
			{...props}
		>
			<Div className='bg-white flex-column'>
				<Header label={t('analyze_modal.title')} onClose={onCloseModal} />

				<div className='relative flex-1 gap-24 px-16 pb-16 pt-24 flex-justify-center'>
					<div style={{ width: '30rem' }} className='gap-24 flex-column'>
						<NoData text={t('analyze_modal.no_trade_found')} />
						<button type='button' className='h-40 rounded text-base btn-primary'>
							{t('analyze_modal.make_your_own_strategy')}
						</button>
					</div>
				</div>
			</Div>
		</Modal>
	);
});

export default Analyze;

import AnimatePresence from '@/components/common/animation/AnimatePresence';
import { useAppDispatch } from '@/features/hooks';
import { setChangeBrokerModal } from '@/features/slices/modalSlice';
import { type IChangeBrokerModal } from '@/features/slices/types/modalSlice.interfaces';
import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import { forwardRef, useState } from 'react';
import styled from 'styled-components';
import Modal, { Header } from '../Modal';
import { Body } from './Body';
import { HistoryChangeBroker } from './HistoryChangeBroker';

const Div = styled.div`
	width: 420px;
	min-height: 312px;
	max-height: 312px;
	display: flex;
	flex-direction: column;
`;

interface ChangeBrokerProps extends IChangeBrokerModal {}

const ChangeBroker = forwardRef<HTMLDivElement, ChangeBrokerProps>((props, ref) => {
	const t = useTranslations();

	const [isShowExpanded, setIsShowExpanded] = useState(false);

	const dispatch = useAppDispatch();

	const onCloseModal = () => {
		dispatch(setChangeBrokerModal(null));
	};

	const onExpanded = () => {
		setIsShowExpanded((prev) => !prev);
	};

	return (
		<Modal
			top='50%'
			style={{ modal: { transform: 'translate(-50%, -50%)' } }}
			ref={ref}
			onClose={onCloseModal}
			{...props}
		>
			<Header label={t('change_broker_modal.title')} onClose={onCloseModal} onExpanded={onExpanded} />
			<div className='darkBlue:bg-gray-50 flex bg-white p-24 dark:bg-gray-50'>
				<Div
					className={clsx('flex-column', {
						'border-l border-gray-200 pl-24 pr-16': isShowExpanded,
					})}
				>
					<Body onCloseModal={onCloseModal} />
				</Div>

				<AnimatePresence initial={{ animation: 'fadeInLeft' }} exit={{ animation: 'fadeOutLeft' }}>
					{isShowExpanded && (
						<Div className='darkBlue:bg-gray-50 bg-white dark:bg-gray-50'>
							<HistoryChangeBroker onCloseModal={onCloseModal} />
						</Div>
					)}
				</AnimatePresence>
			</div>
		</Modal>
	);
});

export default ChangeBroker;

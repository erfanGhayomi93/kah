import AnimatePresence from '@/components/common/animation/AnimatePresence';
import { useAppDispatch } from '@/features/hooks';
import { setFreezeModal } from '@/features/slices/modalSlice';
import { type IFreezeModal } from '@/features/slices/types/modalSlice.interfaces';
import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import { forwardRef, useState } from 'react';
import styled from 'styled-components';
import Modal, { Header } from '../Modal';
import { Body } from './Body';
import HistoryFreeze from './HistoryFreeze';

const Div = styled.div`
	width: 420px;
	min-height: 430px;
	display: flex;
	flex-direction: column;
`;

interface FreezeProps extends IFreezeModal {}

const Freeze = forwardRef<HTMLDivElement, FreezeProps>((props, ref) => {
	const t = useTranslations();

	const [tabSelected, setTabSelected] = useState('freezeModalTab');

	const [isShowExpanded, setIsShowExpanded] = useState(false);

	const dispatch = useAppDispatch();

	const onExpanded = () => {
		setIsShowExpanded((prev) => !prev);
	};

	const onCloseModal = () => {
		dispatch(setFreezeModal(null));
	};

	return (
		<Modal
			top='50%'
			style={{ modal: { transform: 'translate(-50%, -50%)' } }}
			ref={ref}
			onClose={onCloseModal}
			{...props}
		>
			<Header label={t('freeze_modal.title')} onClose={onCloseModal} onExpanded={onExpanded} />
			<div className='darkBlue:bg-gray-50 flex bg-white p-24 dark:bg-gray-50'>
				<Div
					className={clsx('flex-column', {
						'border-l border-gray-200 pl-24 pr-16': isShowExpanded,
					})}
				>
					<Body onCloseModal={onCloseModal} setTabSelected={setTabSelected} />
				</Div>

				<AnimatePresence initial={{ animation: 'fadeInLeft' }} exit={{ animation: 'fadeOutLeft' }}>
					{isShowExpanded && (
						<Div className='darkBlue:bg-gray-50 bg-white dark:bg-gray-50'>
							<HistoryFreeze tabSelected={tabSelected} onCloseModal={onCloseModal} />
						</Div>
					)}
				</AnimatePresence>
			</div>
		</Modal>
	);
});

export default Freeze;

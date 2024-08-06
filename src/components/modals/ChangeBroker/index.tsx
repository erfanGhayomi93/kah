import { useAppDispatch } from '@/features/hooks';
import { setChangeBrokerModal } from '@/features/slices/modalSlice';
import { type IChangeBrokerModal } from '@/features/slices/types/modalSlice.interfaces';
import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import { forwardRef, useState } from 'react';
import Modal, { Header } from '../Modal';
import { Body } from './Body';
import { HistoryChangeBroker } from './HistoryChangeBroker';

interface ChangeBrokerProps extends IChangeBrokerModal {}

const ChangeBroker = forwardRef<HTMLDivElement, ChangeBrokerProps>((props, ref) => {
	const t = useTranslations();

	const [isExpand, setIsExpand] = useState(false);

	const dispatch = useAppDispatch();

	const onCloseModal = () => {
		dispatch(setChangeBrokerModal(null));
	};

	const onExpanded = () => {
		setIsExpand((prev) => !prev);
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

			<div
				style={{ width: isExpand ? '808px' : '400px', height: '312px' }}
				className='flex bg-white py-24 transition-width darkness:bg-gray-50'
			>
				<div
					style={{ flex: '0 0 400px' }}
					className={clsx('px-24 flex-column', isExpand && 'border-l border-gray-200')}
				>
					<Body onCloseModal={onCloseModal} />
				</div>

				{isExpand && (
					<div className='flex-1 bg-white flex-column darkness:bg-gray-50'>
						<HistoryChangeBroker onCloseModal={onCloseModal} />
					</div>
				)}
			</div>
		</Modal>
	);
});

export default ChangeBroker;

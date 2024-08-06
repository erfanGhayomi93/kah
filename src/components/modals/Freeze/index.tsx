import { useAppDispatch } from '@/features/hooks';
import { setFreezeModal } from '@/features/slices/modalSlice';
import { type IFreezeModal } from '@/features/slices/types/modalSlice.interfaces';
import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import { forwardRef, useState } from 'react';
import Modal, { Header } from '../Modal';
import { Body } from './Body';
import HistoryFreeze from './HistoryFreeze';

interface FreezeProps extends IFreezeModal {}

const Freeze = forwardRef<HTMLDivElement, FreezeProps>((props, ref) => {
	const t = useTranslations();

	const [tabSelected, setTabSelected] = useState('freezeModalTab');

	const [isExpand, setIsExpand] = useState(false);

	const dispatch = useAppDispatch();

	const onExpanded = () => {
		setIsExpand((prev) => !prev);
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

			<div
				style={{ width: isExpand ? '808px' : '400px', height: '513px' }}
				className='flex bg-white p-24 transition-width darkness:bg-gray-50'
			>
				<div
					style={{ flex: '0 0 352px' }}
					className={clsx('flex-column', isExpand && 'border-l border-gray-200 pl-24 pr-16')}
				>
					<Body onCloseModal={onCloseModal} setTabSelected={setTabSelected} />
				</div>

				{isExpand && (
					<div className='flex-1 bg-white flex-column darkBlue:bg-gray-50 dark:bg-gray-50'>
						<HistoryFreeze tabSelected={tabSelected} onCloseModal={onCloseModal} />
					</div>
				)}
			</div>
		</Modal>
	);
});

export default Freeze;

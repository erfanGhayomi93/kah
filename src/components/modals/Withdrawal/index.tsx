import { useAppDispatch } from '@/features/hooks';
import { setWithdrawalModal } from '@/features/slices/modalSlice';
import { type IWithdrawalModal } from '@/features/slices/types/modalSlice.interfaces';
import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import { forwardRef, useState } from 'react';
import Modal, { Header } from '../Modal';
import { Body } from './Body';
import HistoryWithdrawal from './HistoryWithdrawal';

interface WithdrawalProps extends IWithdrawalModal {}

const Withdrawal = forwardRef<HTMLDivElement, WithdrawalProps>((props, ref) => {
	const t = useTranslations();

	const { data } = props;

	const [isExpand, setIsExpand] = useState(false);

	const dispatch = useAppDispatch();

	const onCloseModal = () => {
		dispatch(setWithdrawalModal(null));
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
			<Header label={t('withdrawal_modal.title')} onClose={onCloseModal} onExpanded={onExpanded} />

			<div
				style={{ width: isExpand ? '808px' : '400px' }}
				className='flex bg-white py-24 transition-width darkness:bg-gray-50'
			>
				<div
					style={{ flex: '0 0 400px' }}
					className={clsx('px-24 flex-column', isExpand && 'border-l border-gray-200')}
				>
					<Body onClose={onCloseModal} editData={data} />
				</div>

				{isExpand && (
					<div className='bg-white px-24 flex-column darkness:bg-gray-50'>
						<HistoryWithdrawal onCloseModal={onCloseModal} />
					</div>
				)}
			</div>
		</Modal>
	);
});

export default Withdrawal;

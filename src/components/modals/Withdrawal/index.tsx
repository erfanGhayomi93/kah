import AnimatePresence from '@/components/common/animation/AnimatePresence';
import { useAppDispatch } from '@/features/hooks';
import { setWithdrawalModal } from '@/features/slices/modalSlice';
import { type IWithdrawalModal } from '@/features/slices/types/modalSlice.interfaces';
import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import { forwardRef, useState } from 'react';
import styled from 'styled-components';
import Modal, { Header } from '../Modal';
import { Body } from './Body';
import { HistoryDrawal } from './HistoryDrawal';

const Div = styled.div`
	width: 420px;
	min-height: 312px;
	max-height: 442px;
	display: flex;
	flex-direction: column;
`;

interface WithdrawalProps extends IWithdrawalModal { }

const Withdrawal = forwardRef<HTMLDivElement, WithdrawalProps>((props, ref) => {
	const t = useTranslations();
	const { data } = props;

	const [isShowExpanded, setIsShowExpanded] = useState(false);

	const dispatch = useAppDispatch();

	const onCloseModal = () => {
		dispatch(setWithdrawalModal(null));
	};

	const onExpanded = () => {
		setIsShowExpanded(prev => !prev);
	};

	return (
		<Modal
			top='50%'
			style={{ modal: { transform: 'translate(-50%, -50%)' } }}
			ref={ref}
			onClose={onCloseModal}
			{...props}
		>
			<Header
				label={t('withdrawal_modal.title')}
				onClose={onCloseModal}
				onExpanded={onExpanded}
			/>

			<div className='bg-white flex p-24'>

				<Div className={clsx('flex-column', {
					'border-l border-gray-500 pr-16 pl-24': isShowExpanded
				})}>
					<Body
						onClose={onCloseModal}
						editData={data}
					/>
				</Div>


				<AnimatePresence
					initial={{ animation: 'fadeInLeft' }}
					exit={{ animation: 'fadeOutLeft' }}
				>
					{
						isShowExpanded && (
							<Div className='bg-white'>
								<HistoryDrawal
									onCloseModal={onCloseModal}
								/>
							</Div>
						)
					}
				</AnimatePresence>

			</div>

		</Modal>
	);
});

export default Withdrawal;

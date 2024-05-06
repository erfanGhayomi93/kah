import AnimatePresence from '@/components/common/animation/AnimatePresence';
import { useAppDispatch } from '@/features/hooks';
import { setDepositModal } from '@/features/slices/modalSlice';
import { type IDepositModal } from '@/features/slices/modalSlice.interfaces';
import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import { forwardRef, useState } from 'react';
import styled from 'styled-components';
import Modal, { Header } from '../Modal';
import { Body } from './Body';
import { HistoryDeposit } from './History';

const Div = styled.div`
	width: 420px;
	min-height: 312px;
	display: flex;
	flex-direction: column;
`;

interface DepositProps extends IDepositModal { }

const Deposit = forwardRef<HTMLDivElement, DepositProps>((props, ref) => {
	const t = useTranslations();
	const [isShowExpanded, setIsShowExpanded] = useState(false);

	const dispatch = useAppDispatch();

	const onCloseModal = () => {
		dispatch(setDepositModal(null));
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
				label={t('deposit_modal.title')}
				onClose={onCloseModal}
				onExpanded={onExpanded}
				isExpanded
			/>

			<div className='flex p-24 bg-white'>
				<Div className={clsx('flex-column', {
					'border-l border-gray-500 pr-16 pl-24': isShowExpanded
				})}>
					<Body />
				</Div>

				<AnimatePresence
					initial={{ animation: 'fadeInLeft' }}
					exit={{ animation: 'fadeOutLeft' }}
				>
					{
						isShowExpanded && (
							<Div className='bg-white'>
								<HistoryDeposit
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

export default Deposit;

import KeyDown from '@/components/common/KeyDown';
import { useAppDispatch } from '@/features/hooks';
import { setConfirmModal } from '@/features/slices/modalSlice';
import { type IConfirmModal } from '@/features/slices/types/modalSlice.interfaces';
import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import { forwardRef } from 'react';
import styled from 'styled-components';
import Modal from '../Modal';

const Div = styled.div`
	width: 360px;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
`;

interface ConfirmProps extends IConfirmModal {}

const Confirm = forwardRef<HTMLDivElement, ConfirmProps>(
	({ title, description, onCancel, onSubmit, confirm, ...props }, ref) => {
		const t = useTranslations();

		const dispatch = useAppDispatch();

		const onCloseModal = () => {
			dispatch(setConfirmModal(null));
		};

		const onCloseModalAndNotify = () => {
			onCancel?.();
			onCloseModal();
		};

		const onConfirm = () => {
			onSubmit?.();
			onCloseModal();
		};

		const onKeyDown = (key: string) => {
			if (key === 'Escape') onCloseModalAndNotify();
			else if (key === 'Enter') onConfirm();
		};

		return (
			<Modal
				ref={ref}
				transparent
				style={{ modal: { transform: 'translate(-50%, -50%)', borderRadius: '1.6rem' } }}
				top='50%'
				onClose={onCloseModal}
				{...props}
			>
				<Div className={clsx('bg-white darkness:bg-gray-50', !title ? 'p-24' : 'px-24 pb-24 pt-16')}>
					{title && <h2 className='text-center text-xl font-medium text-gray-800'>{title}</h2>}

					<div className='pb-40 pt-32 text-center'>
						<p className='text-base text-gray-800'>{description}</p>
					</div>

					<KeyDown keys={['Enter', 'Escape']} onKeyDown={onKeyDown}>
						<div className='flex w-full justify-between gap-8 px-16'>
							{onCancel && (
								<button
									onClick={onCloseModalAndNotify}
									type='button'
									className='h-40 flex-1 rounded text-lg btn-disabled-outline'
								>
									{t('common.cancel')}
								</button>
							)}

							<button
								onClick={onConfirm}
								type='button'
								className={clsx('h-40 flex-1 rounded text-lg font-medium', `btn-${confirm.type}`)}
							>
								{confirm.label}
							</button>
						</div>
					</KeyDown>
				</Div>
			</Modal>
		);
	},
);

export default Confirm;

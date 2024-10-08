import axios, { logoutUser } from '@/api/axios';
import routes from '@/api/routes';
import { useAppDispatch } from '@/features/hooks';
import { setLogoutModal } from '@/features/slices/modalSlice';
import { useTranslations } from 'next-intl';
import { forwardRef, useState } from 'react';
import styled from 'styled-components';
import Modal from '../Modal';

const Div = styled.div`
	width: 336px;
	height: 200px;
	padding: 1.6rem 1.6rem 2.4rem 1.6rem;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
`;

interface LogoutModalProps extends IBaseModalConfiguration {}

const LogoutModal = forwardRef<HTMLDivElement, LogoutModalProps>((props, ref) => {
	const t = useTranslations();

	const dispatch = useAppDispatch();

	const [loading, setLoading] = useState(false);

	const onCloseModal = () => {
		dispatch(setLogoutModal(null));
	};

	const onLoggedOut = async () => {
		logoutUser();
		onCloseModal();
	};

	const logout = async () => {
		try {
			setLoading(true);
			await axios.post(routes.authentication.Logout);

			onLoggedOut();
		} catch (e) {
			//
		}
	};

	return (
		<Modal
			ref={ref}
			transparent
			classes={{ root: 'modal__logout' }}
			style={{ modal: { transform: 'translate(-50%, -50%)', borderRadius: '1.6rem' } }}
			top='50%'
			onClose={onCloseModal}
			{...props}
		>
			<Div className='darkBlue:bg-gray-50 bg-white dark:bg-gray-50'>
				{loading ? (
					<div className='size-32 spinner' />
				) : (
					<>
						<h2 className='text-center text-xl font-medium text-gray-800'>{t('logout_modal.title')}</h2>

						<div className='pb-40 pt-32 text-center'>
							<p className='text-base text-gray-800'>{t('logout_modal.description')}</p>
						</div>

						<div className='flex w-full justify-between gap-8 px-16'>
							<button
								onClick={onCloseModal}
								type='button'
								className='h-40 flex-1 rounded text-lg btn-disabled-outline'
							>
								{t('common.cancel')}
							</button>

							<button
								onClick={logout}
								type='button'
								className='h-40 flex-1 rounded text-lg font-medium btn-error'
							>
								{t('logout_modal.button')}
							</button>
						</div>
					</>
				)}
			</Div>
		</Modal>
	);
});

export default LogoutModal;

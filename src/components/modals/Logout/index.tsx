import axios from '@/api/axios';
import routes from '@/api/routes';
import { useAppDispatch } from '@/features/hooks';
import { toggleLogoutModal } from '@/features/slices/modalSlice';
import { setIsLoggedIn } from '@/features/slices/userSlice';
import { deleteClientId } from '@/utils/cookie';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import styled from 'styled-components';
import Modal from '../Modal';

const Div = styled.div`
	width: 336px;
	height: 200px;
	padding: 1.6rem 1.6rem 2.4rem 1.6rem;
	border-radius: 16px;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
`;

const LogoutModal = () => {
	const t = useTranslations();

	const dispatch = useAppDispatch();

	const [loading, setLoading] = useState(false);

	const onCloseModal = () => {
		dispatch(toggleLogoutModal(false));
	};

	const onLoggedOut = async () => {
		deleteClientId();
		dispatch(setIsLoggedIn(false));
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
			transparent
			classes={{ root: 'modal__logout' }}
			style={{ modal: { transform: 'translate(-50%, -50%)' } }}
			top='50%'
			onClose={onCloseModal}
		>
			<Div className='bg-white shadow-tooltip'>
				{loading ? (
					<div className='spinner size-32' />
				) : (
					<>
						<h2 className='text-center text-xl font-medium text-gray-1000'>{t('logout_modal.title')}</h2>

						<div className='pb-40 pt-32 text-center'>
							<p className='text-base text-gray-1000'>{t('logout_modal.description')}</p>
						</div>

						<div className='flex w-full justify-between gap-8 px-16'>
							<button
								onClick={onCloseModal}
								type='button'
								className='btn-disabled-outline h-40 flex-1 rounded text-lg'
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
};

export default LogoutModal;

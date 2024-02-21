import { useUserInformationQuery } from '@/api/queries/userQueries';
import { useAppDispatch, useAppSelector } from '@/features/hooks';
import { toggleLoginModal, toggleLogoutModal } from '@/features/slices/modalSlice';
import { getIsLoggedIn, getIsLoggingIn } from '@/features/slices/userSlice';
import { type RootState } from '@/features/store';
import { sepNumbers } from '@/utils/helpers';
import { createSelector } from '@reduxjs/toolkit';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import Popup from '../common/Popup';
import {
	BellSVG,
	EditSVG,
	LogoutSVG,
	OffSVG,
	SessionHistorySVG,
	SettingSVG,
	ShieldSVG,
	UserBoldSVG,
	UserCircleSVG,
	WalletSVG,
} from '../icons';

const getStates = createSelector(
	(state: RootState) => state,
	(state) => ({
		isLoggedIn: getIsLoggedIn(state),
		isLoggingIn: getIsLoggingIn(state),
	}),
);

const Header = () => {
	const t = useTranslations();

	const dispatch = useAppDispatch();

	const { isLoggedIn, isLoggingIn } = useAppSelector(getStates);

	const [isDropdownOpened, setIsDropdownOpened] = useState(false);

	const { data: userData, isFetching: isFetchingUserData } = useUserInformationQuery({
		queryKey: ['userInformationQuery'],
		enabled: !isLoggingIn && isLoggedIn,
	});

	const showAuthenticationModal = () => {
		dispatch(toggleLoginModal(true));
	};

	const onLogout = () => {
		dispatch(toggleLogoutModal(true));
	};

	useEffect(() => {
		setIsDropdownOpened(false);
	}, [isLoggedIn]);

	return (
		<header style={{ zIndex: 99 }} className='sticky top-0 z-10 h-48 bg-white px-24 shadow flex-justify-between'>
			<div className='flex-1 gap-32 flex-justify-start'>
				<span className='gap-8 text-gray-900 flex-items-center'>
					<WalletSVG width='2.4rem' height='2.4rem' />
					{t('header.purchase_power')}:
					<span className='gap-4 flex-items-center'>
						<span className='text-lg font-medium text-primary-400'>{sepNumbers(String(5e7))}</span>
						<span className='text-tiny text-gray-700'>{t('common.rial')}</span>
					</span>
				</span>

				<span className='gap-8 text-gray-900 flex-items-center'>
					{t('header.status')}:
					<span className='h-32 gap-4 rounded border border-success-100 bg-success-100/10 px-8 text-success-100 flex-items-center'>
						<ShieldSVG width='2.4rem' height='2.4rem' />
						<span className='text-base font-medium'>{t('header.normal_status')}</span>
					</span>
				</span>
			</div>

			<div className='flex-1 gap-16 flex-justify-end'>
				<button type='button' className='text-gray-900'>
					<BellSVG />
				</button>

				<div className='gap-16 border-r border-r-gray-500 pr-16 flex-items-center'>
					{isLoggedIn ? (
						<Popup
							margin={{
								y: 24,
							}}
							dependency='.modal__logout'
							defaultPopupWidth={296}
							onOpen={() => setIsDropdownOpened(true)}
							onClose={() => setIsDropdownOpened(false)}
							renderer={({ setOpen }) => (
								<div className='rounded-md bg-white pb-16 shadow-tooltip'>
									<div className='flex h-40 items-start justify-between pr-16'>
										<div className='fit-image gap-12 pt-16 flex-items-center'>
											<div
												className='fit-image size-40 rounded-circle'
												style={{ backgroundImage: 'url("/static/images/young-boy.png")' }}
											/>

											<div className='gap-4 flex-column'>
												<h3 className='text-base font-medium text-gray-1000'>
													{t('common.app_user')}
												</h3>
												<span className='text-tiny text-gray-700'>{userData?.mobile}</span>
											</div>
										</div>

										<button
											className='p-16 text-gray-900 transition-colors hover:text-primary-300'
											type='button'
										>
											<EditSVG width='2rem' height='2rem' />
										</button>
									</div>

									{!userData?.hasPassword && (
										<div className='px-16 pt-40 flex-items-center'>
											<button
												type='button'
												className='h-32 w-full rounded bg-primary-100 text-tiny font-medium text-primary-400 transition-colors flex-justify-center hover:bg-primary-400 hover:text-white'
											>
												{t('header.set_password')}
											</button>
										</div>
									)}

									<nav className='gap-16 px-8 pt-32 flex-column'>
										<ul className='flex-column'>
											<li>
												<button
													type='button'
													className='h-40 w-full gap-12 rounded px-12 text-gray-1000 transition-colors flex-justify-start hover:bg-secondary-100'
												>
													<UserCircleSVG
														className='text-gray-900'
														width='1.8rem'
														height='1.8rem'
													/>
													<span>{t('header.user_account')}</span>
												</button>
											</li>
											<li>
												<button
													type='button'
													className='h-40 w-full gap-12 rounded px-12 text-gray-1000 transition-colors flex-justify-start hover:bg-secondary-100'
												>
													<SessionHistorySVG
														className='text-gray-900'
														width='1.6rem'
														height='1.6rem'
													/>
													<span>{t('header.session_history')}</span>
												</button>
											</li>
											<li>
												<button
													type='button'
													className='h-40 w-full gap-12 rounded px-12 text-gray-1000 transition-colors flex-justify-start hover:bg-secondary-100'
												>
													<SettingSVG
														className='text-gray-900'
														width='1.6rem'
														height='1.6rem'
													/>
													<span>{t('header.setting')}</span>
												</button>
											</li>
										</ul>

										<ul className='flex-column'>
											<li>
												<button
													onClick={onLogout}
													type='button'
													className='h-40 w-full gap-12 rounded px-12 text-gray-1000 transition-colors flex-justify-start hover:bg-secondary-100'
												>
													<LogoutSVG
														className='text-gray-900'
														width='1.6rem'
														height='1.6rem'
													/>
													<span>{t('header.logout')}</span>
												</button>
											</li>
										</ul>
									</nav>
								</div>
							)}
						>
							{({ setOpen, open }) => (
								<button
									onClick={() => setOpen(!open)}
									className='gap-8 text-gray-900 flex-items-center'
								>
									<span className='text-base text-gray-1000'>{t('common.app_user')}</span>
									<UserBoldSVG width='2.4rem' height='2.4rem' />
								</button>
							)}
						</Popup>
					) : (
						<button
							onClick={showAuthenticationModal}
							type='button'
							disabled={isFetchingUserData || isLoggingIn}
							className='h-40 rounded px-48 font-medium btn-primary'
						>
							{t('header.login')}
						</button>
					)}

					<button type='button' className='text-error-100'>
						<OffSVG width='2.4rem' height='2.4rem' />
					</button>
				</div>
			</div>

			{isDropdownOpened &&
				createPortal(
					<div
						style={{
							backgroundColor: 'rgba(0, 0, 0, 0.1)',
							animation: 'fadeIn ease-in-out 250ms 1 alternate forwards',
						}}
						className='fixed left-0 top-0 z-10 size-full'
					/>,
					document.body,
				)}
		</header>
	);
};

export default Header;

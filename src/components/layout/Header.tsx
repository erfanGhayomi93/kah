import { useUserRemainQuery, useUserStatusQuery } from '@/api/queries/brokerPrivateQueries';
import { useUserInformationQuery } from '@/api/queries/userQueries';
import { useAppDispatch, useAppSelector } from '@/features/hooks';
import { getBrokerURLs, setBrokerURLs } from '@/features/slices/brokerSlice';
import {
	setConfirmModal,
	toggleBlackScholesModal,
	toggleBuySellModal,
	toggleChoiceBrokerModal,
	toggleForgetPasswordModal,
	toggleLoginModal,
	toggleLogoutModal,
} from '@/features/slices/modalSlice';
import { getBrokerIsSelected, getIsLoggedIn, getIsLoggingIn, setBrokerIsSelected } from '@/features/slices/userSlice';
import { type RootState } from '@/features/store';
import { deleteBrokerClientId } from '@/utils/cookie';
import { cn, sepNumbers } from '@/utils/helpers';
import { createSelector } from '@reduxjs/toolkit';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { toast } from 'react-toastify';
import Popup from '../common/Popup';
import {
	BellSVG,
	EditSVG,
	LogoutSVG,
	SessionHistorySVG,
	SettingSVG,
	ShieldSVG,
	SquareXSVG,
	TriangleWarningSVG,
	UserBoldSVG,
	UserCircleSVG,
	WalletSVG,
} from '../icons';

const getStates = createSelector(
	(state: RootState) => state,
	(state) => ({
		isLoggedIn: getIsLoggedIn(state),
		isLoggingIn: getIsLoggingIn(state),
		brokerURLs: getBrokerURLs(state),
		brokerIsSelected: getBrokerIsSelected(state),
	}),
);

const Header = () => {
	const t = useTranslations();

	const dispatch = useAppDispatch();

	const { isLoggedIn, isLoggingIn, brokerURLs, brokerIsSelected } = useAppSelector(getStates);

	const [isDropdownOpened, setIsDropdownOpened] = useState(false);

	const { data: userData, isFetching: isFetchingUserData } = useUserInformationQuery({
		queryKey: ['userInformationQuery'],
		enabled: !isLoggingIn && isLoggedIn,
	});

	const { data: userStatus } = useUserStatusQuery({
		queryKey: ['userStatusQuery'],
		enabled: Boolean(brokerURLs),
	});

	const { data: userRemain } = useUserRemainQuery({
		queryKey: ['userRemainQuery'],
		enabled: Boolean(brokerURLs),
	});

	const showAuthenticationModal = () => {
		dispatch(toggleLoginModal({}));
	};

	const onLogout = () => {
		dispatch(toggleLogoutModal({}));
	};

	const setPassword = () => {
		dispatch(toggleForgetPasswordModal({}));
	};

	const logoutBroker = (callback: () => void) => {
		dispatch(
			setConfirmModal({
				title: t('header.logout_broker'),
				description: t('header.logout_broker_description'),
				confirm: {
					label: t('header.exit'),
					type: 'error',
				},
				onSubmit: () => {
					dispatch(setBrokerIsSelected(false));
					dispatch(setBrokerURLs(null));
					dispatch(toggleBuySellModal(null));
					deleteBrokerClientId();

					toast.success(t('alerts.logged_out_successfully'));

					callback();
				},
			}),
		);
	};

	const loginBroker = (callback: () => void) => {
		dispatch(toggleChoiceBrokerModal({}));

		callback();
	};

	const openBlackScholesModal = () => {
		dispatch(toggleBlackScholesModal({}));
	};

	const userStatusIcon = useMemo(() => {
		if (!userStatus?.remainStatus) return null;

		if (userStatus.remainStatus === 'AtRisk') return <TriangleWarningSVG width='2.4rem' height='2.4rem' />;
		if (userStatus.remainStatus === 'CallMargin') return <SquareXSVG width='2.4rem' height='2.4rem' />;

		return <ShieldSVG width='2.4rem' height='2.4rem' />;
	}, [userStatus]);

	useEffect(() => {
		setIsDropdownOpened(false);
	}, [isLoggedIn]);

	return (
		<header style={{ zIndex: 99 }} className='sticky top-0 z-10 h-48 bg-white px-24 shadow flex-justify-between'>
			<div className='pl-32'>
				<Image width='32' height='32' alt='Favicon' src='/static/icons/favicon.png' />
			</div>
			{isLoggedIn ? (
				<div className='flex-1 gap-32 flex-justify-start'>
					{userRemain && (
						<span className='gap-8 text-gray-900 flex-items-center'>
							<WalletSVG width='2.4rem' height='2.4rem' />
							{t('header.purchase_power')}:
							<span className='gap-4 flex-items-center'>
								<span className='text-lg font-medium text-primary-400'>
									{sepNumbers(String(userRemain.purchasePower ?? 0))}
								</span>
								<span className='text-tiny text-gray-700'>{t('common.rial')}</span>
							</span>
						</span>
					)}

					{userStatus?.remainStatus && (
						<span className='gap-8 text-gray-900 flex-items-center'>
							{t('header.status')}:
							<span
								className={cn('h-32 gap-4 rounded border flex-items-center', {
									'border-success-100 bg-success-100/10 px-8 text-success-100':
										userStatus.remainStatus === 'Normal',
									'border-warning-100 bg-warning-100/10 px-8 text-warning-100':
										userStatus.remainStatus === 'AtRisk',
									'border-error-100 bg-error-100/10 px-8 text-error-100':
										userStatus.remainStatus === 'CallMargin',
								})}
							>
								{userStatusIcon}
								<span className='text-base font-medium'>
									{t(`header.user_status_${userStatus.remainStatus}`)}
								</span>
							</span>
						</span>
					)}
				</div>
			) : (
				<div className='flex-1' />
			)}
			<div className='flex-1 gap-16 flex-justify-end'>
				<button
					onClick={openBlackScholesModal}
					type='button'
					className='border-l border-l-gray-500 pl-16 text-gray-900'
				>
					<svg
						width='2.4rem'
						height='2.4rem'
						viewBox='0 0 24 24'
						fill='none'
						xmlns='http://www.w3.org/2000/svg'
					>
						<path
							opacity='0.4'
							d='M8 22H16C18.76 22 21 19.76 21 17V7C21 4.24 18.76 2 16 2H8C5.24 2 3 4.24 3 7V17C3 19.76 5.24 22 8 22Z'
							fill='#5D606D'
						/>
						<path
							d='M14.9991 5.70996H8.99914C7.96914 5.70996 7.11914 6.54996 7.11914 7.58996V8.58996C7.11914 9.61996 7.95914 10.47 8.99914 10.47H14.9991C16.0291 10.47 16.8791 9.62996 16.8791 8.58996V7.58996C16.8791 6.54996 16.0391 5.70996 14.9991 5.70996Z'
							fill='#5D606D'
						/>
						<path
							d='M8.16039 14.9201C8.02039 14.9201 7.89039 14.8901 7.77039 14.8401C7.65039 14.7901 7.54039 14.7201 7.45039 14.6301C7.26039 14.4401 7.15039 14.1901 7.15039 13.9201C7.15039 13.7901 7.18039 13.6601 7.23039 13.5401C7.28039 13.4101 7.35039 13.3101 7.45039 13.2101C7.68039 12.9801 8.03039 12.8701 8.35039 12.9401C8.41039 12.9501 8.48039 12.9701 8.54039 13.0001C8.60039 13.0201 8.66039 13.0501 8.71039 13.0901C8.77039 13.1201 8.82039 13.1701 8.86039 13.2101C8.95039 13.3101 9.03039 13.4101 9.08039 13.5401C9.13039 13.6601 9.15039 13.7901 9.15039 13.9201C9.15039 14.1901 9.05039 14.4401 8.86039 14.6301C8.67039 14.8201 8.42039 14.9201 8.16039 14.9201Z'
							fill='#5D606D'
						/>
						<path
							d='M12.1504 14.9201C11.8904 14.9201 11.6404 14.8201 11.4504 14.6301C11.2604 14.4401 11.1504 14.1901 11.1504 13.9201C11.1504 13.6601 11.2604 13.4001 11.4504 13.2101C11.8204 12.8401 12.4904 12.8401 12.8604 13.2101C12.9504 13.3101 13.0304 13.4101 13.0804 13.5401C13.1304 13.6601 13.1504 13.7901 13.1504 13.9201C13.1504 14.1901 13.0504 14.4401 12.8604 14.6301C12.6704 14.8201 12.4204 14.9201 12.1504 14.9201Z'
							fill='#5D606D'
						/>
						<path
							d='M16.1504 14.9201C15.8904 14.9201 15.6404 14.8201 15.4504 14.6301C15.2604 14.4401 15.1504 14.1901 15.1504 13.9201C15.1504 13.6601 15.2604 13.4001 15.4504 13.2101C15.8204 12.8401 16.4904 12.8401 16.8604 13.2101C17.0504 13.4001 17.1604 13.6601 17.1604 13.9201C17.1604 14.0501 17.1304 14.1801 17.0804 14.3001C17.0304 14.4201 16.9604 14.5301 16.8604 14.6301C16.6704 14.8201 16.4204 14.9201 16.1504 14.9201Z'
							fill='#5D606D'
						/>
						<path
							d='M8.16039 18.92C7.89039 18.92 7.64039 18.82 7.45039 18.63C7.26039 18.44 7.15039 18.19 7.15039 17.92C7.15039 17.66 7.26039 17.4 7.45039 17.21C7.54039 17.12 7.65039 17.05 7.77039 17C8.02039 16.9 8.29039 16.9 8.54039 17C8.60039 17.02 8.66039 17.05 8.71039 17.09C8.77039 17.12 8.82039 17.17 8.86039 17.21C9.05039 17.4 9.16039 17.66 9.16039 17.92C9.16039 18.19 9.05039 18.44 8.86039 18.63C8.67039 18.82 8.42039 18.92 8.16039 18.92Z'
							fill='#5D606D'
						/>
						<path
							d='M12.1504 18.92C11.8904 18.92 11.6404 18.82 11.4504 18.63C11.2604 18.44 11.1504 18.19 11.1504 17.92C11.1504 17.85 11.1604 17.79 11.1704 17.72C11.1904 17.66 11.2104 17.6 11.2304 17.54C11.2604 17.48 11.2904 17.42 11.3204 17.36C11.3604 17.31 11.4004 17.26 11.4504 17.21C11.5404 17.12 11.6504 17.05 11.7704 17C12.1404 16.85 12.5804 16.93 12.8604 17.21C13.0504 17.4 13.1504 17.66 13.1504 17.92C13.1504 18.19 13.0504 18.44 12.8604 18.63C12.7704 18.72 12.6604 18.79 12.5404 18.84C12.4204 18.89 12.2904 18.92 12.1504 18.92Z'
							fill='#5D606D'
						/>
						<path
							d='M16.1502 18.92C16.0202 18.92 15.8902 18.89 15.7702 18.84C15.6502 18.79 15.5402 18.72 15.4502 18.63C15.2602 18.44 15.1602 18.19 15.1602 17.92C15.1602 17.66 15.2602 17.4 15.4502 17.21C15.7202 16.93 16.1702 16.85 16.5402 17C16.6602 17.05 16.7702 17.12 16.8602 17.21C17.0502 17.4 17.1502 17.66 17.1502 17.92C17.1502 18.19 17.0502 18.44 16.8602 18.63C16.6702 18.82 16.4202 18.92 16.1502 18.92Z'
							fill='#5D606D'
						/>
					</svg>
				</button>

				{isLoggedIn && (
					<button type='button' className='border-l border-l-gray-500 pl-16 text-gray-900'>
						<BellSVG />
					</button>
				)}

				<div className='gap-16 flex-items-center'>
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
										<div className='gap-12 pt-16 flex-items-center fit-image'>
											<div
												className='size-40 rounded-circle fit-image'
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

									{(!userData?.hasPassword || !brokerIsSelected || brokerIsSelected) && (
										<div className='px-16 pt-40 flex-items-center'>
											{!userData?.hasPassword && (
												<button
													type='button'
													onClick={setPassword}
													className='h-32 w-full rounded bg-primary-100 text-tiny font-medium text-primary-400 transition-colors flex-justify-center hover:bg-primary-400 hover:text-white'
												>
													{t('header.set_password')}
												</button>
											)}

											{brokerIsSelected ? (
												<button
													type='button'
													onClick={() => logoutBroker(() => setOpen(false))}
													className='h-32 w-full rounded border border-error-100 bg-error-100/10 text-tiny font-medium text-error-100 transition-colors flex-justify-center hover:bg-error-100 hover:text-white'
												>
													{t('header.logout_broker')}
												</button>
											) : (
												<button
													type='button'
													onClick={() => loginBroker(() => setOpen(false))}
													className='h-32 w-full rounded border border-primary-400 bg-primary-400/10 text-tiny font-medium text-primary-400 transition-colors flex-justify-center hover:bg-primary-400 hover:text-white'
												>
													{t('header.login_broker')}
												</button>
											)}
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
							className='h-36 rounded px-40 font-medium btn-primary'
						>
							{t('header.login')}
						</button>
					)}
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

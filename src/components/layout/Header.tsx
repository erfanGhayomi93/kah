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
import { cn, copyNumberToClipboard, sepNumbers } from '@/utils/helpers';
import { createSelector } from '@reduxjs/toolkit';
import { useTranslations } from 'next-intl';
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
			{isLoggedIn ? (
				<div className='flex-1 gap-32 flex-justify-start'>
					{userRemain && (
						<span className='gap-8 text-gray-900 flex-items-center'>
							<WalletSVG width='2.4rem' height='2.4rem' />
							{t('header.purchase_power')}:
							<span className='gap-4 flex-items-center'>
								<span
									className='select-all text-lg font-medium text-primary-400 ltr'
									onCopy={(e) => copyNumberToClipboard(e, userRemain.purchasePower ?? 0)}
								>
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
							fill-rule='evenodd'
							clip-rule='evenodd'
							d='M12 23C6.81455 23 4.22182 23 2.61092 21.389C1 19.7782 1 17.1854 1 12C1 6.81455 1 4.22182 2.61092 2.61092C4.22182 1 6.81455 1 12 1C17.1854 1 19.7782 1 21.389 2.61092C23 4.22182 23 6.81455 23 12C23 17.1854 23 19.7782 21.389 21.389C19.7782 23 17.1854 23 12 23ZM8.425 5.94998C8.425 5.49434 8.05563 5.12498 7.6 5.12498C7.14437 5.12498 6.775 5.49434 6.775 5.94998V7.32499H5.4C4.94437 7.32499 4.575 7.69436 4.575 8.14999C4.575 8.60563 4.94437 8.97499 5.4 8.97499H6.775V10.35C6.775 10.8056 7.14437 11.175 7.6 11.175C8.05563 11.175 8.425 10.8056 8.425 10.35V8.97499H9.8C10.2556 8.97499 10.625 8.60563 10.625 8.14999C10.625 7.69436 10.2556 7.32499 9.8 7.32499H8.425V5.94998ZM14.2 7.32498C13.7444 7.32498 13.375 7.69434 13.375 8.14998C13.375 8.60561 13.7444 8.97498 14.2 8.97498H18.6C19.0556 8.97498 19.425 8.60561 19.425 8.14998C19.425 7.69434 19.0556 7.32498 18.6 7.32498H14.2ZM14.2 13.925C13.7444 13.925 13.375 14.2944 13.375 14.75C13.375 15.2056 13.7444 15.575 14.2 15.575H18.6C19.0556 15.575 19.425 15.2056 19.425 14.75C19.425 14.2944 19.0556 13.925 18.6 13.925H14.2ZM6.53336 14.1667C6.21118 13.8445 5.68882 13.8445 5.36664 14.1667C5.04446 14.4889 5.04446 15.0111 5.36664 15.3333L6.43329 16.4L5.36665 17.4667C5.04447 17.7889 5.04447 18.3111 5.36665 18.6333C5.68884 18.9555 6.2112 18.9555 6.53337 18.6333L7.60001 17.5668L8.66663 18.6333C8.9888 18.9555 9.51116 18.9555 9.83333 18.6333C10.1555 18.3111 10.1555 17.7889 9.83333 17.4667L8.76674 16.4L9.83333 15.3333C10.1555 15.0111 10.1555 14.4889 9.83333 14.1667C9.51118 13.8445 8.98882 13.8445 8.66664 14.1667L7.60001 15.2332L6.53336 14.1667ZM14.2 17.225C13.7444 17.225 13.375 17.5944 13.375 18.05C13.375 18.5056 13.7444 18.875 14.2 18.875H18.6C19.0556 18.875 19.425 18.5056 19.425 18.05C19.425 17.5944 19.0556 17.225 18.6 17.225H14.2Z'
							fill='currentColor'
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
								<div className='gap-24 rounded-md bg-white pb-16 shadow-tooltip flex-column'>
									<div className='flex items-start justify-between pb-8 pr-16'>
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

									<div className='flex-col px-16 flex-items-center'>
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

									<nav className='gap-16 px-8 flex-column'>
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

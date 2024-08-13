import { logoutBroker } from '@/api/brokerAxios';
import { useUserRemainQuery, useUserStatusQuery } from '@/api/queries/brokerPrivateQueries';
import { useUserInformationQuery } from '@/api/queries/userQueries';
import Separator from '@/components/common/Separator';
import { useAppDispatch, useAppSelector } from '@/features/hooks';
import { getBrokerURLs } from '@/features/slices/brokerSlice';
import {
	setBlackScholesModal,
	setChoiceBrokerModal,
	setConfirmModal,
	setDepositModal,
	setForgetPasswordModal,
	setLoginModal,
	setLogoutModal,
} from '@/features/slices/modalSlice';
import { getBrokerIsSelected, getIsLoggedIn } from '@/features/slices/userSlice';
import { type RootState } from '@/features/store';
import { useUserInfo } from '@/hooks';
import { copyNumberToClipboard, sepNumbers } from '@/utils/helpers';
import { createSelector } from '@reduxjs/toolkit';
import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import Popup from '../../common/Popup';
import Tooltip from '../../common/Tooltip';
import {
	ArrowDownSVG,
	CalculatorSVG,
	ShieldCheckSVG,
	ShieldInfoSVG,
	ShieldXSVG,
	UserBoldSVG,
	WalletSVG,
} from '../../icons';
import SearchSymbol from './SearchSymbol';
import ServerDateTime from './ServerDateTime';
import UserDropdown from './UserDropdown';

const getStates = createSelector(
	(state: RootState) => state,
	(state) => ({
		isLoggedIn: getIsLoggedIn(state),
		brokerURLs: getBrokerURLs(state),
		brokerIsSelected: getBrokerIsSelected(state),
	}),
);

const Header = () => {
	const t = useTranslations();

	const dispatch = useAppDispatch();

	const { isLoggedIn, brokerURLs, brokerIsSelected } = useAppSelector(getStates);

	const [isDropdownOpened, setIsDropdownOpened] = useState(false);

	const { data: userData, isFetching: isFetchingUserData } = useUserInformationQuery({
		queryKey: ['userInformationQuery'],
		enabled: isLoggedIn,
	});

	const { data: userInfo } = useUserInfo();

	const { data: userStatus } = useUserStatusQuery({
		queryKey: ['userStatusQuery'],
		enabled: isLoggedIn && Boolean(brokerURLs),
	});

	const { data: userRemain } = useUserRemainQuery({
		queryKey: ['userRemainQuery'],
		enabled: isLoggedIn && Boolean(brokerURLs),
	});

	const showAuthenticationModal = () => {
		dispatch(setLoginModal({}));
	};

	const logout = () => {
		dispatch(setLogoutModal({}));
	};

	const resetPassword = () => {
		dispatch(setForgetPasswordModal({}));
	};

	const logoutFromBroker = (callback: () => void) => {
		dispatch(
			setConfirmModal({
				title: t('header.logout_broker'),
				description: t('header.logout_broker_description'),
				confirm: {
					label: t('header.exit'),
					type: 'error',
				},
				onCancel: () => dispatch(setConfirmModal(null)),
				onSubmit: () => {
					logoutBroker();
					callback();
				},
			}),
		);
	};

	const loginBroker = () => {
		dispatch(setChoiceBrokerModal({}));
	};

	const openBlackScholesModal = () => {
		dispatch(setBlackScholesModal({}));
	};

	const handleShowDepositModal = () => {
		dispatch(setDepositModal({}));
	};

	const userStatusIcon = useMemo(() => {
		if (!userStatus?.remainStatus) return null;

		if (userStatus.remainStatus === 'AtRisk') return <ShieldInfoSVG width='2.4rem' height='2.4rem' />;
		if (userStatus.remainStatus === 'CallMargin') return <ShieldXSVG width='2.4rem' height='2.4rem' />;

		return <ShieldCheckSVG width='2.4rem' height='2.4rem' />;
	}, [userStatus]);

	useEffect(() => {
		setIsDropdownOpened(false);
	}, [isLoggedIn]);

	const COLORS: Record<Broker.TRemainStatus, string> = {
		Normal: 'text-gray-700',
		AtRisk: 'text-warning-100',
		CallMargin: 'text-error-100',
	};

	const customerTitle = userInfo?.customerTitle ?? t('common.app_user');

	return (
		<header className='sticky top-0 z-99 h-56'>
			<div className='h-48 bg-white px-16 flex-justify-between darkness:bg-gray-50'>
				<div className='flex-1 gap-32 flex-justify-start'>
					<div className='gap-16 flex-items-center'>
						{isLoggedIn ? (
							<Popup
								margin={{
									y: 6,
								}}
								dependency='.modal__logout'
								defaultPopupWidth={296}
								onOpen={() => setIsDropdownOpened(true)}
								onClose={() => setIsDropdownOpened(false)}
								renderer={({ setOpen }) => (
									<UserDropdown
										customerTitle={customerTitle}
										hasBroker={Boolean(brokerURLs) && brokerIsSelected}
										resetPassword={resetPassword}
										loginBroker={loginBroker}
										logoutBroker={logoutFromBroker}
										logout={logout}
										userData={userData}
										close={() => setOpen(false)}
									/>
								)}
							>
								{({ setOpen, open }) => (
									<button
										onClick={() => setOpen(!open)}
										className='h-32 gap-8 rounded bg-gray-100 px-8 flex-items-center icon-hover'
									>
										<UserBoldSVG width='2.4rem' height='2.4rem' />
										<span className='whitespace-nowrap text-base font-medium text-gray-800'>
											{customerTitle}
										</span>
										<ArrowDownSVG
											width='1.6rem'
											height='1.6rem'
											className='transition-transform'
											style={{ transform: open ? 'rotate(180deg)' : undefined }}
										/>
									</button>
								)}
							</Popup>
						) : (
							<button
								onClick={showAuthenticationModal}
								type='button'
								disabled={isFetchingUserData}
								className='h-32 gap-8 rounded px-16 font-medium btn-primary'
							>
								{t('header.login')}
								<span className='h-12 w-2 rounded bg-white' />
								{t('header.register')}
							</button>
						)}
					</div>

					{isLoggedIn && userRemain && (
						<span className='gap-8 whitespace-nowrap text-base flex-items-center'>
							{t('header.purchase_power')}:
							<span className='gap-4 flex-items-center'>
								<span
									className='select-all font-medium text-gray-800 ltr'
									onCopy={(e) => copyNumberToClipboard(e, userRemain.purchasePower ?? 0)}
								>
									{sepNumbers(String(userRemain.purchasePower ?? 0))}
								</span>
								<span className='text-tiny text-gray-500'>{t('common.rial')}</span>
							</span>
							<WalletSVG className='text-success-100' onClick={handleShowDepositModal} />
						</span>
					)}

					{isLoggedIn && userStatus?.remainStatus && (
						<>
							<Separator />

							<span className='gap-8 whitespace-nowrap flex-items-center'>
								{t('header.required_margin')}:
								<span className='gap-4 flex-items-center'>
									<span
										className='select-all font-medium text-gray-800 ltr'
										onCopy={(e) => copyNumberToClipboard(e, userStatus?.marginValue ?? 0)}
									>
										{sepNumbers(String(userStatus?.marginValue ?? 0))}
									</span>
									<span className='text-tiny text-gray-500'>{t('common.rial')}</span>
								</span>
							</span>

							<span className='gap-8 flex-items-center'>
								{t('header.status')}:
								<span
									className={clsx(
										'h-32 gap-4 flex-items-center',
										`${COLORS[userStatus.remainStatus]}`,
									)}
								>
									<span className='text-base text-gray-800'>
										{t(`header.user_status_${userStatus.remainStatus}`)}
									</span>
									{userStatusIcon}
								</span>
							</span>
						</>
					)}
				</div>

				<div className='flex-1 gap-16 flex-justify-end'>
					<div className='gap-8 flex-items-center'>
						<SearchSymbol />

						<Tooltip placement='bottom' content={t('tooltip.black_scholes')}>
							<button
								onClick={openBlackScholesModal}
								type='button'
								className='size-32 rounded-circle bg-gray-100 flex-justify-center icon-hover'
							>
								<CalculatorSVG width='1.8rem' height='1.8rem' />
							</button>
						</Tooltip>

						{/* <Popup
							margin={{
								y: 6,
							}}
							dependency='.modal__logout'
							defaultPopupWidth={400}
							onOpen={() => setIsDropdownOpened(true)}
							onClose={() => setIsDropdownOpened(false)}
							renderer={() => <Notifications />}
						>
							{({ open, setOpen }) => (
								<Tooltip placement='bottom' content={t('tooltip.notifications')}>
									<button
										onClick={() => setOpen(!open)}
										type='button'
										className='size-32 rounded-circle bg-gray-100 flex-justify-center icon-hover'
									>
										{open ? (
											<XSVG width='1.8rem' height='1.8rem' />
										) : (
											<BellSVG width='1.8rem' height='1.8rem' />
										)}
									</button>
								</Tooltip>
							)}
						</Popup> */}

						<Separator />
					</div>

					<ServerDateTime />
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
			</div>
		</header>
	);
};

export default Header;

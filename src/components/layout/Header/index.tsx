import { useUserRemainQuery, useUserStatusQuery } from '@/api/queries/brokerPrivateQueries';
import { useUserInformationQuery } from '@/api/queries/userQueries';
import { useAppDispatch, useAppSelector } from '@/features/hooks';
import { getBrokerURLs, setBrokerURLs } from '@/features/slices/brokerSlice';
import {
	setBlackScholesModal,
	setBuySellModal,
	setChoiceBrokerModal,
	setConfirmModal,
	setForgetPasswordModal,
	setLoginModal,
	setLogoutModal,
} from '@/features/slices/modalSlice';
import { getBrokerIsSelected, getIsLoggedIn, getIsLoggingIn, setBrokerIsSelected } from '@/features/slices/userSlice';
import { type RootState } from '@/features/store';
import { useServerDatetime, useUserInfo } from '@/hooks';
import dayjs from '@/libs/dayjs';
import { deleteBrokerClientId } from '@/utils/cookie';
import { cn, copyNumberToClipboard, sepNumbers } from '@/utils/helpers';
import { createSelector } from '@reduxjs/toolkit';
import { useTranslations } from 'next-intl';
import { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { toast } from 'react-toastify';
import Popup from '../../common/Popup';
import Tooltip from '../../common/Tooltip';
import {
	ArrowDownSVG,
	BellSVG,
	CalculatorSVG,
	ShieldCheckSVG,
	ShieldInfoSVG,
	ShieldXSVG,
	UserBoldSVG,
	WalletSVG,
} from '../../icons';
import Notifications from './Notifications';
import SearchSymbol from './SearchSymbol';
import UserDropdown from './UserDropdown';

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

	const { timestamp } = useServerDatetime();

	const { isLoggedIn, isLoggingIn, brokerURLs, brokerIsSelected } = useAppSelector(getStates);

	const [isDropdownOpened, setIsDropdownOpened] = useState(false);

	const { data: userData, isFetching: isFetchingUserData } = useUserInformationQuery({
		queryKey: ['userInformationQuery'],
		enabled: !isLoggingIn && isLoggedIn,
	});

	const { data: userInfo } = useUserInfo();

	const { data: userStatus, refetch: refetchUserStatus } = useUserStatusQuery({
		queryKey: ['userStatusQuery'],
		enabled: false,
	});

	const { data: userRemain, refetch: refetchUserRemain } = useUserRemainQuery({
		queryKey: ['userRemainQuery'],
		enabled: false,
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
					dispatch(setBuySellModal(null));
					deleteBrokerClientId();

					toast.success(t('alerts.logged_out_successfully'));

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

	const userStatusIcon = useMemo(() => {
		if (!userStatus?.remainStatus) return null;

		if (userStatus.remainStatus === 'AtRisk')
			return <ShieldInfoSVG fill='currentColor' fillOpacity='0.1' width='2.4rem' height='2.4rem' />;
		if (userStatus.remainStatus === 'CallMargin')
			return <ShieldXSVG fill='currentColor' fillOpacity='0.1' width='2.4rem' height='2.4rem' />;

		return <ShieldCheckSVG fill='currentColor' fillOpacity='0.1' width='2.4rem' height='2.4rem' />;
	}, [userStatus]);

	const [serverTime, serverDate] = useMemo(() => {
		return dayjs(timestamp).calendar('jalali').format('HH:mm:ss YYYY/MM/DD').split(' ');
	}, [timestamp]);

	useEffect(() => {
		if (!brokerURLs) return;

		refetchUserStatus();
		refetchUserRemain();
	}, [brokerURLs]);

	useEffect(() => {
		setIsDropdownOpened(false);
	}, [isLoggedIn]);

	const COLORS: Record<Broker.TRemainStatus, string> = {
		Normal: 'gray-1000',
		AtRisk: 'warning-100',
		CallMargin: 'error-100',
	};

	const customerTitle = userInfo?.customerTitle ?? t('common.app_user');

	return (
		<header
			style={{ zIndex: 99 }}
			className='sticky top-0 z-10 h-48 border-b border-b-gray-500 bg-white px-16 flex-justify-between'
		>
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
									hasBroker={brokerIsSelected}
									resetPassword={resetPassword}
									loginBroker={loginBroker}
									logoutBroker={logoutBroker}
									logout={logout}
									userData={userData}
									close={() => setOpen(false)}
								/>
							)}
						>
							{({ setOpen, open }) => (
								<button
									onClick={() => setOpen(!open)}
									className='h-32 gap-8 px-8 flex-items-center icon-hover'
								>
									<span className='text-base font-medium text-gray-1000'>{customerTitle}</span>

									<div className='gap-4 flex-items-center'>
										<UserBoldSVG width='2.4rem' height='2.4rem' />
										<ArrowDownSVG
											width='1.6rem'
											height='1.6rem'
											className='transition-transform'
											style={{ transform: open ? 'rotate(180deg)' : undefined }}
										/>
									</div>
								</button>
							)}
						</Popup>
					) : (
						<button
							onClick={showAuthenticationModal}
							type='button'
							disabled={isFetchingUserData || isLoggingIn}
							className='h-32 gap-8 rounded px-16 font-medium btn-primary'
						>
							{t('header.login')}
							<span className='w-2 h-12 rounded bg-white' />
							{t('header.register')}
						</button>
					)}
				</div>

				{userRemain && (
					<span className='gap-8 text-base text-gray-900 flex-items-center'>
						{t('header.purchase_power')}:
						<span className='gap-4 flex-items-center'>
							<span
								className='select-all font-medium text-gray-1000 ltr'
								onCopy={(e) => copyNumberToClipboard(e, userRemain.purchasePower ?? 0)}
							>
								{sepNumbers(String(userRemain.purchasePower ?? 0))}
							</span>
							<span className='text-tiny'>{t('common.rial')}</span>
						</span>
						<WalletSVG
							className={(userRemain.purchasePower ?? 0) < 0 ? 'text-success-100' : 'text-error-100'}
						/>
					</span>
				)}

				{userStatus?.remainStatus && (
					<span className='gap-8 text-gray-900 flex-items-center'>
						{t('header.status')}:
						<span className={cn('h-32 gap-4 flex-items-center', `text-${COLORS[userStatus.remainStatus]}`)}>
							<span className='text-base font-medium'>
								{t(`header.user_status_${userStatus.remainStatus}`)}
							</span>
							{userStatusIcon}
						</span>
					</span>
				)}
			</div>

			<div className='flex-1 gap-16 flex-justify-end'>
				<div className='gap-8 flex-items-center'>
					<SearchSymbol />

					<Tooltip placement='bottom' content={t('tooltip.black_scholes')}>
						<button
							onClick={openBlackScholesModal}
							type='button'
							className='size-32 rounded-circle bg-gray-200 flex-justify-center icon-hover'
						>
							<CalculatorSVG width='1.8rem' height='1.8rem' />
						</button>
					</Tooltip>

					<Popup
						margin={{
							y: 6,
						}}
						dependency='.modal__logout'
						defaultPopupWidth={296}
						onOpen={() => setIsDropdownOpened(true)}
						onClose={() => setIsDropdownOpened(false)}
						renderer={({ setOpen }) => <Notifications />}
					>
						{({ open, setOpen }) => (
							<button
								onClick={() => setOpen(!open)}
								type='button'
								className='size-32 rounded-circle bg-gray-200 flex-justify-center icon-hover'
							>
								<BellSVG width='1.8rem' height='1.8rem' />
							</button>
						)}
					</Popup>

					<span className='w-2 mr-8 h-12 bg-gray-500' />
				</div>

				<div className='h-full gap-8 ltr flex-justify-start'>
					<span style={{ width: '6.6rem' }} className='text-left text-base text-gray-900'>
						{serverDate}
					</span>
					<span style={{ width: '5.2rem' }} className='text-left text-base text-gray-900'>
						{serverTime}
					</span>
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

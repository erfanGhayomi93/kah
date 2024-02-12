import { useUserInformationQuery } from '@/api/queries/userQueries';
import { useAppDispatch, useAppSelector } from '@/features/hooks';
import { toggleLoginModal, toggleLogoutModal } from '@/features/slices/modalSlice';
import { getIsLoggedIn, getIsLoggingIn } from '@/features/slices/userSlice';
import { type RootState } from '@/features/store';
import { createSelector } from '@reduxjs/toolkit';
import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import Popup from '../common/Popup';
import { ArrowDownSVG, EditSVG, LogoutSVG, SessionHistorySVG, SettingSVG, UserCircleSVG } from '../icons';

const getStates = createSelector(
	(state: RootState) => state,
	(state) => ({
		isLoggedIn: getIsLoggedIn(state),
		isLoggingIn: getIsLoggingIn(state),
	}),
);

const Picture = () => (
	<div className='overflow-hidden rounded-circle bg-secondary-100'>
		<Image priority width='40' height='40' alt='profile' src='/static/images/young-boy.png' />
	</div>
);

const Header = () => {
	const pathname = usePathname();

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

	const navigation = useMemo(
		() => [
			{
				id: 'watchlist',
				title: t('header_navigation.watchlist'),
				href: '/fa',
			},
			{
				id: 'saturn',
				title: t('header_navigation.saturn'),
				href: '/fa/saturn',
			},
			{
				id: 'option-chain',
				title: t('header_navigation.option_chain'),
				href: '/fa/option-chain',
			},
		],
		[],
	);

	useEffect(() => {
		setIsDropdownOpened(false);
	}, [isLoggedIn]);

	return (
		<header style={{ zIndex: 99 }} className='sticky top-0 z-10 h-64 bg-white px-32 shadow flex-justify-between'>
			<nav className='gap-56 flex-items-center'>
				<Link href='/' rel='home'>
					<h1 className='text-3xl font-bold'>LOGO</h1>
				</Link>

				<ul className='gap-40 flex-items-center'>
					{navigation.map((item) => (
						<li key={item.id}>
							<Link
								href={item.href}
								className={clsx(
									'p-8 text-lg transition-colors',
									pathname === item.href
										? 'font-bold text-primary-400'
										: 'font-medium text-gray-1000 hover:text-primary-400',
								)}
							>
								{item.title}
							</Link>
						</li>
					))}
				</ul>
			</nav>

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
								<div className='gap-12 pt-16 flex-items-center'>
									<Picture />

									<div className='gap-4 flex-column'>
										<h3 className='text-base font-medium text-gray-1000'>{t('header.app_user')}</h3>
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
											<UserCircleSVG className='text-gray-900' width='1.8rem' height='1.8rem' />
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
											<SettingSVG className='text-gray-900' width='1.6rem' height='1.6rem' />
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
											<LogoutSVG className='text-gray-900' width='1.6rem' height='1.6rem' />
											<span>{t('header.logout')}</span>
										</button>
									</li>
								</ul>
							</nav>
						</div>
					)}
				>
					{({ setOpen, open }) => (
						<button onClick={() => setOpen(!open)} className='gap-8 flex-items-center'>
							<Picture />
							<ArrowDownSVG width='1rem' height='1rem' className='text-gray-1000' />
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

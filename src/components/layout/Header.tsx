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
import { useMemo } from 'react';
import Portal from '../common/Portal';
import { ArrowDownSVG, EditSVG, LogoutSVG, PasswordSVG, SessionHistorySVG, SettingSVG, UserCircleSVG } from '../icons';

const getStates = createSelector(
	(state: RootState) => state,
	(state) => ({
		isLoggedIn: getIsLoggedIn(state),
		isLoggingIn: getIsLoggingIn(state),
	}),
);

const Header = () => {
	const pathname = usePathname();

	const t = useTranslations();

	const dispatch = useAppDispatch();

	const { isLoggedIn, isLoggingIn } = useAppSelector(getStates);

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
				id: 'option-chain',
				title: t('header_navigation.option_chain'),
				href: '/fa/option-chain',
			},
		],
		[],
	);

	return (
		<header className='sticky top-0 z-10 h-72 bg-white px-32 shadow flex-justify-between'>
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
										? 'font-bold text-primary-200'
										: 'font-medium text-gray-100 hover:text-primary-200',
								)}
							>
								{item.title}
							</Link>
						</li>
					))}
				</ul>
			</nav>

			{isLoggedIn ? (
				<Portal
					margin={{
						y: 24,
					}}
					defaultPopupWidth={296}
					renderer={({ setOpen }) => (
						<div className='rounded-md bg-white py-16 shadow-tooltip'>
							<div className='flex h-40 items-start justify-between px-16'>
								<div className='gap-12 flex-items-center'>
									<div className='overflow-hidden rounded-circle bg-link-100'>
										<Image
											width='40'
											height='40'
											alt='profile'
											src='/static/images/young-boy.png'
										/>
									</div>

									<div className='gap-2 flex-column'>
										<h3 className='text-base font-medium'>{t('header.app_user')}</h3>
										<span className='text-tiny text-gray-200'>{userData?.mobile}</span>
									</div>
								</div>

								<button className='text-gray-100' type='button'>
									<EditSVG width='2rem' height='2rem' />
								</button>
							</div>

							<div className='px-16 pb-32 pt-40 flex-items-center'>
								<button
									type='button'
									className='h-32 w-full rounded bg-link-100 text-tiny font-medium text-primary-300 transition-colors flex-justify-center hover:bg-link hover:text-white'
								>
									{t('header.set_password')}
								</button>
							</div>

							<nav className='gap-24 px-8 flex-column'>
								<ul className='flex-column'>
									<li>
										<button
											type='button'
											className='h-40 w-full gap-12 rounded px-12 text-gray-100 transition-colors flex-justify-start hover:bg-link-100'
										>
											<UserCircleSVG width='1.8rem' height='1.8rem' />
											<span>{t('header.user_account')}</span>
										</button>
									</li>
									<li>
										<button
											type='button'
											className='h-40 w-full gap-12 rounded px-12 text-gray-100 transition-colors flex-justify-start hover:bg-link-100'
										>
											<PasswordSVG width='1.6rem' height='1.6rem' />
											<span>{t('header.password')}</span>
										</button>
									</li>
									<li>
										<button
											type='button'
											className='h-40 w-full gap-12 rounded px-12 text-gray-100 transition-colors flex-justify-start hover:bg-link-100'
										>
											<SessionHistorySVG width='1.6rem' height='1.6rem' />
											<span>{t('header.session_history')}</span>
										</button>
									</li>
									<li>
										<button
											type='button'
											className='h-40 w-full gap-12 rounded px-12 text-gray-100 transition-colors flex-justify-start hover:bg-link-100'
										>
											<SettingSVG width='1.6rem' height='1.6rem' />
											<span>{t('header.setting')}</span>
										</button>
									</li>
								</ul>

								<ul className='flex-column'>
									<li>
										<button
											onClick={onLogout}
											type='button'
											className='h-40 w-full gap-12 rounded px-12 text-gray-100 transition-colors flex-justify-start hover:bg-link-100'
										>
											<LogoutSVG width='1.6rem' height='1.6rem' />
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
							<div className='overflow-hidden rounded-circle bg-link-100'>
								<Image width='40' height='40' alt='profile' src='/static/images/young-boy.png' />
							</div>

							<ArrowDownSVG width='1rem' height='1rem' className='text-gray-100' />
						</button>
					)}
				</Portal>
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
		</header>
	);
};

export default Header;

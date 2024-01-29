import { useUserInformationQuery } from '@/api/queries/userQueries';
import { useAppDispatch, useAppSelector } from '@/features/hooks';
import { toggleLoginModal } from '@/features/slices/modalSlice';
import { getIsLoggedIn } from '@/features/slices/userSlice';
import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useMemo } from 'react';
import { ArrowDownSVG } from '../icons';

const Header = () => {
	const pathname = usePathname();

	const t = useTranslations();

	const dispatch = useAppDispatch();

	const isLoggedIn = useAppSelector(getIsLoggedIn);

	const { isFetching: isFetchingUserData } = useUserInformationQuery({
		queryKey: ['userInformationQuery'],
	});

	const showAuthenticationModal = () => {
		dispatch(toggleLoginModal(true));
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
		<header className='relative z-10 h-72 bg-white px-32 shadow flex-justify-between'>
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
				<button className='gap-8 flex-items-center'>
					<div className='overflow-hidden rounded-circle bg-link-100'>
						<Image width='40' height='40' alt='profile' src='/static/images/young-boy.png' />
					</div>

					<ArrowDownSVG width='1rem' height='1rem' className='text-gray-100' />
				</button>
			) : (
				<button
					onClick={showAuthenticationModal}
					type='button'
					disabled={isFetchingUserData}
					className='h-40 rounded px-48 font-medium btn-primary'
				>
					{t('header.login')}
				</button>
			)}
		</header>
	);
};

export default Header;

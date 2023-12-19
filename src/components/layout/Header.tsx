import { useAppDispatch } from '@/features/hooks';
import { toggleAuthenticationModal } from '@/features/slices/modalSlice';
import Link from 'next/link';
import { useMemo } from 'react';

const Header = () => {
	const dispatch = useAppDispatch();

	const showAuthenticationModal = () => {
		dispatch(toggleAuthenticationModal(true));
	};

	const navigation = useMemo(
		() => [
			{
				id: 'home-page',
				title: 'صفحه اصلی',
				href: '/',
			},
			{
				id: 'watchlist',
				title: 'دیده‌بان',
				href: '/watchlist',
			},
			{
				id: 'contact-us',
				title: 'تماس با ما',
				href: '/contact-us',
			},
			{
				id: 'about-us',
				title: 'درباره ما',
				href: '/about-us',
			},
		],
		[],
	);

	return (
		<header className='bg-white h-72 px-32 shadow flex-justify-between'>
			<nav className='gap-56 flex-items-center'>
				<Link href='/' rel='home'>
					<h1 className='text-3xl font-bold'>LOGO</h1>
				</Link>

				<ul className='gap-40 flex-items-center'>
					{navigation.map((item) => (
						<li key={item.id}>
							<Link
								href={item.href}
								className='p-8 text-lg font-medium text-gray-100 transition-colors hover:text-primary-300'
							>
								{item.title}
							</Link>
						</li>
					))}
				</ul>
			</nav>

			<button onClick={showAuthenticationModal} type='button' className='btn-primary h-40 rounded px-48 font-medium'>
				ورود
			</button>
		</header>
	);
};

export default Header;

import Link from 'next/link';
import { useMemo } from 'react';

const Header = () => {
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
		<header className='flex-justify-between bg-white h-72 px-32 shadow'>
			<nav className='flex-items-center gap-56'>
				<Link href='/' rel='home'>
					<h1 className='text-3xl font-bold'>LOGO</h1>
				</Link>

				<ul className='flex-items-center gap-40'>
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

			<button
				type='button'
				className='flex-justify-center h-40 rounded bg-primary-300 px-48 font-medium text-gray-300 transition-colors hover:bg-primary-200'
			>
				ورود
			</button>
		</header>
	);
};

export default Header;

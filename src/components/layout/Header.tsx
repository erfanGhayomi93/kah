import { useAppDispatch } from '@/features/hooks';
import { toggleLoginModal } from '@/features/slices/modalSlice';
import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useMemo } from 'react';

const Header = () => {
	const pathname = usePathname();

	const t = useTranslations();

	const dispatch = useAppDispatch();

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
		<header className='h-72 bg-white px-32 shadow flex-justify-between'>
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

			<button
				onClick={showAuthenticationModal}
				type='button'
				className='h-40 rounded px-48 font-medium btn-primary'
			>
				{t('header.login')}
			</button>
		</header>
	);
};

export default Header;

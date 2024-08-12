import { useGetBrokersQuery } from '@/api/queries/brokerQueries';
import { AngleLeftSVG, BuildingSVG, LogoutSVG, OffSVG, SettingSVG, SunSVG, UserCircleSVG } from '@/components/icons';
import { useAppDispatch, useAppSelector } from '@/features/hooks';
import { getTheme, setTheme } from '@/features/slices/uiSlice';
import { useDebounce } from '@/hooks';
import { Link } from '@/navigation';
import { getBrokerClientId } from '@/utils/cookie';
import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import { useMemo, useState } from 'react';
import styles from './index.module.scss';

interface UserDropdownProps {
	customerTitle: string;
	hasBroker: boolean;
	userData?: User.IUserInformation;
	close: () => void;
	loginBroker: () => void;
	logoutBroker: (callback: () => void) => void;
	logout: () => void;
	resetPassword: () => void;
}

const UserDropdown = ({
	customerTitle,
	hasBroker,
	userData,
	resetPassword,
	loginBroker,
	logoutBroker,
	logout,
	close,
}: UserDropdownProps) => {
	const t = useTranslations();

	const theme = useAppSelector(getTheme);

	const dispatch = useAppDispatch();

	const { setDebounce, clearDebounce } = useDebounce();

	const [themeIsOpen, setThemeIsOpen] = useState(false);

	const { data: brokersData, isFetching } = useGetBrokersQuery({
		queryKey: ['getBrokersQuery'],
		enabled: hasBroker,
	});

	const onChangeTheme = (th: TTheme) => {
		dispatch(setTheme(th));
		close();
	};

	const currentBrokerData = useMemo(() => {
		const [, brokerCode] = getBrokerClientId();

		if (!hasBroker || !brokersData || !brokerCode) return null;

		return brokersData.find((item) => Number(item.brokerCode) === brokerCode) ?? null;
	}, [brokersData, hasBroker]);

	const themes: TTheme[] = ['light', 'dark', 'darkBlue', 'system'];

	const hasNotPassword = userData?.hasPassword === false;

	return (
		<div className='gap-16 rounded-md bg-white pb-16 shadow-sm flex-column darkness:bg-gray-50'>
			<Link target='_blank' href='/settings/general' className='px-16 pt-16 flex-justify-between'>
				<div className='flex gap-12'>
					<div className='size-40 flex-justify-center'>
						<UserCircleSVG width='4rem' height='4rem' />
					</div>

					<div className='gap-8 flex-column'>
						<h2 className='font-medium text-gray-800'>{customerTitle}</h2>
						<h6 className='text-tiny text-gray-700'>{userData?.mobile}</h6>
					</div>
				</div>

				<button className='h-40 flex-40 text-gray-700 flex-justify-center'>
					<AngleLeftSVG width='2rem' height='2rem' />
				</button>
			</Link>

			{(hasNotPassword || !hasBroker) && (
				<div className='flex-col gap-8 px-16 flex-items-center'>
					{hasNotPassword && (
						<button
							type='button'
							onClick={resetPassword}
							className='h-40 w-full rounded border border-primary-100 text-tiny font-medium text-primary-100 transition-colors flex-justify-center hover:bg-primary-100 hover:text-white'
						>
							{t('header.set_password')}
						</button>
					)}

					{!hasBroker && (
						<button
							type='button'
							onClick={() => {
								loginBroker();
								close();
							}}
							className='h-40 w-full rounded border border-primary-100 text-tiny font-medium text-primary-100 transition-colors flex-justify-center hover:bg-primary-100 hover:text-white'
						>
							{t('header.login_broker')}
						</button>
					)}
				</div>
			)}

			<nav className='gap-32 px-8 flex-column'>
				<ul className='gap-16 flex-column'>
					{isFetching && (
						<li className='px-12'>
							<div className='h-40 w-full rounded skeleton' />
						</li>
					)}

					{currentBrokerData && (
						<li>
							<button
								type='button'
								onClick={() => logoutBroker(close)}
								className='h-40 w-full rounded px-12 text-gray-800 transition-colors flex-justify-between hover:bg-secondary-200'
							>
								<div className='gap-8 flex-items-center'>
									<span className='size-24 text-gray-700 flex-justify-center'>
										<BuildingSVG />
									</span>

									<div className='flex gap-8'>
										<span>{t('header.active_broker') + ': '}</span>
										<span>{currentBrokerData.shortName}</span>
									</div>
								</div>

								<OffSVG width='2.4rem' height='2.4rem' className='text-error-100' />
							</button>
						</li>
					)}

					<li
						className={styles.theme}
						onMouseOver={() => {
							setThemeIsOpen(true);
							clearDebounce();
						}}
						onMouseLeave={() => setDebounce(() => setThemeIsOpen(false), 500)}
					>
						<button
							type='button'
							className='h-40 w-full rounded px-12 text-gray-800 transition-colors flex-justify-between hover:bg-secondary-200'
						>
							<div className='gap-8 flex-items-center'>
								<span className='size-24 text-gray-700 flex-justify-center'>
									<SunSVG />
								</span>

								<div className='flex gap-8'>
									<span>{t('header.theme') + ': '}</span>
									<span>{t(`themes.${theme}`)}</span>
								</div>
							</div>

							<AngleLeftSVG width='2rem' height='2rem' className='text-gray-700' />
						</button>

						<ul className={clsx(styles.list, themeIsOpen && styles.active, 'bg-white darkness:bg-gray-50')}>
							{themes.map((th) => (
								<li key={th}>
									<button
										type='button'
										onClick={() => onChangeTheme(th)}
										className={clsx(
											'no-hover h-40 w-full rounded px-16 text-right flex-justify-start hover:btn-select',
											th === theme && 'btn-select',
										)}
									>
										<span>{t('themes.' + th)}</span>
									</button>
								</li>
							))}
						</ul>
					</li>

					{/* <li>
						<Link
							onClick={() => close()}
							href='/settings/sessions'
							className='h-40 w-full gap-8 rounded px-12 text-gray-800 transition-colors flex-justify-start hover:bg-secondary-200'
						>
							<span className='size-24 flex-justify-center'>
								<SessionHistorySVG className='text-gray-700' width='1.6rem' height='1.6rem' />
							</span>

							<span>{t('header.session_history')}</span>
						</Link>
					</li> */}

					<li>
						<Link
							onClick={() => close()}
							href='/settings/general'
							className='h-40 w-full gap-8 rounded px-12 text-gray-800 transition-colors flex-justify-start hover:bg-secondary-200'
						>
							<span className='size-24 flex-justify-center'>
								<SettingSVG className='text-gray-700' width='2.2rem' height='2.2rem' />
							</span>

							<span>{t('header.setting')}</span>
						</Link>
					</li>
				</ul>

				<ul className='flex-column'>
					<li>
						<button
							onClick={() => {
								logout();
								close();
							}}
							type='button'
							className='h-40 w-full gap-8 rounded px-12 text-error-100 transition-colors flex-justify-start hover:bg-error-100 hover:text-white'
						>
							<span className='size-24 flex-justify-center'>
								<LogoutSVG width='1.6rem' height='1.6rem' />
							</span>

							<span>{t('header.logout')}</span>
						</button>
					</li>
				</ul>
			</nav>
		</div>
	);
};

export default UserDropdown;

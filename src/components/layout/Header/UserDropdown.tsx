import Tooltip from '@/components/common/Tooltip';
import { EditSVG, LogoutSVG, SessionHistorySVG, SettingSVG, UserCircleSVG } from '@/components/icons';
import { Link } from '@/navigation';
import { useTranslations } from 'next-intl';

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

	return (
		<div className='gap-24 rounded-md bg-white pb-16 shadow-tooltip flex-column'>
			<div className='gap-4 pb-8 flex-column'>
				<div className='pr-16 flex-justify-between'>
					<div className='gap-8 pt-16 flex-items-center fit-image'>
						<div style={{ flex: '0 0 2.4rem' }} className='h-24 rounded-circle flex-justify-center'>
							<UserCircleSVG className='text-light-gray-700' width='2.4rem' height='2.4rem' />
						</div>
						<h3 className='text-base font-medium text-light-gray-800'>{customerTitle}</h3>
					</div>

					<button
						className='p-12 text-light-gray-700 transition-colors hover:text-light-primary-100'
						type='button'
					>
						<Tooltip placement='bottom' content={t('tooltip.edit')}>
							<div className='p-4'>
								<EditSVG width='2rem' height='2rem' />
							</div>
						</Tooltip>
					</button>
				</div>
				<span className='pr-48 text-tiny text-light-gray-500'>{userData?.mobile ?? '−'}</span>
			</div>

			<div className='flex-col gap-8 px-16 flex-items-center'>
				{userData?.hasPassword === false && (
					<button
						type='button'
						onClick={resetPassword}
						className='h-36 w-full rounded border border-light-primary-100 text-tiny font-medium text-light-primary-100 transition-colors flex-justify-center hover:bg-light-primary-100 hover:text-white'
					>
						{t('header.set_password')}
					</button>
				)}

				{hasBroker ? (
					<button
						type='button'
						onClick={() => logoutBroker(close)}
						className='h-36 w-full rounded border border-light-error-100 text-tiny font-medium text-light-error-100 transition-colors flex-justify-center hover:bg-light-error-100 hover:text-white'
					>
						{t('header.logout_broker')}
					</button>
				) : (
					<button
						type='button'
						onClick={() => {
							loginBroker();
							close();
						}}
						className='h-36 w-full rounded border border-light-primary-100 text-tiny font-medium text-light-primary-100 transition-colors flex-justify-center hover:bg-light-primary-100 hover:text-white'
					>
						{t('header.login_broker')}
					</button>
				)}
			</div>

			<nav className='gap-16 px-8 flex-column'>
				<ul className='flex-column'>
					<li>
						<Link
							onClick={() => close()}
							href='/settings/general'
							className='h-40 w-full gap-8 rounded px-12 text-light-gray-800 transition-colors flex-justify-start hover:bg-light-secondary-200'
						>
							<span className='size-24 flex-justify-center'>
								<UserCircleSVG className='text-light-gray-700' width='1.8rem' height='1.8rem' />
							</span>

							<span>{t('header.user_account')}</span>
						</Link>
					</li>
					<li>
						<Link
							onClick={() => close()}
							href='/settings/history'
							className='h-40 w-full gap-8 rounded px-12 text-light-gray-800 transition-colors flex-justify-start hover:bg-light-secondary-200'
						>
							<span className='size-24 flex-justify-center'>
								<SessionHistorySVG className='text-light-gray-700' width='1.6rem' height='1.6rem' />
							</span>

							<span>{t('header.session_history')}</span>
						</Link>
					</li>
					<li>
						<Link
							onClick={() => close()}
							href='/settings/general'
							className='h-40 w-full gap-8 rounded px-12 text-light-gray-800 transition-colors flex-justify-start hover:bg-light-secondary-200'
						>
							<span className='size-24 flex-justify-center'>
								<SettingSVG className='text-light-gray-700' width='2.2rem' height='2.2rem' />
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
							className='h-40 w-full gap-8 rounded px-12 text-light-error-100 transition-colors flex-justify-start hover:bg-light-error-100 hover:text-white'
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

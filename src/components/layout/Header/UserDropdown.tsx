import { EditSVG, LogoutSVG, SessionHistorySVG, SettingSVG, UserCircleSVG } from '@/components/icons';
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
			<div className='flex items-start justify-between pb-8 pr-16'>
				<div className='gap-12 pt-16 flex-items-center fit-image'>
					<div
						className='size-40 rounded-circle fit-image'
						style={{ backgroundImage: 'url("/static/images/young-boy.png")' }}
					/>

					<div className='gap-4 flex-column'>
						<h3 className='text-base font-medium text-gray-1000'>{customerTitle}</h3>
						<span className='text-tiny text-gray-700'>{userData?.mobile ?? '−'}</span>
					</div>
				</div>

				<button className='p-16 text-gray-900 transition-colors hover:text-primary-300' type='button'>
					<EditSVG width='2rem' height='2rem' />
				</button>
			</div>

			<div className='flex-col gap-8 px-16 flex-items-center'>
				{userData?.hasPassword === false && (
					<button
						type='button'
						onClick={resetPassword}
						className='h-36 w-full rounded border border-primary-400 text-tiny font-medium text-primary-400 transition-colors flex-justify-center hover:bg-primary-400 hover:text-white'
					>
						{t('header.set_password')}
					</button>
				)}

				{hasBroker ? (
					<button
						type='button'
						onClick={() => logoutBroker(close)}
						className='h-36 w-full rounded border border-error-100 text-tiny font-medium text-error-100 transition-colors flex-justify-center hover:bg-error-100 hover:text-white'
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
						className='h-36 w-full rounded border border-primary-400 text-tiny font-medium text-primary-400 transition-colors flex-justify-center hover:bg-primary-400 hover:text-white'
					>
						{t('header.login_broker')}
					</button>
				)}
			</div>

			<nav className='gap-16 px-8 flex-column'>
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
							<SessionHistorySVG className='text-gray-900' width='1.6rem' height='1.6rem' />
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
							onClick={() => {
								logout();
								close();
							}}
							type='button'
							className='h-40 w-full gap-12 rounded px-12 text-error-100 transition-colors flex-justify-start hover:bg-error-100 hover:text-white'
						>
							<LogoutSVG width='1.6rem' height='1.6rem' />
							<span>{t('header.logout')}</span>
						</button>
					</li>
				</ul>
			</nav>
		</div>
	);
};

export default UserDropdown;

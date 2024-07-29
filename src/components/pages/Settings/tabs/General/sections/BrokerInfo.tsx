import {
	AuthenticationSVG,
	ChangeNameSVG,
	EditFillSVG,
	IdentityCardSVG,
	InfoCircleSVG,
	KeySVG,
	MailSVG,
	MobileSVG,
	NoSVG,
	UserBoldSVG,
} from '@/components/icons';
import { useAppDispatch } from '@/features/hooks';
import { setConfirmModal } from '@/features/slices/modalSlice';
import { useUserInfo } from '@/hooks';
import { useTranslations } from 'next-intl';
import SettingCardField from '../../../components/SettingCardField';
import SettingCardFieldValue from '../../../components/SettingCardFieldValue';

const BrokerInfo = () => {
	const t = useTranslations();

	const { data: userInfo } = useUserInfo();

	const dispatch = useAppDispatch();

	const fields = [
		{
			icon: <UserBoldSVG />,
			title: `${t('settings_page.name')}:`,
			value: <SettingCardFieldValue value={userInfo?.customerTitle || '-'} />,
		},
		{
			icon: <IdentityCardSVG />,
			title: `${t('settings_page.national_code')}:`,
			value: <SettingCardFieldValue value={userInfo?.nationalCode || '-'} />,
		},
		{
			icon: <NoSVG width={'2.4rem'} height={'2.4rem'} />,
			title: `${t('settings_page.bourse_code')}:`,
			value: <SettingCardFieldValue value={userInfo?.bourseCode || '-'} />,
		},
		{
			icon: <ChangeNameSVG />,
			title: `${t('settings_page.username')}:`,
			value: <SettingCardFieldValue value={userInfo?.userName || '-'} />,
		},
		{
			icon: <MobileSVG />,
			title: `${t('settings_page.phone_number')}:`,
			value: <SettingCardFieldValue value={userInfo?.mobilePhone || '-'} />,
		},
		{
			icon: <MailSVG />,
			title: `${t('settings_page.email')}:`,
			value: <SettingCardFieldValue value={userInfo?.email || '-'} />,
		},
		{
			icon: <KeySVG />,
			title: `${t('settings_page.password')}:`,
			value: (
				<span className='gap-8 flex-justify-center'>
					<SettingCardFieldValue value='***************' />
					<button className='text-gray-700' onClick={() => {}}>
						<EditFillSVG width={'1.8rem'} height={'1.8rem'} />
					</button>
				</span>
			),
		},
		{
			icon: <AuthenticationSVG />,
			prefixIcon: (
				<span
					onClick={() =>
						dispatch(
							setConfirmModal({
								confirm: { label: t('settings_page.noticed'), type: 'primary' },
								description: t('settings_page.two_step_login_description'),
								title: `${t('settings_page.two_step_login')}:`,
							}),
						)
					}
				>
					<InfoCircleSVG width={'2rem'} height={'2rem'} className={'text-secondary-300 cursor-pointer'} />
				</span>
			),
			title: `${t('settings_page.two_step_login')}:`,
			value: <button className='rounded px-16 py-4 btn-primary'>{t('settings_page.activation')}</button>,
		},
	];

	return (
		<div className='grid grid-cols-2 gap-x-88 gap-y-24'>
			{fields.map((item, index) => (
				<SettingCardField key={index} {...item} />
			))}
		</div>
	);
};

export default BrokerInfo;

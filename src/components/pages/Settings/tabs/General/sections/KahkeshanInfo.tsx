'use client';
import { useUserInformationQuery } from '@/api/queries/userQueries';
import { EditFillSVG, KeySVG, MobileSVG } from '@/components/icons';
import { useTranslations } from 'next-intl';
import SettingCardField from '../../../components/SettingCardField';
import SettingCardFieldValue from '../../../components/SettingCardFieldValue';

interface KahkeshanInfoProps {
	isLoggedIn: boolean;
}

const KahkeshanInfo = ({ isLoggedIn }: KahkeshanInfoProps) => {
	const t = useTranslations();

	const { data: userData } = useUserInformationQuery({
		queryKey: ['userInformationQuery'],
		enabled: isLoggedIn,
	});

	const fields = [
		{
			icon: <MobileSVG />,
			title: t('settings_page.phone_number'),
			node: <SettingCardFieldValue value={userData?.mobile || '-'} />,
		},
		{
			icon: <KeySVG />,
			title: t('settings_page.password'),
			node: (
				<span className='gap-8 flex-justify-center'>
					<SettingCardFieldValue value='***************' />
					<button className='text-gray-900' onClick={() => {}}>
						<EditFillSVG width={'1.8rem'} height={'1.8rem'} />
					</button>
				</span>
			),
		},
	];

	return (
		<div className='grid grid-cols-2 gap-32'>
			{fields.map((item, index) => (
				<SettingCardField key={index} {...item} />
			))}
		</div>
	);
};

export default KahkeshanInfo;

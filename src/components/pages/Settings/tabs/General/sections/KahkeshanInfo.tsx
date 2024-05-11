'use client';
import { EditFillSVG, KeySVG, MobileSVG } from '@/components/icons';
import { useTranslations } from 'next-intl';

interface IFieldProps {
	icon: ReactNode;
	title: string;
	node: ReactNode;
}

const KahkeshanInfo = () => {
	const t = useTranslations();

	const fields = [
		// {
		// 	icon: <UserBoldSVG />,
		// 	title: t('settings_page.name'),
		// 	node: <FieldValue value={'تست'} />,
		// },
		// {
		// 	icon: <IdentityCardSVG />,
		// 	title: t('settings_page.natinal_code'),
		// 	node: <FieldValue value={'تست'} />,
		// },
		// {
		// 	icon: <NoSVG width={'2.4rem'} height={'2.4rem'} />,
		// 	title: t('settings_page.bourse_code'),
		// 	node: <FieldValue value={'تست'} />,
		// },
		// {
		// 	icon: <ChangeNameSVG />,
		// 	title: t('settings_page.username'),
		// 	node: <FieldValue value={'تست'} />,
		// },
		{
			icon: <MobileSVG />,
			title: t('settings_page.phone_number'),
			node: <FieldValue value={'تست'} />,
		},
		// {
		// 	icon: <MailSVG />,
		// 	title: t('settings_page.email'),
		// 	node: <FieldValue value={'تست'} />,
		// },
		{
			icon: <KeySVG />,
			title: t('settings_page.password'),
			node: (
				<span className='gap-8 flex-justify-center'>
					<FieldValue value='***************' />
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
				<Field key={index} {...item} />
			))}
		</div>
	);
};

const Field = ({ icon, title, node }: IFieldProps) => {
	return (
		<div className='flex-justify-between'>
			<span className='gap-8 text-gray-900 flex-justify-center'>
				{icon}
				{title + ':'}
			</span>
			<span>{node}</span>
		</div>
	);
};

const FieldValue = ({ value }: { value: string }) => <p className='text-gray-1000'>{value}</p>;

export default KahkeshanInfo;

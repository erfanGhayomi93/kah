import { useAppSelector } from '@/features/hooks';
import { getLsStatus } from '@/features/slices/uiSlice';
import { useTranslations } from 'next-intl';
import { useLayoutEffect } from 'react';

const Footer = () => {
	const t = useTranslations();

	const lsStatus = useAppSelector(getLsStatus);

	useLayoutEffect(() => {
		console.log(lsStatus);
	}, [lsStatus]);

	return (
		<footer className='h-36 bg-gray-200 px-32 flex-justify-between'>
			<span className='text-tiny font-normal text-gray-1000'>{t('footer.copyright')}</span>
		</footer>
	);
};

export default Footer;

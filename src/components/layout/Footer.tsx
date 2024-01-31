import { useTranslations } from 'next-intl';
import { useMemo } from 'react';

const Footer = () => {
	const t = useTranslations();

	const year = useMemo(() => new Date().getFullYear(), []);

	return (
		<footer className='h-36 bg-gray-200 px-32 flex-justify-between'>
			<span className='text-gray-1000 text-tiny font-normal'>{t('footer.copyright')}</span>
			<span className='text-gray-1000 text-tiny font-normal'>Copyright © {year} Ramandtech</span>
		</footer>
	);
};

export default Footer;

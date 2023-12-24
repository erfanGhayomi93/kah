import { useTranslations } from 'next-intl';
import { useMemo } from 'react';

const Footer = () => {
	const t = useTranslations();

	const year = useMemo(() => new Date().getFullYear(), []);

	return (
		<footer className='h-36 bg-black px-32 flex-justify-between'>
			<span className='text-tiny font-normal text-white'>{t('footer.copyright')}</span>
			<span className='text-tiny font-normal text-white'>Copyright © {year} Ramandtech</span>
		</footer>
	);
};

export default Footer;

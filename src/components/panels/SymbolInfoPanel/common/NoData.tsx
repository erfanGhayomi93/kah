import { useTranslations } from 'next-intl';
import Image from 'next/image';

const NoData = () => {
	const t = useTranslations();

	return (
		<div className='size-full flex-justify-center'>
			<div className='items-center gap-8 flex-column'>
				<Image width='118' height='118' quality='100' alt='no data' src='/static/images/search-file.png' />
				<span className='text-base text-gray-900'>{t('common.no_data')}</span>
			</div>
		</div>
	);
};

export default NoData;

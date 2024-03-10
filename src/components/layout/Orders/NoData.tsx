import { useTranslations } from 'next-intl';
import Image from 'next/image';

const NoData = () => {
	const t = useTranslations();

	return (
		<div className='absolute left-0 size-full flex-justify-center' style={{ top: '24px', zIndex: 9 }}>
			<div className='items-center gap-8 flex-column'>
				<Image width='64' height='64' alt='welcome' src='/static/images/no-data.png' />
				<span className='text-tiny font-medium text-gray-900'>{t('common.no_data')}</span>
			</div>
		</div>
	);
};

export default NoData;

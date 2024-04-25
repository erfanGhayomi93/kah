import { useTranslations } from 'next-intl';
import Image from 'next/image';

interface NoDataProps {
	imgSrc?: string;
	text?: string;
}

const NoData = ({ text, imgSrc }: NoDataProps) => {
	const t = useTranslations();

	return (
		<div className='size-full flex-justify-center'>
			<div className='items-center flex-column'>
				<Image
					priority
					width='118'
					height='118'
					alt='no data'
					src={imgSrc ?? '/static/images/search-file.png'}
				/>
				<span className='text-base text-gray-900'>{text ?? t('common.no_data')}</span>
			</div>
		</div>
	);
};

export default NoData;

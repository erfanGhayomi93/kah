import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import Image from 'next/image';

interface NoDataProps {
	imgName?: string;
	text?: React.ReactNode;
	width?: number;
	height?: number;
	className?: string;
}

const NoData = ({ text, imgName = 'search-file.png', width = 118, height = 118, className }: NoDataProps) => {
	const t = useTranslations('common');

	return (
		<div className={clsx('size-full flex-justify-center', className)}>
			<div className='items-center gap-4 flex-column'>
				<Image
					priority
					width={width}
					height={height}
					quality={90}
					alt='no data'
					src={`/static/images/${imgName}`}
				/>
				{text !== null && <span className='text-light-gray-700 text-base'>{text ?? t('no_data')}</span>}
			</div>
		</div>
	);
};

export default NoData;

import { useAppSelector } from '@/features/hooks';
import { getTheme } from '@/features/slices/uiSlice';
import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import Image from 'next/image';

interface NoDataProps {
	imgName?: string;
	imgExt?: string;
	text?: React.ReactNode;
	width?: number;
	height?: number;
	className?: string;
}

const NoData = ({ text, imgName = 'no-data', imgExt = 'svg', width = 118, height = 118, className }: NoDataProps) => {
	const t = useTranslations('common');

	const theme = useAppSelector(getTheme);

	const pathname = '/static/images';

	return (
		<div className={clsx('size-full flex-justify-center', className)}>
			<div className='items-center gap-4 flex-column'>
				<Image
					priority
					width={width}
					height={height}
					quality={90}
					alt='no data'
					src={`${pathname}/${imgName}-${theme}.${imgExt}`}
				/>
				{text !== null && <span className='text-base text-gray-700'>{text ?? t('no_data')}</span>}
			</div>
		</div>
	);
};

export default NoData;

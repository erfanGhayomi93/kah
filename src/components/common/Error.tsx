import { useTheme } from '@/hooks';
import { clsx } from 'clsx';
import { useTranslations } from 'next-intl';
import Image from 'next/image';

interface ErrorProps {
	action?: () => void;
	text?: React.ReactNode;
	width?: number;
	height?: number;
	className?: string;
}

const Error = ({ text, width = 118, height = 118, className, action }: ErrorProps) => {
	const t = useTranslations('common');

	const theme = useTheme();

	return (
		<div className={clsx('size-full flex-justify-center', className)}>
			<div className='items-center gap-16 flex-column'>
				<Image
					priority
					width={width}
					height={height}
					quality={90}
					alt='no data'
					src={`/static/images/server-error-${theme}.png`}
				/>

				<div className='gap-8 flex-column'>
					{text !== null && <span className='text-base text-gray-700'>{text ?? t('an_error_occurred')}</span>}
					{(typeof action === 'function') !== null && (
						<button onClick={action} type='button' className='text-base text-info-100'>
							{text ?? t('try_again')}
						</button>
					)}
				</div>
			</div>
		</div>
	);
};

export default Error;

import Tooltip from '@/components/common/Tooltip';
import { InfoCircleSVG } from '@/components/icons';
import clsx from 'clsx';

interface FilterProps {
	title: string;
	titleHint?: string;
	children?: React.ReactNode;
	className?: string;
}

const Filter = ({ title, titleHint, children, className }: FilterProps) => (
	<li className={clsx('flex-justify-between', className)}>
		<div className='gap-8 flex-justify-start'>
			<h3 className='text-gray-700'>{title}:</h3>
			{titleHint && (
				<Tooltip placement='top' content={titleHint}>
					<span className='cursor-pointer'>
						<InfoCircleSVG width='1.8rem' height='1.8rem' className='text-info-100' />
					</span>
				</Tooltip>
			)}
		</div>

		<div className='flex h-full flex-328 gap-8'>{children}</div>
	</li>
);

export default Filter;

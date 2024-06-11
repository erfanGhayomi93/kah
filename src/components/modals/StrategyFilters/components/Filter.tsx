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
			<h3 className='text-gray-900'>{title}:</h3>
			{titleHint && (
				<Tooltip placement='top' content={titleHint}>
					<span className='cursor-pointer'>
						<InfoCircleSVG width='1.8rem' height='1.8rem' className='text-info' />
					</span>
				</Tooltip>
			)}
		</div>

		<div style={{ flex: '0 0 32.8rem' }} className='flex h-full gap-8'>
			{children}
		</div>
	</li>
);

export default Filter;

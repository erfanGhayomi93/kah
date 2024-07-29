import clsx from 'clsx';

interface StrategyInfoItemProps {
	type?: 'success' | 'error';
	title: string;
	value: React.ReactNode;
}

const StrategyInfoItem = ({ title, value, type }: StrategyInfoItemProps) => {
	return (
		<li style={{ flex: '0 0 12.8rem' }} className='items-start gap-4 flex-column'>
			<span className='text-gray-700 text-base'>{title}</span>
			<div
				style={{ width: '10.4rem' }}
				className={clsx('h-40 w-full rounded px-8 ltr flex-justify-end', {
					'bg-gray-100 text-gray-700': !type,
					'bg-success-100/10 text-success-100': type === 'success',
					'bg-error-100/10 text-error-100': type === 'error',
				})}
			>
				{value}
			</div>
		</li>
	);
};

export default StrategyInfoItem;

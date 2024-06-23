import clsx from 'clsx';

interface StrategyInfoItemProps {
	type?: 'success' | 'error';
	title: string;
	value: React.ReactNode;
}

const StrategyInfoItem = ({ title, value, type }: StrategyInfoItemProps) => {
	return (
		<li style={{ flex: '0 0 12.8rem' }} className='items-start gap-4 flex-column'>
			<span className='text-base text-light-gray-700'>{title}</span>
			<div
				style={{ width: '10.4rem' }}
				className={clsx('h-40 w-full rounded px-8 ltr flex-justify-end', {
					'bg-light-gray-100 text-light-gray-700': !type,
					'bg-light-success-100/10 text-light-success-100': type === 'success',
					'bg-light-error-100/10 text-light-error-100': type === 'error',
				})}
			>
				{value}
			</div>
		</li>
	);
};

export default StrategyInfoItem;

import clsx from 'clsx';

interface SettingCardProps {
	title: string | React.ReactNode;
	children?: React.ReactNode;
	className?: string;
}

const SettingCard = ({ title, children, className }: SettingCardProps) => {
	return (
		<div className={clsx('gap-16 rounded bg-gray-200 p-24 flex-column', className)}>
			<p className='text-lg font-medium text-gray-900'>{title}</p>
			{children}
		</div>
	);
};

export default SettingCard;

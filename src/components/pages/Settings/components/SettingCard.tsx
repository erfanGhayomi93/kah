import clsx from 'clsx';

interface SettingCardProps {
	title: string | React.ReactNode;
	children?: React.ReactNode;
	className?: ClassesValue;
}

const SettingCard = ({ title, children, className }: SettingCardProps) => {
	return (
		<div className={clsx('bg-gray-100 gap-16 rounded p-16 flex-column', className)}>
			<p className='text-gray-700 text-lg font-medium'>{title}</p>
			{children}
		</div>
	);
};

export default SettingCard;

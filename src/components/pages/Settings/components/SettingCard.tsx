type TProps = {
	title: string;
	children: ReactNode;
	className?: string;
};

const SettingCard = ({ title, children, className = '' }: TProps) => {
	return (
		<div className={`gap-16 rounded bg-gray-200 p-24 flex-column ${className}`}>
			<p className='text-lg font-medium text-gray-900'>{title}</p>
			{children}
		</div>
	);
};

export default SettingCard;

interface IFieldProps {
	icon: React.ReactNode;
	title: string | React.ReactNode;
	node: React.ReactNode;
	prefixIcon?: React.ReactNode;
}

const SettingCardField = ({ icon, title, node, prefixIcon }: IFieldProps) => {
	return (
		<div className='flex-justify-between'>
			<span className='gap-8 text-gray-900 flex-justify-center'>
				{icon}
				{title + ':'}
				{prefixIcon && prefixIcon}
			</span>
			<span>{node}</span>
		</div>
	);
};

export default SettingCardField;

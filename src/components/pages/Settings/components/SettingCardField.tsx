import clsx from 'clsx';

interface IFieldProps {
	icon?: React.ReactNode;
	title: string | React.ReactNode;
	node: React.ReactNode;
	prefixIcon?: React.ReactNode;
	colon?: boolean;
	titleClass?: string;
	valueClass?: string;
}

const SettingCardField = ({ icon, title, node, prefixIcon, colon = true, titleClass, valueClass }: IFieldProps) => {
	return (
		<div className='flex-justify-between'>
			<span className={clsx('gap-8 text-gray-900 flex-justify-center', titleClass)}>
				{icon}
				{title + (colon ? ':' : '')}
				{prefixIcon && prefixIcon}
			</span>
			<span className={valueClass}>{node}</span>
		</div>
	);
};

export default SettingCardField;

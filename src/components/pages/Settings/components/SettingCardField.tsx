import clsx from 'clsx';

interface ISettingCardField {
	icon?: React.ReactNode;
	title: React.ReactNode;
	value: React.ReactNode;
	prefixIcon?: React.ReactNode;
	titleClass?: ClassesValue;
	valueClass?: ClassesValue;
}

const SettingCardField = ({ icon, title, value, prefixIcon, titleClass, valueClass }: ISettingCardField) => {
	return (
		<div className='flex-justify-between'>
			<span className={clsx('gap-8 text-gray-900 flex-justify-center', titleClass)}>
				{icon}
				{title}
				{prefixIcon && prefixIcon}
			</span>
			<span className={clsx(valueClass)}>{value}</span>
		</div>
	);
};

export default SettingCardField;

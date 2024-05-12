import { NotificationSVG } from '@/components/icons';
import clsx from 'clsx';
import { useTranslations } from 'next-intl';

const NotificationPlacement = () => {
	const t = useTranslations();

	const buttons = [
		{
			title: t('settings_page.bottom_left'),
			id: 'bottom_left',
			className: 'bottom-0 left-8',
		},
		{
			title: t('settings_page.bottom_right'),
			id: 'bottom_right',
			className: 'bottom-0 right-8',
		},
		{
			title: t('settings_page.top_left'),
			id: 'top_left',
			className: 'top-0 left-8',
		},
		{
			title: t('settings_page.top_right'),
			id: 'top_right',
			className: 'top-0 right-8',
		},
	];

	return (
		<div className='gap-16 flex-justify-between'>
			{buttons.map((item) => (
				<button
					key={item.id}
					className={clsx(
						'relative flex-1  rounded-md py-48 transition-colors flex-justify-center',
						item.id === 'bottom_left' ? 'bg-primary-100' : '!border border-gray-500 hover:btn-hover',
					)}
				>
					<span
						className={clsx(
							'absolute ' + item.className,
							item.id === 'bottom_left' ? 'text-primary-400' : 'text-gray-500',
						)}
					>
						{<NotificationSVG width={'3.9rem'} height={'3.9rem'} />}
					</span>
					{item.title}
				</button>
			))}
		</div>
	);
};

export default NotificationPlacement;

import { MonitorSVG, MoonSVG, SunSVG } from '@/components/icons';
import clsx from 'clsx';
import { useTranslations } from 'next-intl';

const Theme = () => {
	const t = useTranslations();

	const buttons = [
		{ title: t('settings_page.light'), id: 'light', icon: <SunSVG width={'2rem'} height={'2rem'} /> },
		{ title: t('settings_page.dark'), id: 'dark', icon: <MoonSVG /> },
		{ title: t('settings_page.system'), id: 'system', icon: <MonitorSVG width={'2rem'} height={'2rem'} /> },
	];

	return (
		<>
			{buttons.map((item) => (
				<button
					key={item.id}
					className={clsx(
						'h-40 flex-1 gap-8 rounded  text-base transition-colors flex-justify-center',
						item.id === 'light' ? 'bg-primary-100 text-primary-400' : 'text-gray-900 hover:btn-hover',
					)}
				>
					{item.icon}
					{item.title}
				</button>
			))}
		</>
	);
};

export default Theme;

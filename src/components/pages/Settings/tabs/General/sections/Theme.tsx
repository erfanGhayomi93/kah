import { MonitorSVG, MoonSVG, ShiningStarSVG, SunSVG } from '@/components/icons';
import { useAppDispatch, useAppSelector } from '@/features/hooks';
import { getTheme, setTheme } from '@/features/slices/uiSlice';
import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import React from 'react';

const Theme = () => {
	const t = useTranslations();

	const dispatch = useAppDispatch();

	const theme = useAppSelector(getTheme);

	const onChangeTheme = (v: TTheme) => {
		dispatch(setTheme(v));
	};

	const buttons: Array<{ title: string; id: TTheme; icon: React.ReactNode }> = [
		{ title: t('themes.light'), id: 'light', icon: <SunSVG width='2rem' height='2rem' /> },
		{ title: t('themes.dark'), id: 'dark', icon: <ShiningStarSVG /> },
		{ title: t('themes.darkBlue'), id: 'darkBlue', icon: <MoonSVG /> },
		{ title: t('themes.system'), id: 'system', icon: <MonitorSVG width='2rem' height='2rem' /> },
	];

	return (
		<div className='gap-x-96 flex-justify-between'>
			{buttons.map((item) => (
				<button
					key={item.id}
					onClick={() => onChangeTheme(item.id)}
					className={clsx(
						'no-hover h-40 flex-1 gap-8 rounded text-base transition-colors flex-justify-center',
						item.id === theme ? 'btn-select' : 'text-gray-700 hover:btn-hover dark:hover:bg-secondary-200',
					)}
				>
					{item.icon}
					{item.title}
				</button>
			))}
		</div>
	);
};

export default Theme;

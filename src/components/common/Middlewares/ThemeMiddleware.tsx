'use client';

import { useAppDispatch } from '@/features/hooks';
import { setTheme } from '@/features/slices/uiSlice';
import { getTheme, setCookieTheme } from '@/utils/cookie';
import { getDeviceColorSchema } from '@/utils/helpers';
import { useEffect } from 'react';

interface ThemeMiddlewareProps {
	children: React.ReactNode;
}

const ThemeMiddleware = ({ children }: ThemeMiddlewareProps) => {
	const dispatch = useAppDispatch();

	useEffect(() => {
		try {
			let cookieTheme = getTheme();
			const deviceTheme = getDeviceColorSchema();

			if (
				!cookieTheme ||
				(cookieTheme !== 'light' &&
					cookieTheme !== 'dark' &&
					cookieTheme !== 'darkBlue' &&
					cookieTheme !== 'system')
			) {
				cookieTheme = 'system';
				setCookieTheme('system');
			}

			dispatch(setTheme(cookieTheme as TTheme));
		} catch (e) {
			//
		}
	}, []);

	return children;
};

export default ThemeMiddleware;

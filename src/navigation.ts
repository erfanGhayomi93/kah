import { createSharedPathnamesNavigation } from 'next-intl/navigation';

export const locales = ['fa'] as const;
export const localePrefix = 'always';
export type Locales = typeof locales;

export const { Link, redirect, usePathname, useRouter, permanentRedirect } = createSharedPathnamesNavigation({
	locales,
	localePrefix,
});

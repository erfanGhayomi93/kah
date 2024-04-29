import '@/assets/styles/app.scss';
import '@/assets/styles/libs.scss';
import NextIntlClientRegistry from '@/components/common/Registry/NextIntlClientRegistry';
import Providers from '@/components/layout/Providers';
import Wrapper from '@/components/layout/Wrapper';
import metadata from '@/metadata';
import { locales } from '@/navigation';
import { getDirection } from '@/utils/helpers';
import { unstable_setRequestLocale } from 'next-intl/server';
import dynamic from 'next/dynamic';

const Modals = dynamic(() => import('@/components/modals/Modals'), {
	ssr: false,
});

const Panels = dynamic(() => import('@/components/panels/Panels'), {
	ssr: false,
});

interface ILayout extends INextProps {}

const Layout = async ({ children, params: { locale = 'fa' } }: ILayout) => {
	unstable_setRequestLocale(locale);

	return (
		<html lang={locale} dir={getDirection(locale)}>
			<NextIntlClientRegistry>
				<body>
					<Providers>
						<Wrapper>{children}</Wrapper>
						<Modals />
						<Panels />
					</Providers>

					<div id='__tooltip' />
				</body>
			</NextIntlClientRegistry>
		</html>
	);
};

export function generateStaticParams() {
	return locales.map((locale) => ({ locale }));
}

export default Layout;

export { metadata };

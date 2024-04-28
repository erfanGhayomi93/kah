import '@/assets/styles/app.scss';
import '@/assets/styles/libs.scss';
import NextIntlClientRegistry from '@/components/common/Registry/NextIntlClientRegistry';
import Providers from '@/components/layout/Providers';
import Wrapper from '@/components/layout/Wrapper';
import metadata from '@/metadata';
import { getDirection } from '@/utils/helpers';
import dynamic from 'next/dynamic';

const Modals = dynamic(() => import('@/components/modals/Modals'), {
	ssr: false,
});

const Panels = dynamic(() => import('@/components/panels/Panels'), {
	ssr: false,
});

interface ILayout extends INextProps<{ locale: string }> {
	children: React.ReactNode;
}

const Layout = async ({ children, params: { locale = 'fa' } }: ILayout) => {
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

export default Layout;

export { metadata };

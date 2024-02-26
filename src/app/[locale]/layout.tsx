import '@/assets/styles/app.scss';
import '@/assets/styles/libs.scss';
import NextIntlClientRegistry from '@/components/common/Registry/NextIntlClientRegistry';
import Providers from '@/components/layout/Providers';
import Wrapper from '@/components/layout/Wrapper';
import Modals from '@/components/modals/Modals';
import metadata from '@/metadata';
import { getDirection } from '@/utils/helpers';

interface IRootLayout extends INextProps {
	children: React.ReactNode;
	params: {
		locale: string;
	};
}

const RootLayout = async ({ children, params: { locale = 'fa' } }: IRootLayout) => {
	return (
		<html lang={locale} dir={getDirection(locale)}>
			<NextIntlClientRegistry>
				<body>
					<Providers>
						<Wrapper>{children}</Wrapper>
						<Modals />
					</Providers>

					<div id='__tooltip' />
				</body>
			</NextIntlClientRegistry>
		</html>
	);
};

export default RootLayout;

export { metadata };

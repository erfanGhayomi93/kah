import '@/assets/styles/app.scss';
import '@/assets/styles/libs.scss';
import NextIntlClientRegistry from '@/components/common/NextIntlClientRegistry';
import QueryClientRegistry from '@/components/common/QueryClientRegistry';
import ReduxToolkitRegistry from '@/components/common/ReduxToolkitRegistry';
import StyledComponentsRegistry from '@/components/common/StyledComponentsRegistry';
import Wrapper from '@/components/layout/Wrapper';
import Modals from '@/components/modals/Modals';
import WatchlistColumnsProvider from '@/contexts/WatchlistColumnsContext';
import { getDirection } from '@/utils/helpers';
import metadata from '../../metadata';

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
					<StyledComponentsRegistry>
						<QueryClientRegistry>
							<ReduxToolkitRegistry>
								<WatchlistColumnsProvider>
									<Wrapper>{children}</Wrapper>
									<Modals />
								</WatchlistColumnsProvider>
							</ReduxToolkitRegistry>
						</QueryClientRegistry>
					</StyledComponentsRegistry>

					<div id='__tooltip' />
				</body>
			</NextIntlClientRegistry>
		</html>
	);
};

export default RootLayout;

export { metadata };

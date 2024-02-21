import '@/assets/styles/app.scss';
import '@/assets/styles/libs.scss';
import BroadcastChannelRegistry from '@/components/common/BroadcastChannelRegistry';
import LightstreamRegistry from '@/components/common/LightstreamRegistry';
import NextIntlClientRegistry from '@/components/common/NextIntlClientRegistry';
import QueryClientRegistry from '@/components/common/QueryClientRegistry';
import ReduxToolkitRegistry from '@/components/common/ReduxToolkitRegistry';
import StyledComponentsRegistry from '@/components/common/StyledComponentsRegistry';
import ToastRegistry from '@/components/common/ToastRegistry';
import Wrapper from '@/components/layout/Wrapper';
import Modals from '@/components/modals/Modals';
import ClockProvider from '@/contexts/ClockContext';
import WatchlistColumnsProvider from '@/contexts/WatchlistColumnsContext';
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
					<StyledComponentsRegistry>
						<QueryClientRegistry>
							<ReduxToolkitRegistry>
								<LightstreamRegistry>
									<BroadcastChannelRegistry>
										<ClockProvider>
											<WatchlistColumnsProvider>
												<ToastRegistry>
													<Wrapper>{children}</Wrapper>
													<Modals />
												</ToastRegistry>
											</WatchlistColumnsProvider>
										</ClockProvider>
									</BroadcastChannelRegistry>
								</LightstreamRegistry>
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

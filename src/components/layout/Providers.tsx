import BroadcastChannelRegistry from '@/components/common/Registry/BroadcastChannelRegistry';
import LightstreamRegistry from '@/components/common/Registry/LightstreamRegistry';
import QueryClientRegistry from '@/components/common/Registry/QueryClientRegistry';
import ReduxToolkitRegistry from '@/components/common/Registry/ReduxToolkitRegistry';
import StyledComponentsRegistry from '@/components/common/Registry/StyledComponentsRegistry';
import ToastRegistry from '@/components/common/ToastRegistry';
import ClockProvider from '@/contexts/ClockContext';
import WatchlistColumnsProvider from '@/contexts/WatchlistColumnsContext';
import AppMiddleware from '../common/Middlewares/AppMiddleware';

interface ProvidersProps {
	children: React.ReactNode;
}

const Providers = ({ children }: ProvidersProps) => {
	return (
		<StyledComponentsRegistry>
			<QueryClientRegistry>
				<ReduxToolkitRegistry>
					<LightstreamRegistry>
						<BroadcastChannelRegistry>
							<ClockProvider>
								<WatchlistColumnsProvider>
									<ToastRegistry>
										<AppMiddleware>{children}</AppMiddleware>
									</ToastRegistry>
								</WatchlistColumnsProvider>
							</ClockProvider>
						</BroadcastChannelRegistry>
					</LightstreamRegistry>
				</ReduxToolkitRegistry>
			</QueryClientRegistry>
		</StyledComponentsRegistry>
	);
};

export default Providers;

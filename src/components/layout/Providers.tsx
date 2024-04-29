import BroadcastChannelRegistry from '@/components/common/Registry/BroadcastChannelRegistry';
import QueryClientRegistry from '@/components/common/Registry/QueryClientRegistry';
import StyledComponentsRegistry from '@/components/common/Registry/StyledComponentsRegistry';
import ToastRegistry from '@/components/common/Registry/ToastRegistry';
import ClockProvider from '@/contexts/ClockContext';
import WatchlistColumnsProvider from '@/contexts/WatchlistColumnsContext';
import dynamic from 'next/dynamic';
import AppMiddleware from '../common/Middlewares/AppMiddleware';
import OMSRegistry from '../common/Registry/OMSRegistry';

const LightstreamRegistry = dynamic(() => import('../common/Registry/LightstreamRegistry'), {
	ssr: false,
});

const ReduxToolkitRegistry = dynamic(() => import('../common/Registry/ReduxToolkitRegistry'), {
	ssr: false,
});

interface ProvidersProps {
	children: React.ReactNode;
}

const Providers = ({ children }: ProvidersProps) => {
	return (
		<StyledComponentsRegistry>
			<QueryClientRegistry>
				<ReduxToolkitRegistry>
					<LightstreamRegistry>
						<AppMiddleware>
							<OMSRegistry />
							<BroadcastChannelRegistry>
								<ClockProvider>
									<WatchlistColumnsProvider>
										<ToastRegistry>{children}</ToastRegistry>
									</WatchlistColumnsProvider>
								</ClockProvider>
							</BroadcastChannelRegistry>
						</AppMiddleware>
					</LightstreamRegistry>
				</ReduxToolkitRegistry>
			</QueryClientRegistry>
		</StyledComponentsRegistry>
	);
};

export default Providers;

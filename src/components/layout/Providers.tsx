import BroadcastChannelRegistry from '@/components/common/Registry/BroadcastChannelRegistry';
import QueryClientRegistry from '@/components/common/Registry/QueryClientRegistry';
import ReduxToolkitRegistry from '@/components/common/Registry/ReduxToolkitRegistry';
import StyledComponentsRegistry from '@/components/common/Registry/StyledComponentsRegistry';
import ToastRegistry from '@/components/common/ToastRegistry';
import WatchlistColumnsProvider from '@/contexts/WatchlistColumnsContext';
import dynamic from 'next/dynamic';
import AppMiddleware from '../common/Middlewares/AppMiddleware';
import OMSMessages from '../common/Middlewares/OMSMessages';

const LightstreamRegistry = dynamic(() => import('../common/Registry/LightstreamRegistry'), {
	ssr: false,
});

const ClockProvider = dynamic(() => import('@/contexts/ClockContext'), {
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
						<BroadcastChannelRegistry>
							<OMSMessages>
								<ClockProvider>
									<WatchlistColumnsProvider>
										<ToastRegistry>
											<AppMiddleware>{children}</AppMiddleware>
										</ToastRegistry>
									</WatchlistColumnsProvider>
								</ClockProvider>
							</OMSMessages>
						</BroadcastChannelRegistry>
					</LightstreamRegistry>
				</ReduxToolkitRegistry>
			</QueryClientRegistry>
		</StyledComponentsRegistry>
	);
};

export default Providers;

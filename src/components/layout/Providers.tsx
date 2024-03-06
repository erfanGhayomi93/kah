import BroadcastChannelRegistry from '@/components/common/Registry/BroadcastChannelRegistry';
import QueryClientRegistry from '@/components/common/Registry/QueryClientRegistry';
import ReduxToolkitRegistry from '@/components/common/Registry/ReduxToolkitRegistry';
import StyledComponentsRegistry from '@/components/common/Registry/StyledComponentsRegistry';
import ToastRegistry from '@/components/common/ToastRegistry';
import WatchlistColumnsProvider from '@/contexts/WatchlistColumnsContext';
import dynamic from 'next/dynamic';

const LightstreamRegistry = dynamic(() => import('../common/Registry/LightstreamRegistry'), {
	ssr: false,
});

const OMSMiddleware = dynamic(() => import('../common/Middlewares/OMSMiddleware'), {
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
						<OMSMiddleware>
							<BroadcastChannelRegistry>
								<ClockProvider>
									<WatchlistColumnsProvider>
										<ToastRegistry>{children}</ToastRegistry>
									</WatchlistColumnsProvider>
								</ClockProvider>
							</BroadcastChannelRegistry>
						</OMSMiddleware>
					</LightstreamRegistry>
				</ReduxToolkitRegistry>
			</QueryClientRegistry>
		</StyledComponentsRegistry>
	);
};

export default Providers;

import AppMiddleware from '@/components/common/Middlewares/AppMiddleware';
import BroadcastChannelRegistry from '@/components/common/Registry/BroadcastChannelRegistry';
import OMSRegistry from '@/components/common/Registry/OMSRegistry';
import QueryClientRegistry from '@/components/common/Registry/QueryClientRegistry';
import StyledComponentsRegistry from '@/components/common/Registry/StyledComponentsRegistry';
import ToastRegistry from '@/components/common/Registry/ToastRegistry';
import ClockProvider from '@/contexts/ClockContext';
import WatchlistColumnsProvider from '@/contexts/WatchlistColumnsContext';
import dynamic from 'next/dynamic';

const LightstreamRegistry = dynamic(() => import('@/components/common/Registry/LightstreamRegistry'), {
	ssr: false,
});

const ReduxToolkitRegistry = dynamic(() => import('@/components/common/Registry/ReduxToolkitRegistry'), {
	ssr: false,
});

interface ProvidersProps {
	children: React.ReactNode;
}

export const Providers = ({ children }: ProvidersProps) => {
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

import AppMiddleware from '@/components/common/Middlewares/AppMiddleware';
import BroadcastChannelRegistry from '@/components/common/Registry/BroadcastChannelRegistry';
import OMSRegistry from '@/components/common/Registry/OMSRegistry';
import QueryClientRegistry from '@/components/common/Registry/QueryClientRegistry';
import StyledComponentsRegistry from '@/components/common/Registry/StyledComponentsRegistry';
import ToastRegistry from '@/components/common/Registry/ToastRegistry';
import ClockProvider from '@/contexts/ClockContext';
import dynamic from 'next/dynamic';
import ReduxToolkitRegistry from './Registry/ReduxToolkitRegistry';

const LightstreamRegistry = dynamic(() => import('@/components/common/Registry/LightstreamRegistry'), {
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
									<ToastRegistry>{children}</ToastRegistry>
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

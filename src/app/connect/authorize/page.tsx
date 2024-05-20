import Loading from '@/components/common/Loading';
import type { NextPage } from 'next';

const Page: NextPage<INextProps> = async () => {
	// useEffect(() => {
	// 	try {
	// 		const params = new URLSearchParams(location.search);

	// 		const brokerCode = params.get('brokerCode') ?? '';
	// 		let clientId = params.get('client_id') ?? '';
	// 		clientId = clientId.replace(/\s/gi, '+');

	// 		if (clientId && brokerCode) {
	// 			setBrokerClientId(`${clientId}^${brokerCode}`);

	// 			try {
	// 				const channel = new BroadcastChannel(broadcastChannel);
	// 				channel.postMessage(JSON.stringify({ type: 'broker_registered', payload: clientId }));
	// 			} catch (e) {
	// 				//
	// 			}
	// 		}
	// 	} catch (e) {
	// 		//
	// 	} finally {
	// 		window.close();
	// 	}
	// }, []);

	return (
		<div className='p-8'>
			<div className='size-full rounded bg-white flex-justify-center'>
				<Loading />
			</div>
		</div>
	);
};

export default Page;

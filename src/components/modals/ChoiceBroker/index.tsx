import { useGetBrokersQuery } from '@/api/queries/brokerQueries';
import Loading from '@/components/common/Loading';
import NoData from '@/components/common/NoData';
import { XSVG } from '@/components/icons';
import { useAppDispatch } from '@/features/hooks';
import { setChoiceBrokerModal } from '@/features/slices/modalSlice';
import { useTranslations } from 'next-intl';
import { forwardRef } from 'react';
import styled from 'styled-components';
import Modal from '../Modal';
import Broker from './Broker';

const Div = styled.div`
	width: 578px;
	height: 560px;
	display: flex;
	padding: 2.4rem;
	flex-direction: column;
	border-radius: 1.6rem;
`;

interface ChoiceBrokerProps extends IBaseModalConfiguration { }

const ChoiceBroker = forwardRef<HTMLDivElement, ChoiceBrokerProps>((props, ref) => {
	const t = useTranslations();

	const dispatch = useAppDispatch();

	const { data: brokersData, isFetching } = useGetBrokersQuery({
		queryKey: ['getBrokersQuery'],
	});

	const onCloseModal = () => {
		dispatch(setChoiceBrokerModal(null));
	};

	const onSelectBroker = (broker: User.Broker) => {
		if (!broker?.ssoUrl) return;

		const features =
			'toolbar=no,location=no,status=no,menubar=no,scrollbars=no,resizable=no,width=400px,height=600px';
		window.open(broker.ssoUrl, '_blank', features);
	};

	return (
		<Modal
			style={{ modal: { transform: 'translate(-50%, -50%)' } }}
			top='50%'
			onClose={onCloseModal}
			{...props}
			ref={ref}
		>
			<Div className='bg-white'>
				<div key='close' className='absolute left-24 z-10'>
					<button onClick={onCloseModal} type='button' className='icon-hover'>
						<XSVG width='2rem' height='2rem' />
					</button>
				</div>

				<div className='relative mt-24 gap-24 text-center flex-column'>
					<h1 className='text-3xl font-bold text-gray-1000'>{t('choose_broker_modal.title')}</h1>
					<p
						style={{ maxWidth: '36rem' }}
						className='mx-auto text-center text-base font-bold text-primary-400'
					>
						{t('choose_broker_modal.description')}
					</p>
				</div>

				<div className='relative flex-1 gap-16 flex-justify-center'>
					{isFetching ? (
						<Loading />
					) : !brokersData?.length ? (
						<NoData />
					) : (
						brokersData.map((broker) => (
							<Broker key={broker.brokerCode} {...broker} onSelect={() => onSelectBroker(broker)} />
						))
					)}
				</div>
			</Div>
		</Modal>
	);
});

export default ChoiceBroker;

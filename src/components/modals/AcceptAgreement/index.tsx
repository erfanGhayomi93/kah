import brokerAxios from '@/api/brokerAxios';
import Checkbox from '@/components/common/Inputs/Checkbox';
import { XSVG } from '@/components/icons';
import { useAppDispatch } from '@/features/hooks';
import { getBrokerURLs } from '@/features/slices/brokerSlice';
import { setAcceptAgreementModal } from '@/features/slices/modalSlice';
import { type IAcceptAgreement } from '@/features/slices/types/modalSlice.interfaces';
import { store } from '@/features/store';
import { useMutation } from '@tanstack/react-query';
import { type AxiosError } from 'axios';
import { useTranslations } from 'next-intl';
import { forwardRef, useState } from 'react';
import styled from 'styled-components';
import Modal from '../Modal';
import OAuthSMS from './OAuthSMS';

interface AcceptAgreementProps extends IAcceptAgreement {}

const Div = styled.div`
	width: 600px;
`;

const AcceptAgreement = forwardRef<HTMLDivElement, AcceptAgreementProps>(({ data, getAgreements, ...props }, ref) => {
	const t = useTranslations();

	const [isRead, setIsRead] = useState(false);
	const [submiting, setSubmiting] = useState(false);

	const dispatch = useAppDispatch();

	const { mutate: sendRequest } = useMutation<unknown | null, AxiosError, Record<string, any>>({
		mutationFn: async (body) => {
			const urls = getBrokerURLs(store.getState());
			if (!urls) return null;
			const { data, status } = await brokerAxios.post<ServerResponse<unknown>>(urls.acceptAgreement, body);
			if (status !== 200 || !data.succeeded) throw new Error(data.errors?.[0] ?? '');

			return data.result;
		},
		onSuccess: () => {
			onCloseModal();
		},
	});

	const onCloseModal = () => {
		getAgreements();
		dispatch(setAcceptAgreementModal(null));
	};

	const onConfirm = () => {
		if (data.approveBySMS) {
			setSubmiting(true);
		} else {
			sendRequest({
				otp: null,
				agreementState: data.state === 'Accepted' ? 'NotAccepted' : 'Accepted',
				customerAgreementIds: [data.agreementId],
			});
		}
	};

	return (
		<Modal
			ref={ref}
			transparent
			style={{ modal: { transform: 'translate(-50%, -50%)', borderRadius: '1.6rem' } }}
			top='50%'
			onClose={onCloseModal}
			{...props}
		>
			<Div className='bg-white'>
				<div className='bg-gray-200 px-24 py-12 text-lg font-medium text-gray-900 flex-justify-between'>
					{submiting
						? data.state === 'Accepted'
							? t('settings_page.accept_agreement')
							: t('settings_page.deny_agreement')
						: data?.title ?? '-'}
					<button onClick={onCloseModal}>
						<XSVG width={'2rem'} height={'2rem'} />
					</button>
				</div>
				{submiting ? (
					<OAuthSMS {...{ sendRequest, ...data }} />
				) : (
					<div className='items-center justify-center py-24 gap-24 flex-column' style={{ maxHeight: 600 }}>
						<p className='overflow-auto whitespace-pre-line  px-24 text-justify text-base leading-10 text-gray-900'>
							{data?.description?.toString().replace(/\\n/g, '\n') ?? '-'}
						</p>

						<div className='w-full gap-8 px-24 flex-justify-between'>
							<span className='gap-8 flex-justify-start'>
								<Checkbox
									checked={isRead || data?.state === 'Accepted'}
									onChange={(value) => data?.canChangeByCustomer && setIsRead(value)}
									disabled={!data?.canChangeByCustomer}
									readOnly={!data?.canChangeByCustomer}
									classes={{
										checkbox: '!size-24 !rounded',
									}}
								/>
								{t('settings_page.read_and_agreed')}
							</span>
							<button
								onClick={onConfirm}
								type='button'
								disabled={!data.canChangeByCustomer || !isRead}
								className={'h-40 w-1/2 rounded font-medium btn-primary'}
							>
								{data?.state === 'Accepted' ? t('settings_page.unconfirm') : t('settings_page.confirm')}
							</button>
						</div>
					</div>
				)}
			</Div>
		</Modal>
	);
});

export default AcceptAgreement;

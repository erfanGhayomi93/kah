import brokerAxios from '@/api/brokerAxios';
import { store } from '@/api/inject-store';
import Checkbox from '@/components/common/Inputs/Checkbox';
import { useAppDispatch } from '@/features/hooks';
import { getBrokerURLs } from '@/features/slices/brokerSlice';
import { setAcceptAgreementModal } from '@/features/slices/modalSlice';
import { type IAcceptAgreement } from '@/features/slices/types/modalSlice.interfaces';
import { useMutation } from '@tanstack/react-query';
import { type AxiosError } from 'axios';
import { useTranslations } from 'next-intl';
import { forwardRef, useState } from 'react';
import styled from 'styled-components';
import Modal, { Header } from '../Modal';
import OAuthSMS from './OAuthSMS';

interface TMutationVariables {
	otp: string | null;
	agreementState: string;
	customerAgreementIds: number[];
}

interface AcceptAgreementProps extends IAcceptAgreement {}

const Div = styled.div`
	width: 600px;
`;

const AcceptAgreement = forwardRef<HTMLDivElement, AcceptAgreementProps>(({ data, getAgreements, ...props }, ref) => {
	const t = useTranslations('settings_page');

	const [isRead, setIsRead] = useState(false);
	const [submitting, setSubmitting] = useState(false);

	const dispatch = useAppDispatch();

	const { mutate: sendAcceptRequest } = useMutation<unknown | null, AxiosError, TMutationVariables>({
		mutationFn: async (body) => {
			const urls = getBrokerURLs(store.getState());
			if (!urls) return null;

			const { data, status } = await brokerAxios.post<ServerResponse<unknown>>(urls.AgreementsAccept, body);
			if (status !== 200 || !data.succeeded) throw new Error(data.errors?.[0] ?? '');

			return data?.result;
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
			setSubmitting(true);
		} else {
			sendAcceptRequest({
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
			<Div className='darkBlue:bg-gray-50 bg-white dark:bg-gray-50'>
				<Header
					label={
						submitting
							? data.state === 'Accepted'
								? t('accept_agreement')
								: t('deny_agreement')
							: data?.title ?? '-'
					}
					onClose={onCloseModal}
				/>
				{submitting ? (
					<OAuthSMS {...{ sendRequest: sendAcceptRequest, ...data }} />
				) : (
					<div className='justify-between gap-24 py-24 flex-column' style={{ height: 600 }}>
						<p className='overflow-auto whitespace-pre-line  px-24 text-justify text-base leading-10 text-gray-700'>
							{data?.description?.toString().replace(/\\n/g, '\n') ?? '-'}
						</p>

						<div className='gap-8 px-24 flex-justify-between'>
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
								{t('read_and_agreed')}
							</span>
							<button
								onClick={onConfirm}
								type='button'
								disabled={!data.canChangeByCustomer || !isRead}
								className={'h-40 w-1/2 rounded font-medium btn-primary'}
							>
								{data?.state === 'Accepted' ? t('unconfirm') : t('confirm')}
							</button>
						</div>
					</div>
				)}
			</Div>
		</Modal>
	);
});

export default AcceptAgreement;

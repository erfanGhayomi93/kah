import brokerAxios, { type AxiosError } from '@/api/brokerAxios';
import Countdown from '@/components/common/Countdown';
import { useAppSelector } from '@/features/hooks';
import { getBrokerURLs } from '@/features/slices/brokerSlice';
import { useMutation, type UseMutateFunction } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import {
	useEffect,
	useState,
	type ClipboardEventHandler,
	type DetailedHTMLProps,
	type FormEvent,
	type InputHTMLAttributes,
} from 'react';

interface TMutationVariables {
	otp: string | null;
	agreementState: string;
	customerAgreementIds: number[];
}

interface OAuthSMSProps extends Settings.IAgreements {
	sendRequest: UseMutateFunction<unknown, AxiosError, TMutationVariables>;
}

const OAuthSMS = ({ sendRequest, ...props }: OAuthSMSProps) => {
	const t = useTranslations('settings_page');

	const [otpValue, setOTPValue] = useState<string[]>(['', '', '', '', '', '']);

	const brokerURLs = useAppSelector(getBrokerURLs);

	const [isSubmitting, setIsSubmitting] = useState(false);

	const { data: otpData, mutate: getOtpData } = useMutation<Settings.IMobileOTP | null, AxiosError, string | null>({
		mutationFn: async () => {
			try {
				if (!brokerURLs) throw new Error();

				const { data, status } = await brokerAxios.post<ServerResponse<Settings.IMobileOTP>>(
					brokerURLs.mobileOtpRequest,
				);
				if (status !== 200 || !data.succeeded) throw new Error(data.errors?.[0] ?? '');

				return data?.result;
			} catch (e) {
				return null;
			}
		},
		onSuccess: () => {
			setIsSubmitting(true);
		},
	});

	useEffect(() => {
		brokerURLs && getOtpData(null);
	}, [brokerURLs]);

	useEffect(() => {
		if (otpValue.filter(Boolean).length === 6) {
			sendRequest({
				otp: otpValue.join('') || null,
				agreementState: props.state === 'Accepted' ? 'NotAccepted' : 'Accepted',
				customerAgreementIds: [props.agreementId],
			});
		}
	}, [otpValue]);

	const focusNextElement = (el: HTMLInputElement, value: string) => {
		try {
			const nextElement = (
				value || value === '0' ? el.nextElementSibling : el.previousElementSibling
			) as HTMLInputElement | null;
			if (!isNaN(+value)) {
				setOTPValue((prev) => prev.map((item, index) => (index === +el.id ? value : item)));
				if (nextElement) {
					nextElement.focus();
					return;
				}

				value && el.blur();
			}
		} catch (e) {
			//
		}
	};

	const handleFormChange = (e: FormEvent<HTMLFormElement>) => {
		try {
			const target = e.target as HTMLInputElement;
			const value = target.value;
			focusNextElement(target, value);
		} catch (e) {
			//
		}
	};

	const handlePaste: ClipboardEventHandler<HTMLFormElement> = (e) => {
		const value = e.clipboardData.getData('text');
		if (!isNaN(Number(value))) {
			const formattedValue = value.split('');
			setOTPValue((prev) => prev.map((item, index) => formattedValue[index] || ''));
			e.stopPropagation();
		}
	};

	return (
		<div className='items-center gap-32 py-24 flex-column'>
			<Image width={70} height={70} className='size-auto' src='/static/images/passcode.png' alt='' />
			{otpData ? (
				<>
					<h6 className='text-info-100 font-medium rtl'>
						{t('code_has_been_sent', { phoneNumber: otpData?.starredMessage, count: 6 })}
					</h6>

					<form
						autoComplete='off'
						className='w-full gap-18 px-16 ltr flex-justify-center'
						onInput={handleFormChange}
						onPaste={handlePaste}
					>
						<OTPInput autoFocus id='0' value={otpValue[0]} />
						<OTPInput id='1' value={otpValue[1]} />
						<OTPInput id='2' value={otpValue[2]} />
						<OTPInput id='3' value={otpValue[3]} />
						<OTPInput id='4' value={otpValue[4]} />
						<OTPInput id='5' value={otpValue[5]} />
					</form>
					<div className='gap-8 pb-24 flex-justify-center'>
						{isSubmitting ? (
							<>
								<p className='text-gray-500'>{t('resend_code_after')}:</p>
								<span className='text-info-100'>
									<Countdown
										onFinished={() => setIsSubmitting(false)}
										seconds={otpData?.expireDate || 120}
										key={otpData?.expireDate}
									/>
								</span>
							</>
						) : (
							<button className='text-info-100' onClick={() => brokerURLs && getOtpData(null)}>
								{t('resend_code')}
							</button>
						)}
					</div>
				</>
			) : (
				<button className='text-error-100 h-full' onClick={() => brokerURLs && getOtpData(null)}>
					{t('error_occured')}
				</button>
			)}
		</div>
	);
};

const OTPInput = (props: DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>) => (
	<input
		type='text'
		maxLength={1}
		onChange={() => {}}
		onPaste={(e) => e.preventDefault()}
		onFocus={(e) => {
			try {
				e.target.setSelectionRange(0, 1);
			} catch (error) {
				//
			}
		}}
		className='border-gray-200 bg-gray-100 focus:border-info-100 focus:text-info-100 size-64 rounded border  p-8 text-center text-3xl ltr focus:bg-transparent'
		{...props}
	/>
);

export default OAuthSMS;

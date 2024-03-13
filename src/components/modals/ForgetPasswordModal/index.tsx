import axios from '@/api/axios';
import routes from '@/api/routes';
import Loading from '@/components/common/Loading';
import { useAppDispatch } from '@/features/hooks';
import { toggleForgetPasswordModal, toggleLoginModal, type IForgetPasswordModal } from '@/features/slices/modalSlice';
import { useTranslations } from 'next-intl';
import dynamic from 'next/dynamic';
import { useState } from 'react';
import { toast } from 'react-toastify';
import AuthenticationModalTemplate from '../common/AuthenticationModalTemplate';
import OTPForm from './OTPForm';
import PhoneNumberForm from './PhoneNumberForm';

const ChangePasswordForm = dynamic(() => import('./ChangePasswordForm'), {
	ssr: false,
	loading: () => <Loading />,
});

interface ForgetPasswordModalProps extends IForgetPasswordModal {}

const ForgetPasswordModal = ({ phoneNumber: pNumber, ...props }: ForgetPasswordModalProps) => {
	const t = useTranslations();

	const dispatch = useAppDispatch();

	const [result, setResult] = useState<
		null | OAuthAPI.IForgetPasswordFirstStep | OAuthAPI.IValidateForgetPasswordOtp
	>(null);

	const [stage, setStage] = useState<'phoneNumber' | 'otp' | 'change-password'>(pNumber ? 'otp' : 'phoneNumber');

	const [phoneNumber, setPhoneNumber] = useState<string>(pNumber ?? '');

	const onCloseModal = () => {
		dispatch(toggleForgetPasswordModal(null));
	};

	const onPasswordChanged = () => {
		toast.success(t('alerts.password_changed_successfully'), { autoClose: 3500 });

		dispatch(toggleForgetPasswordModal(null));
		dispatch(toggleLoginModal({ animation: false }));
	};

	const sendOTP = async (otpPhoneNumber?: string) => {
		return new Promise<OAuthAPI.IForgetPasswordFirstStep>(async (resolve, reject) => {
			try {
				const response = await axios.post<ServerResponse<OAuthAPI.IForgetPasswordFirstStep>>(
					routes.authentication.ForgetPasswordFirstStep,
					{
						mobileNumber: otpPhoneNumber ?? phoneNumber,
					},
				);
				const { data } = response;

				if (response.status !== 200 || !data.succeeded) throw new Error(data.errors?.[0] ?? '');

				setResult(data.result);
				resolve(data.result);
			} catch (e) {
				reject();
			}
		});
	};

	return (
		<AuthenticationModalTemplate title={t('forget_password_modal.title')} onClose={onCloseModal} {...props}>
			{stage === 'phoneNumber' && (
				<PhoneNumberForm
					setResult={setResult}
					sendOTP={sendOTP}
					setPhoneNumber={setPhoneNumber}
					goToOTP={() => setStage('otp')}
				/>
			)}
			{stage === 'otp' && (
				<OTPForm
					phoneNumber={phoneNumber}
					setResult={setResult}
					sendOTP={sendOTP}
					result={result as null | OAuthAPI.IForgetPasswordFirstStep}
					goToChangePassword={() => setStage('change-password')}
					goToPhoneNumber={() => setStage('phoneNumber')}
				/>
			)}
			{stage === 'change-password' && (
				<ChangePasswordForm
					phoneNumber={phoneNumber}
					result={result as OAuthAPI.IValidateForgetPasswordOtp}
					onPasswordChanged={onPasswordChanged}
				/>
			)}
		</AuthenticationModalTemplate>
	);
};

export default ForgetPasswordModal;

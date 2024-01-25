import axios from '@/api/axios';
import routes from '@/api/routes';
import { useAppDispatch } from '@/features/hooks';
import { toggleForgetPasswordModal } from '@/features/slices/modalSlice';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import AuthenticationModalTemplate from '../common/AuthenticationModalTemplate';
import ChangePasswordForm from './ChangePasswordForm';
import OTPForm from './OTPForm';
import PasswordChangedSuccessfully from './PasswordChangedSuccessfully';
import PhoneNumberForm from './PhoneNumberForm';

interface ForgetPasswordModalProps {
	phoneNumber?: string;
}

const ForgetPasswordModal = ({ phoneNumber: pNumber }: ForgetPasswordModalProps) => {
	const t = useTranslations();

	const dispatch = useAppDispatch();

	const [result, setResult] = useState<
		null | OAuthAPI.IForgetPasswordFirstStep | OAuthAPI.IValidateForgetPasswordOtp
	>(null);

	const [stage, setStage] = useState<'phoneNumber' | 'otp' | 'change-password' | 'password-changed-successfully'>(
		pNumber ? 'otp' : 'phoneNumber',
	);

	const [phoneNumber, setPhoneNumber] = useState<string>(pNumber ?? '');

	const onCloseModal = () => {
		dispatch(toggleForgetPasswordModal(null));
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
		<AuthenticationModalTemplate title={t('forget_password_modal.title')} onClose={onCloseModal}>
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
					result={result as OAuthAPI.IValidateForgetPasswordOtp}
					onPasswordChanged={() => setStage('password-changed-successfully')}
				/>
			)}
			{stage === 'password-changed-successfully' && <PasswordChangedSuccessfully />}
		</AuthenticationModalTemplate>
	);
};

export default ForgetPasswordModal;

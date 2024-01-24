import axios from '@/api/axios';
import routes from '@/api/routes';
import { useAppDispatch } from '@/features/hooks';
import { toggleForgetPasswordModal, toggleLoginModal } from '@/features/slices/modalSlice';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import AuthenticationModalTemplate from '../common/AuthenticationModalTemplate';
import ChangePasswordForm from './ChangePasswordForm';
import OTPForm from './OTPForm';
import PhoneNumberForm from './PhoneNumberForm';

interface ForgetPasswordModalProps {
	phoneNumber?: string;
}

const ForgetPasswordModal = ({ phoneNumber }: ForgetPasswordModalProps) => {
	const t = useTranslations();

	const dispatch = useAppDispatch();

	const [result, setResult] = useState<
		null | OAuthAPI.IForgetPasswordFirstStep | OAuthAPI.IValidateForgetPasswordOtp
	>(null);

	const [stage, setStage] = useState<'phoneNumber' | 'otp' | 'change-password'>(phoneNumber ? 'otp' : 'phoneNumber');

	const onCloseModal = () => {
		dispatch(toggleForgetPasswordModal(null));
	};

	const sendOTP = async (pNumber?: string) => {
		return new Promise<OAuthAPI.IForgetPasswordFirstStep>(async (resolve, reject) => {
			try {
				const response = await axios.post<ServerResponse<OAuthAPI.IForgetPasswordFirstStep>>(
					routes.authentication.ForgetPasswordFirstStep,
					{
						mobileNumber: pNumber ?? phoneNumber,
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

	const goToLogin = () => {
		dispatch(toggleLoginModal(true));
		onCloseModal();
	};

	return (
		<AuthenticationModalTemplate title={t('forget_password_modal.title')} onClose={onCloseModal}>
			{stage === 'phoneNumber' && (
				<PhoneNumberForm setResult={setResult} sendOTP={sendOTP} goToOTP={() => setStage('otp')} />
			)}
			{stage === 'otp' && (
				<OTPForm
					setResult={setResult}
					sendOTP={sendOTP}
					result={result as null | OAuthAPI.IForgetPasswordFirstStep}
					goToChangePassword={() => setStage('change-password')}
				/>
			)}
			{stage === 'change-password' && (
				<ChangePasswordForm result={result as OAuthAPI.IValidateForgetPasswordOtp} goToLogin={goToLogin} />
			)}
		</AuthenticationModalTemplate>
	);
};

export default ForgetPasswordModal;

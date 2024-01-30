import { useAppDispatch } from '@/features/hooks';
import { toggleForgetPasswordModal } from '@/features/slices/modalSlice';
import { useTranslations } from 'next-intl';

const PasswordChangedSuccessfully = () => {
	const t = useTranslations();

	const dispatch = useAppDispatch();

	const onCloseModal = () => {
		dispatch(toggleForgetPasswordModal(null));
	};

	return (
		<div className='flex-1 flex-justify-center'>
			<div className='items-center gap-16 pb-48 flex-column'>
				<svg width='4rem' height='4rem' viewBox='0 0 40 40' fill='none' xmlns='http://www.w3.org/2000/svg'>
					<path
						d='M10.6668 19.9999L17.8831 26.0135C18.3134 26.372 18.9542 26.3073 19.3041 25.8699L29.3335 13.3333M20.0002 38.6666C17.5488 38.6666 15.1215 38.1838 12.8567 37.2457C10.592 36.3076 8.5342 34.9326 6.80084 33.1992C5.06748 31.4659 3.6925 29.4081 2.75441 27.1433C1.81632 24.8786 1.3335 22.4513 1.3335 19.9999C1.3335 17.5486 1.81632 15.1212 2.75441 12.8565C3.6925 10.5918 5.06748 8.53395 6.80084 6.80059C8.5342 5.06723 10.592 3.69225 12.8567 2.75417C15.1215 1.81608 17.5488 1.33325 20.0002 1.33325C24.9509 1.33325 29.6988 3.29991 33.1995 6.80059C36.7002 10.3013 38.6668 15.0492 38.6668 19.9999C38.6668 24.9506 36.7002 29.6986 33.1995 33.1992C29.6988 36.6999 24.9509 38.6666 20.0002 38.6666Z'
						stroke='currentColor'
						stroke-width='2'
						stroke-linecap='round'
						className='text-success-100'
					/>
				</svg>

				<span className='text-base text-success-100'>
					{t('forget_password_modal.password_changed_successfully')}
				</span>
			</div>

			<div
				style={{
					bottom: '6.4rem',
				}}
				className='absolute w-full px-64 flex-column'
			>
				<button onClick={onCloseModal} type='button' className='text-lg font-bold text-primary-400'>
					{t('forget_password_modal.go_to_homepage')}
				</button>
			</div>
		</div>
	);
};

export default PasswordChangedSuccessfully;

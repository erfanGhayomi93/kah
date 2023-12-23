import { useAppDispatch } from '@/features/hooks';
import { toggleAuthenticationModal } from '@/features/slices/modalSlice';
import Image from 'next/image';

const Welcome = () => {
	const dispatch = useAppDispatch();

	const onCloseModal = () => {
		dispatch(toggleAuthenticationModal(false));
	};

	return (
		<div className='flex flex-1 flex-col items-center justify-between'>
			<div className='flex flex-col gap-24'>
				<Image width='280' height='248' alt='welcome' src='/static/images/successfully-login.png' />
				<h1 className='text-center text-4xl font-bold text-primary-300'>به کهکشان خوش آمدید!</h1>
			</div>

			<div className='flex w-full flex-col gap-24 px-64'>
				<h3 className='text-center text-base font-bold text-primary-300'>
					برای تجربه ی کاربری بهتر، می توانید رمز عبور تعیین کنید.
				</h3>

				<div className='flex flex-col gap-16'>
					<button type='button' className='h-48 rounded btn-primary'>
						تعیین رمز عبور
					</button>

					<button onClick={onCloseModal} type='button' className='font-medium text-primary-300'>
						بی‌خیال
					</button>
				</div>
			</div>
		</div>
	);
};

export default Welcome;
